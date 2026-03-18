const cron = require('node-cron');
const { prisma } = require('../config/db');
const { cache } = require('../config/redis');
const logger = require('./logger');
const emailService = require('./email');

/**
 * Every Monday 00:00 — reset weekly leaderboard, archive top 3 to Hall of Fame,
 * create new tournament.
 */
async function weeklyReset() {
  logger.info('[CRON] Running weekly reset...');
  try {
    const now = new Date();
    const weekNumber = getISOWeek(now);
    const year = now.getFullYear();

    // 1. Find top 3 users by XP for the week
    const topUsers = await prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 3,
      select: { id: true, username: true, avatarUrl: true, xp: true },
    });

    // 2. Archive to Hall of Fame
    for (let i = 0; i < topUsers.length; i++) {
      const u = topUsers[i];
      await prisma.hallOfFame.upsert({
        where: { weekNumber_year_rank: { weekNumber, year, rank: i + 1 } },
        update: {},
        create: {
          userId: u.id,
          username: u.username,
          avatarUrl: u.avatarUrl,
          xp: u.xp,
          rank: i + 1,
          weekNumber,
          year,
        },
      });
    }

    // 3. Create new tournament for the coming week
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + 6);
    nextSunday.setHours(23, 59, 59, 999);

    const types = ['CODING_CHALLENGE', 'QUIZ_BATTLE', 'SPEED_COURSE'];
    const type = types[weekNumber % types.length];

    await prisma.tournament.create({
      data: {
        title: `Week #${weekNumber + 1} ${formatType(type)}`,
        weekNumber: weekNumber + 1,
        type,
        status: 'ACTIVE',
        startsAt: now,
        endsAt: nextSunday,
        xpBonus: 500,
      },
    });

    // 4. Invalidate leaderboard caches
    await cache.invalidatePattern('leaderboard:*');

    logger.info(`[CRON] Weekly reset complete. Week ${weekNumber} archived. New tournament created.`);
  } catch (err) {
    logger.error('[CRON] Weekly reset failed:', err);
  }
}

/**
 * Every day 09:00 — send streak reminder to users who haven't logged in today
 */
async function streakReminder() {
  logger.info('[CRON] Sending streak reminders...');
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Users with streak > 0 who haven't been active today
    const atRiskUsers = await prisma.user.findMany({
      where: {
        streak: { gt: 0 },
        lastActiveAt: { lt: today },
        isActive: true,
      },
      select: { id: true, email: true, fullName: true, streak: true },
      take: 1000,
    });

    for (const user of atRiskUsers) {
      await emailService.sendStreakReminder(user);
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'STREAK_REMINDER',
          title: 'Your streak is at risk!',
          body: `You have a ${user.streak}-day streak. Log in today to keep it alive.`,
        },
      });
    }

    logger.info(`[CRON] Sent ${atRiskUsers.length} streak reminders`);
  } catch (err) {
    logger.error('[CRON] Streak reminder failed:', err);
  }
}

/**
 * Every Sunday 23:00 — send weekly summary emails
 */
async function weeklySummary() {
  logger.info('[CRON] Sending weekly summaries...');
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, email: true, fullName: true, xp: true, level: true, streak: true },
      take: 5000,
    });

    for (const user of users) {
      const xpThisWeek = await prisma.xPTransaction.aggregate({
        where: { userId: user.id, createdAt: { gte: weekAgo } },
        _sum: { amount: true },
      });
      const lessonsThisWeek = await prisma.lessonProgress.count({
        where: { userId: user.id, completedAt: { gte: weekAgo } },
      });

      if ((xpThisWeek._sum.amount || 0) > 0) {
        await emailService.sendWeeklySummary(user, {
          xpEarned: xpThisWeek._sum.amount || 0,
          lessonsCompleted: lessonsThisWeek,
        });
      }
    }

    logger.info('[CRON] Weekly summaries sent');
  } catch (err) {
    logger.error('[CRON] Weekly summary failed:', err);
  }
}

// ─── INIT ──────────────────────────────────────────────────

function init() {
  // Every Monday at midnight
  cron.schedule('0 0 * * 1', weeklyReset, { timezone: 'UTC' });

  // Every day at 9:00 AM
  cron.schedule('0 9 * * *', streakReminder, { timezone: 'UTC' });

  // Every Sunday at 11:00 PM
  cron.schedule('0 23 * * 0', weeklySummary, { timezone: 'UTC' });

  logger.info('[CRON] Scheduled: weeklyReset(Mon 00:00), streakReminder(daily 09:00), weeklySummary(Sun 23:00)');
}

// ─── HELPERS ───────────────────────────────────────────────

function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function formatType(type) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

module.exports = { init };
