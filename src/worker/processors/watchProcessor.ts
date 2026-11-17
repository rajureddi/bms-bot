import { Job } from 'bullmq';
import { JobStatus } from '@prisma/client';
import { InputFile } from 'grammy';
import { jobService, JobWithUser } from '../jobService.js';
import { notificationService } from '../notificationService.js';
import { bookingQueue } from '../queues.js';
import { logger } from '../../utils/logger.js';
import { launchBrowser, createContext, createPage } from '../../automation/browser.js';
import { HomePage } from '../../automation/pages/HomePage.js';
import { ShowtimesPage } from '../../automation/pages/ShowtimesPage.js';
import { mismatchActionKeyboard } from '../../bot/menus/keyboards.js';
import { bot } from '../../bot/index.js';
import * as fs from 'fs';
import * as path from 'path';

export interface WatchJobData {
  jobId: string;
}

export interface WatchResult {
  ticketsFound: boolean;
  theatre?: string;
  showtime?: string;
  error?: string;
}

interface PreferenceMatchResult {
  matched: boolean;
  mismatchType?: 'format' | 'language' | 'screen' | 'time' | 'theatre';
  error?: string;
}

function checkPreferenceMatch(
  showtimePrefs: {
    preferredFormats?: string[];
    preferredLanguages?: string[];
    preferredScreens?: string[];
    preferredTimes?: string[];
  },
  availableOptions: Array<{
    format: string;
    language: string;
    screen?: string;
    times: string[];
  }>
): PreferenceMatchResult {
  if (availableOptions.length === 0) {
    return { matched: false, mismatchType: 'theatre', error: 'No showtimes available' };
  }

  const hasFormat = !showtimePrefs.preferredFormats?.length ||
    availableOptions.some(opt =>
      showtimePrefs.preferredFormats!.some(pf =>
        opt.format.toUpperCase().includes(pf.toUpperCase())
      )
    );

  const hasLanguage = !showtimePrefs.preferredLanguages?.length ||
    availableOptions.some(opt =>
      showtimePrefs.preferredLanguages!.some(pl =>
        opt.language.toUpperCase().includes(pl.toUpperCase())
      )
    );

  const hasScreen = !showtimePrefs.preferredScreens?.length ||
    availableOptions.some(opt =>
      opt.screen && showtimePrefs.preferredScreens!.some(ps =>
        opt.screen!.toUpperCase().includes(ps.toUpperCase())
      )
    );

  const hasTime = !showtimePrefs.preferredTimes?.length ||
    availableOptions.some(opt =>
      opt.times.some(t =>
        showtimePrefs.preferredTimes!.some(pt =>
          t.includes(pt) || pt.includes(t)
        )
      )
    );

  if (!hasFormat) {
    return { matched: false, mismatchType: 'format', error: 'Preferred format not available' };
  }
  if (!hasLanguage) {
    return { matched: false, mismatchType: 'language', error: 'Preferred language not available' };
  }
  if (!hasScreen) {
    return { matched: false, mismatchType: 'screen', error: 'Preferred screen type not available' };
  }
  if (!hasTime) {
    return { matched: false, mismatchType: 'time', error: 'Preferred showtime not available' };
  }

  return { matched: true };
}

const DEBUG_DIR = 'screenshots/watch-debug';

// Ensure debug directory exists
if (!fs.existsSync(DEBUG_DIR)) {
  fs.mkdirSync(DEBUG_DIR, { recursive: true });
}

