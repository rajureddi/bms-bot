import { CommandContext, InlineKeyboard } from 'grammy';
import { userService } from '../../services/userService.js';
import { logger } from '../../utils/logger.js';
import { MyContext } from '../index.js';
import { mainMenuKeyboard } from '../menus/keyboards.js';

export async function startCommand(ctx: CommandContext<MyContext>): Promise<void> {
  const telegramId = ctx.from?.id?.toString();

  if (!telegramId) {
    await ctx.reply('Could not identify you. Please try again.');
    return;
  }

  try {
    const user = await userService.getOrCreate(telegramId);
    const isNew = user.createdAt.getTime() > Date.now() - 5000;

    let keyboard: InlineKeyboard;
    try {
      keyboard = mainMenuKeyboard(telegramId);
    } catch {
      keyboard = new InlineKeyboard()
        .text('New Job', 'menu:newjob')
        .text('My Jobs', 'menu:jobs')
        .row()
        .text('My Cards', 'menu:cards')
        .text('Settings', 'menu:settings');
    }

    const text = isNew
      ? `🎬 *Welcome to BMS Bot!*\n\n` +
        `I can help you watch and book movie tickets automatically on BookMyShow.\n\n` +
        `• *Prasads Multiplex (PCX)* & IMAX live watcher\n` +
        `• Auto-detection: Paste any BookMyShow link here!\n` +
        `• 24/7 background ticket monitoring\n\n` +
        `What would you like to do?`
      : `🎬 *BMS Bot - Main Menu*\n\n` +
        `Welcome back! What would you like to do?`;

    try {
      const msg = await ctx.reply(text, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });
      if (ctx.session) {
        ctx.session.menuMessageId = msg.message_id;
      }
    } catch (replyError) {
      logger.warn('Failed to send start reply with keyboard/markdown, using fallback', { error: String(replyError) });
      const simpleKeyboard = new InlineKeyboard()
        .text('New Job', 'menu:newjob')
        .text('My Jobs', 'menu:jobs')
        .row()
        .text('My Cards', 'menu:cards')
        .text('Settings', 'menu:settings');

      const plainText = text.replace(/[*_`]/g, '');
      const msg = await ctx.reply(plainText, { reply_markup: simpleKeyboard });
      if (ctx.session) {
        ctx.session.menuMessageId = msg.message_id;
      }
    }
  } catch (error) {
    logger.error('Error in start command', { error, telegramId });
    const errorMsg = error instanceof Error ? error.message : String(error);
    await ctx.reply(
      `⚠️ Could not start bot session: ${errorMsg}\n\n` +
      `You can still send a BookMyShow URL directly or use /myjobs to view your active watches.`
    );
  }
}
