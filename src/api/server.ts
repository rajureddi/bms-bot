import fastify, { FastifyInstance } from 'fastify';
import { getWebAppHtml } from './webappHtml.js';
import { logger } from '../utils/logger.js';
import { userService } from '../services/userService.js';
import { jobService } from '../worker/jobService.js';
import { notificationService } from '../worker/notificationService.js';
import { watchQueue } from '../worker/queues.js';

let server: FastifyInstance | null = null;

export async function createServer(): Promise<FastifyInstance> {
  const app = fastify({
    logger: false,
  });

  // Healthcheck endpoint (for Railway and monitoring)
  app.get('/health', async (_req, reply) => {
    return reply.status(200).send({ status: 'ok', time: new Date().toISOString() });
  });

  // Telegram WebApp UI page
  app.get('/', async (_req, reply) => {
    return reply.type('text/html').send(getWebAppHtml());
  });

  app.get('/webapp', async (_req, reply) => {
    return reply.type('text/html').send(getWebAppHtml());
  });

  // API to fetch popular movies
  app.get('/api/movies', async (_req, reply) => {
    return reply.send({
      movies: [
        { title: 'Avengers: Doomsday', advance: '17 Dec', genre: 'Action / Sci-Fi', rating: 9.8 },
        { title: 'Pushpa 2: The Rule', advance: null, genre: 'Action / Drama', rating: 9.4 },
        { title: 'Avatar: Fire and Ash', advance: 'Dec 2026', genre: 'Sci-Fi / 3D', rating: 9.7 },
        { title: 'Kalki 2898 AD', advance: null, genre: 'Sci-Fi / Mythology', rating: 9.1 },
      ],
    });
  });

  // API to create a booking job from the Mini App
  app.post('/api/jobs', async (req, reply) => {
    try {
      const body = req.body as {
        movieName?: string;
        city?: string;
        theatre?: string;
        date?: string;
        time?: string;
        seatCount?: number;
        category?: string;
        telegramUserId?: string;
        telegramUser?: { id: number; first_name?: string; username?: string };
      };

      const movieName = body.movieName || 'Avengers: Doomsday';
      const city = (body.city || 'hyderabad').toLowerCase();
      const theatre = body.theatre || 'Prasads Multiplex';
      const date = body.date || '17';
      const time = body.time === 'Any Time' ? undefined : body.time;
      const seatCount = body.seatCount || 2;

      // Identify user: from request, or fallback to the latest registered user in database
      let telegramId = body.telegramUserId || body.telegramUser?.id?.toString();
      if (!telegramId || telegramId === 'webapp_user') {
        const { prisma } = await import('../db/client.js');
        const latestUser = await prisma.user.findFirst({
          orderBy: { updatedAt: 'desc' },
        });
        telegramId = latestUser ? latestUser.telegramId : '647187240';
      }

      const user = await userService.getOrCreate(telegramId);

      const now = new Date();
      let watchUntil = new Date();
      const dayNum = parseInt(date, 10);
      if (!isNaN(dayNum)) {
        watchUntil.setDate(dayNum);
        if (watchUntil < now) {
          watchUntil.setMonth(watchUntil.getMonth() + 1);
        }
      } else {
        watchUntil.setDate(now.getDate() + 30);
      }
      watchUntil.setHours(23, 59, 59, 999);

      const job = await jobService.createJob({
        userId: user.id,
        movieName,
        city,
        watchFromDate: now,
        watchUntilDate: watchUntil,
        theatres: [theatre],
        showtimePrefs: {
          preferredDates: [date],
          preferredTimes: time ? [time] : undefined,
        },
        seatPrefs: {
          count: seatCount,
          preferCenter: true,
          needAdjacent: true,
        },
      });

      // Immediately enqueue for watching
      await watchQueue.add(
        `watch-${job.id}`,
        { jobId: job.id },
        { jobId: `watch-${job.id}-${Date.now()}`, delay: 1000 }
      ).catch((err) => logger.warn('Failed to enqueue watch job from API', { error: String(err) }));

      // Send Telegram confirmation card directly to the user
      try {
        const { bot } = await import('../bot/index.js');
        await bot.api.sendMessage(
          telegramId,
          `🎬 *Booking Job Created from BMS App!*\n\n` +
          `Job ID: \`${job.id.substring(0, 8)}\`\n` +
          `Movie: *${movieName}*\n` +
          `City: *${city}*\n` +
          `Theatre: *${theatre}*\n` +
          `Date: *${date} Dec / Selected*\n` +
          `Time: *${time || 'Any Time (All Shows)'}*\n` +
          `Seats: *${seatCount} Seats (Center & Adjacent Preferred)*\n\n` +
          `🚀 *Monitoring BookMyShow 24/7!*\n` +
          `You will receive an instant notification when tickets open. Use /myjobs to view your active jobs.`,
          { parse_mode: 'Markdown' }
        );
      } catch (err) {
        logger.warn('Failed to send Telegram message from API', { error: String(err) });
      }

      return reply.send({ success: true, jobId: job.id });
    } catch (error) {
      logger.error('Failed to create job via API', { error: String(error) });
      return reply.status(500).send({ success: false, error: 'Failed to create job' });
    }
  });

  return app;
}

export async function startServer(port: number): Promise<void> {
  if (server) return;
  server = await createServer();
  await server.listen({ port, host: '0.0.0.0' });
  logger.info(`Web server and Mini App listening on port ${port}`);
}

export async function stopServer(): Promise<void> {
  if (server) {
    await server.close();
    server = null;
    logger.info('Web server stopped');
  }
}