async function saveDebugInfo(page: any, jobId: string, stage: string): Promise<void> {
  const timestamp = Date.now();
  const prefix = `${DEBUG_DIR}/${jobId}-${stage}-${timestamp}`;

  try {
    // Save screenshot
    await page.screenshot({ path: `${prefix}.png`, fullPage: true });
    logger.info('Debug screenshot saved', { path: `${prefix}.png` });

    // Save page HTML
    const html = await page.content();
    fs.writeFileSync(`${prefix}.html`, html);
    logger.info('Debug HTML saved', { path: `${prefix}.html` });

    // Save relevant element info
    const debugInfo: any = {
      url: page.url(),
      timestamp: new Date().toISOString(),
      stage,
    };

    // Check for various elements
    const selectors = [
      { name: 'venueList', selector: '[class*="venue"]' },
      { name: 'cinemaList', selector: '[class*="cinema"]' },
      { name: 'theatreList', selector: '[class*="theatre"]' },
      { name: 'showtimeList', selector: '[class*="showtime"]' },
      { name: 'virtualizedGrid', selector: '.ReactVirtualized__Grid' },
      { name: 'scE8nk8f', selector: '[class*="sc-e8nk8f"]' },
      { name: 'sc1la7659', selector: '[class*="sc-1la7659"]' },
      { name: 'buytickets', selector: 'a[href*="/buytickets/"]' },
      { name: 'sessionBtn', selector: '[class*="session"]' },
      { name: 'datePill', selector: '[id^="2025"], [id^="2026"]' },
    ];

    for (const { name, selector } of selectors) {
      const count = await page.locator(selector).count();
      debugInfo[name] = { count };
      if (count > 0 && count <= 5) {
        const texts: string[] = [];
        for (let i = 0; i < count; i++) {
          const text = await page.locator(selector).nth(i).textContent().catch(() => '');
          texts.push(text?.substring(0, 100) || '');
        }
        debugInfo[name].samples = texts;
      }
    }

    fs.writeFileSync(`${prefix}.json`, JSON.stringify(debugInfo, null, 2));
    logger.info('Debug info saved', { path: `${prefix}.json` });
  } catch (error) {
    logger.error('Failed to save debug info', { error: String(error) });
  }
}

/**
 * Process a watch job - check if tickets are available for the specified movie
 */
