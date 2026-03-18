const { prisma } = require('../config/db');

// ─── LEVEL SYSTEM ─────────────────────────────────────────
const LEVEL_THRESHOLDS = [0,500,1200,2500,4500,7500,12000,18000,26000,36000];
const LEVEL_NAMES      = ['Beginner','Apprentice','Coder','Developer','Senior Dev','Architect','Pro','Expert','Master','Legend'];

function getLevelFromXP(xp) {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) { level = i + 1; break; }
  }
  return Math.min(level, LEVEL_THRESHOLDS.length);
}

function getLevelName(level) {
  return LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
}

function getXPForNextLevel(xp) {
  const level = getLevelFromXP(xp);
  if (level >= LEVEL_THRESHOLDS.length) return null;
  return LEVEL_THRESHOLDS[level];
}

function getXPProgress(xp) {
  const level   = getLevelFromXP(xp);
  const current = LEVEL_THRESHOLDS[level - 1];
  const next    = LEVEL_THRESHOLDS[level] ?? xp;
  return Math.min(Math.round(((xp - current) / (next - current)) * 100), 100);
}

// ─── AWARD XP ─────────────────────────────────────────────
async function awardXP(userId, amount, reason, refId = null) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { xp: true, level: true } });
  if (!user) throw new Error('User not found');

  const newXP    = user.xp + amount;
  const newLevel = getLevelFromXP(newXP);
  const leveledUp = newLevel > user.level;

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { xp: newXP, level: newLevel } }),
    prisma.xPTransaction.create({ data: { userId, amount, reason, refId } }),
  ]);

  // Update daily activity log
  const today = new Date(); today.setHours(0, 0, 0, 0);
  await prisma.activityLog.upsert({
    where: { userId_date: { userId, date: today } },
    update: { xpEarned: { increment: amount } },
    create: { userId, date: today, xpEarned: amount },
  });

  // Level-up email + badge (non-blocking)
  if (leveledUp) {
    const levelName = getLevelName(newLevel);
    // Level 10 badge
    if (newLevel === 10) {
      awardBadge(userId, 'Arena Legend').catch(() => {});
    }
    // Send level-up email non-blocking
    try {
      const { sendLevelUp } = require('./email');
      const fullUser = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, username: true, xp: true } });
      if (fullUser) sendLevelUp(fullUser, newLevel, levelName).catch(() => {});
    } catch (_) {}
  }

  return { newXP, newLevel, leveledUp, levelName: getLevelName(newLevel), progress: getXPProgress(newXP) };
}

// ─── AUTO QUEST PROGRESS ──────────────────────────────────
// Called internally whenever a qualifying action occurs
async function triggerQuestProgress(userId, type, increment = 1) {
  try {
    const today = new Date(); today.setUTCHours(0, 0, 0, 0);
    const quests = await prisma.dailyQuest.findMany({ where: { date: today, type } });

    for (const quest of quests) {
      const existing = await prisma.questCompletion.upsert({
        where: { userId_questId: { userId, questId: quest.id } },
        update: { progress: { increment } },
        create: { userId, questId: quest.id, progress: increment },
      });

      const updated = await prisma.questCompletion.findUnique({ where: { id: existing.id } });
      if (updated && !updated.completed && updated.progress >= quest.target) {
        await prisma.questCompletion.update({
          where: { id: updated.id },
          data: { completed: true, completedAt: new Date(), xpAwarded: quest.xpReward },
        });
        await awardXP(userId, quest.xpReward, 'quest_complete', quest.id);
      }
    }
  } catch (err) {
    // Quest trigger should never crash the main flow
    const logger = require('./logger');
    logger.warn('[QUEST] trigger failed:', err.message);
  }
}

// ─── AUTO BADGE AWARD ─────────────────────────────────────
async function awardBadge(userId, badgeName) {
  try {
    const badge = await prisma.badge.findUnique({ where: { name: badgeName } });
    if (!badge) return;

    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
      update: {},
      create: { userId, badgeId: badge.id },
    });

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'BADGE_AWARDED',
        title: 'Badge unlocked!',
        body: `You earned the "${badge.name}" badge — ${badge.description}`,
        data: { badgeId: badge.id, badgeName: badge.name, rarity: badge.rarity },
      },
    });
  } catch (err) {
    const logger = require('./logger');
    logger.warn('[BADGE] award failed:', err.message);
  }
}

// ─── CHECK MILESTONE BADGES ───────────────────────────────
async function checkMilestoneBadges(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true, streak: true, coursesCompleted: true, totalQuizAttempts: true, correctQuizAnswers: true },
    });
    if (!user) return;

    // Streak badges
    if (user.streak >= 7)  await awardBadge(userId, 'Week Warrior');
    if (user.streak >= 30) await awardBadge(userId, 'Month Master');

    // Level badge
    if (user.level >= 10)  await awardBadge(userId, 'Arena Legend');

    // First lesson badge (check if they have First Steps already)
    const lessonCount = await prisma.lessonProgress.count({ where: { userId } });
    if (lessonCount >= 1) await awardBadge(userId, 'First Steps');

    // Quiz crusher
    const quizPasses = await prisma.quizAttempt.count({
      where: { userId, score: { gt: 0 } },
    });
    if (quizPasses >= 10) await awardBadge(userId, 'Quiz Crusher');

    // Portfolio badge
    const portfolio = await prisma.portfolio.findUnique({ where: { userId }, select: { repoUrl: true } });
    if (portfolio?.repoUrl) await awardBadge(userId, 'Code Contributor');
  } catch (err) {
    const logger = require('./logger');
    logger.warn('[BADGE] milestone check failed:', err.message);
  }
}

module.exports = {
  getLevelFromXP, getLevelName, getXPForNextLevel, getXPProgress,
  awardXP, triggerQuestProgress, awardBadge, checkMilestoneBadges,
  LEVEL_THRESHOLDS, LEVEL_NAMES,
};