export async function processWatchJob(job: Job<WatchJobData>): Promise<WatchResult> {
  const { jobId } = job.data;

  logger.info('Processing watch job', { jobId, bullmqJobId: job.id });

  // Get job details from database
  const bookingJob = await jobService.getJobWithUser(jobId);
  if (!bookingJob) {
    logger.error('Job not found in database', { jobId });
    return { ticketsFound: false, error: 'Job not found' };
  }

  // Check if job is still in a watchable state
  if (bookingJob.status !== JobStatus.PENDING && bookingJob.status !== JobStatus.WATCHING) {
    logger.info('Job no longer in watchable state', { jobId, status: bookingJob.status });
    return { ticketsFound: false, error: 'Job no longer active' };
  }

  // Check if watch window has expired
  const now = new Date();
  if (now > bookingJob.watchUntilDate) {
    const prefs = bookingJob.showtimePrefs as any;
    // Auto-extend for future releases (like Avengers: Doomsday in December)
    if (bookingJob.movieName.toLowerCase().includes('avengers') || prefs?.preferredDates?.some((d: string) => d.includes('17') || d.includes('18'))) {
      const extendedUntil = new Date(2026, 11, 19, 23, 59, 59);
      const { prisma } = await import('../../db/client.js');
      await prisma.bookingJob.update({
        where: { id: jobId },
        data: { watchUntilDate: extendedUntil },
      });
      bookingJob.watchUntilDate = extendedUntil;
      logger.info('Auto-extended watch window for advance December booking', { jobId, watchUntilDate: extendedUntil });
    } else {
      logger.info('Job watch window expired', { jobId, watchUntilDate: bookingJob.watchUntilDate });
      await jobService.updateJobResult(jobId, JobStatus.FAILED, {
        error: 'Watch window expired',
      });
      await notificationService.notify(bookingJob.user.telegramId, {
        type: 'job_expired',
        jobId,
        movieName: bookingJob.movieName,
      });
      return { ticketsFound: false, error: 'Watch window expired' };
    }
  }

  // Update status to WATCHING if it was PENDING
  if (bookingJob.status === JobStatus.PENDING) {
    await jobService.updateJobStatus(jobId, JobStatus.WATCHING);
    await notificationService.notify(bookingJob.user.telegramId, {
      type: 'job_started',
      jobId,
      movieName: bookingJob.movieName,
    });
  }

  // Launch browser and check for tickets
  let browser = null;
  try {
    browser = await launchBrowser();
    const context = await createContext(browser);
    const page = await createPage(context);

    const showtimePrefs = (bookingJob.showtimePrefs || {}) as {
      preferredDates?: string[];
      preferredTimes?: string[];
      preferredFormats?: string[];
      preferredLanguages?: string[];
      preferredScreens?: string[];
      directUrl?: string;
    };

    // If direct BMS URL is specified, or for Avengers Doomsday in Hyderabad, navigate directly
    let directUrl = showtimePrefs.directUrl;
    if (!directUrl && bookingJob.movieName.toLowerCase().includes('avengers') && bookingJob.city.toLowerCase() === 'hyderabad') {
      const defaultDate = showtimePrefs.preferredDates?.[0]?.replace(/\D/g, '') || '17';
      directUrl = `https://in.bookmyshow.com/movies/hyderabad/avengers-doomsday/buytickets/ET00526320/202612${defaultDate.padStart(2, '0')}?etCodes=*&language=english&refEventCode=ET00526320`;
    }

    let showtimesPage: ShowtimesPage;

    if (directUrl) {
      logger.info('Navigating directly to BookMyShow showtimes URL', { jobId, directUrl });
      await page.goto(directUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
      await page.waitForTimeout(2000);
      showtimesPage = new ShowtimesPage(page);
    } else {
      // Navigate to movie page
      const homePage = new HomePage(page);
      await homePage.navigate(bookingJob.city);

      // Search for the movie
      const movieFound = await homePage.clickMovieCard(bookingJob.movieName);
      if (!movieFound) {
        await homePage.searchMovie(bookingJob.movieName);
        const selected = await homePage.selectMovieFromSearch(bookingJob.movieName);
        if (!selected) {
          logger.info('Movie not found on BMS', { jobId, movieName: bookingJob.movieName });
          return { ticketsFound: false, error: 'Movie not found' };
        }
      }

      // Click book tickets button
      await homePage.clickBookTickets();

      // Handle language/format dialog if it appears
      await homePage.handleLanguageFormatDialog(
        showtimePrefs.preferredLanguages,
        showtimePrefs.preferredFormats
      );

      showtimesPage = new ShowtimesPage(page);
      await page.waitForTimeout(2000);
    }

    // Save debug info before checking showtimes
    await saveDebugInfo(page, jobId, 'before-showtime-check');

    // Dates to check: prioritize user preferred dates or default to 17 & 18 for advance releases
    const targetDates = (showtimePrefs.preferredDates && showtimePrefs.preferredDates.length > 0)
      ? showtimePrefs.preferredDates
      : (bookingJob.movieName.toLowerCase().includes('avengers') ? ['17', '18'] : []);

    const datesToCheck = targetDates.length > 0 ? targetDates : [undefined];

    for (const targetDate of datesToCheck) {
      if (targetDate) {
        logger.info('Checking date for tickets', { jobId, targetDate });
        const dateSelected = await showtimesPage.selectDateByDay(targetDate);
        if (dateSelected) {
          await page.waitForTimeout(1500);
        }
      }

      const hasShowtimes = await showtimesPage.waitForShowtimes();
      if (!hasShowtimes) {
        logger.info('No showtimes available on date', { jobId, targetDate });
        continue;
      }

      // Try each preferred theatre
      for (const theatre of bookingJob.theatres) {
        const found = await showtimesPage.selectTheatreShowtime(
          theatre,
          showtimePrefs.preferredTimes || [],
          {
            screens: showtimePrefs.preferredScreens,
            formats: showtimePrefs.preferredFormats,
            languages: showtimePrefs.preferredLanguages,
          }
        );

        if (found) {
          const screenLabel = showtimePrefs.preferredScreens?.join(', ') || 'Standard';
          const dateLabel = targetDate ? `${targetDate} Dec` : 'Available Date';
          logger.info('🎯 MATCHING TICKETS FOUND!', {
            jobId,
            movieName: bookingJob.movieName,
            theatre,
            date: dateLabel,
            screens: screenLabel
          });

          // Update job status to BOOKING
          await jobService.updateJobStatus(jobId, JobStatus.BOOKING);

          // Notify user immediately with loud alert
          await notificationService.notify(bookingJob.user.telegramId, {
            type: 'tickets_found',
            jobId,
            movieName: `${bookingJob.movieName} [${screenLabel}]`,
            theatre: `${theatre} • ${dateLabel}`,
          });

          // Add to booking queue
          logger.info('Adding job to booking queue', { jobId });
          await bookingQueue.add(
            `booking-${jobId}`,
            { jobId },
            { jobId: `booking-${jobId}` }
          );

          await context.close();
          await browser.close();

          return {
            ticketsFound: true,
            theatre,
          };
        }
      }
    }

    // If we reached here, the specific tickets (e.g. PCX screen) are not open yet
    logger.info('Watch cycle completed - target screen/showtimes not opened yet. Keeping 24/7 watch active.', {
      jobId,
      theatres: bookingJob.theatres,
      screens: showtimePrefs.preferredScreens,
      dates: targetDates
    });

    await context.close();
    await browser.close();

    return { ticketsFound: false };

  } catch (error) {
    logger.error('Watch job failed', { jobId, error: String(error) });

    if (browser) {
      await browser.close().catch(() => {});
    }

    return { ticketsFound: false, error: String(error) };
  }
}
