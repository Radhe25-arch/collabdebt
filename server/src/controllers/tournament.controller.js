const { prisma } = require('../config/db');
const { awardXP, triggerQuestProgress } = require('../utils/xp');
const AppError = require('../utils/AppError');

// Helper to seed 100 daily tournaments with Bot competition
async function ensureDailyTournaments() {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setUTCHours(23, 59, 59, 999);

  const todayCount = await prisma.tournament.count({
    where: { startsAt: { gte: startOfDay, lte: endOfDay } }
  });

  if (todayCount >= 100) return; // Already generated today

  console.log(`Generating ${100 - todayCount} daily tournaments with Bot competitors...`);
  
  const botUsers = await prisma.user.findMany({
    where: { email: { endsWith: '@bot.skillforge.com' } },
    select: { id: true },
    take: 200 // Grab up to 200 bots to recycle
  });

  const missing = 100 - todayCount;
  const newTournamentsConfig = [];

  for (let i = 0; i < missing; i++) {
    const types = ['CODING_CHALLENGE', 'QUIZ_BATTLE', 'SPEED_COURSE'];
    newTournamentsConfig.push({
      title: `Daily Protocol #${Math.floor(Math.random() * 9000) + 1000}`,
      weekNumber: Math.ceil(new Date().getDate() / 7),
      type: types[Math.floor(Math.random() * types.length)],
      status: 'ACTIVE',
      startsAt: startOfDay,
      endsAt: endOfDay,
      xpBonus: Math.floor(Math.random() * 500) + 100,
      description: 'System-generated daily ranking tournament. Compete against global profiles to secure XP.',
    });
  }

  // Create Tournaments
  await prisma.tournament.createMany({ data: newTournamentsConfig, skipDuplicates: true });

  // Get the newly created tournaments
  const newTournaments = await prisma.tournament.findMany({
    where: { startsAt: { gte: startOfDay, lte: endOfDay } }
  });

  // Assign Bots to tournaments to make them look alive
  if (botUsers.length > 0) {
    const batchedEntries = [];
    for (const t of newTournaments) {
      // Pick 5 to 25 random bots per tournament
      const botCount = Math.floor(Math.random() * 20) + 5;
      const shuffledBots = [...botUsers].sort(() => 0.5 - Math.random()).slice(0, botCount);

      for (const bot of shuffledBots) {
        batchedEntries.push({
          userId: bot.id,
          tournamentId: t.id,
          score: Math.floor(Math.random() * 100) + 10,
          joinedAt: new Date()
        });
      }
    }
    await prisma.tournamentEntry.createMany({ data: batchedEntries, skipDuplicates: true });
  }
}

// Award Rank Bonuses for terminated protocols
async function claimRankRewards(userId) {
  try {
    const now = new Date();
    const pendingEntries = await prisma.tournamentEntry.findMany({
      where: {
        userId,
        rewarded: false,
        tournament: { endsAt: { lt: now } }
      },
      include: { tournament: { select: { id: true, xpBonus: true, title: true } } }
    });

    for (const entry of pendingEntries) {
      // Calculate rank percentile
      const totalEntries = await prisma.tournamentEntry.count({
        where: { tournamentId: entry.tournamentId }
      });
      
      const aheadOfCount = await prisma.tournamentEntry.count({
        where: { tournamentId: entry.tournamentId, score: { lt: entry.score } }
      });

      const percentile = totalEntries > 0 ? (aheadOfCount / totalEntries) * 100 : 0;
      let multiplier = 1;
      let rankLabel = 'Participation';

      if (percentile >= 99) { multiplier = 3.0; rankLabel = 'Top 1% Rank'; }
      else if (percentile >= 90) { multiplier = 1.5; rankLabel = 'Top 10% Rank'; }

      const rankBonus = Math.floor(entry.tournament.xpBonus * multiplier);
      if (rankBonus > 0) {
        await awardXP(userId, rankBonus, 'tournament_rank_bonus', entry.tournamentId);
        // Create a separate notification for the bonus
        await prisma.notification.create({
          data: {
            userId,
            type: 'LEVEL_UP', // Reusing a positive type
            title: 'Protocol Rewards Unlocked',
            body: `You achieved ${rankLabel} in ${entry.tournament.title}. +${rankBonus} XP awarded!`,
            data: { tournamentId: entry.tournamentId, bonus: rankBonus }
          }
        });
      }

      await prisma.tournamentEntry.update({
        where: { id: entry.id },
        data: { rewarded: true }
      });
    }
  } catch (err) {
    console.error('Failed to claim rank rewards:', err.message);
  }
}

async function getAll(req, res, next) {
  try {
    const { status } = req.query;
    
    // Auto-generate today's 100 tournaments if they don't exist
    await ensureDailyTournaments();

    // Auto-claim any finished rewards for this user
    if (req.user) await claimRankRewards(req.user.id);

    const tournaments = await prisma.tournament.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      take: 100, // Show the most recent 100
      include: { _count: { select: { entries: true } } },
    });
    res.json({ tournaments });
  } catch (err) { next(err); }
}

async function getCurrent(req, res, next) {
  try {
    const now = new Date();
    const tournament = await prisma.tournament.findFirst({
      where: { status: 'ACTIVE', startsAt: { lte: now }, endsAt: { gte: now } },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { entries: true } } },
    });
    if (!tournament) return res.json({ tournament: null });

    let userEntry = null;
    if (req.user) {
      userEntry = await prisma.tournamentEntry.findUnique({
        where: { userId_tournamentId: { userId: req.user.id, tournamentId: tournament.id } },
      });
    }

    res.json({ tournament, userEntry });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: { _count: { select: { entries: true } } },
    });
    if (!tournament) throw new AppError('Tournament not found', 404);
    res.json({ tournament });
  } catch (err) { next(err); }
}

async function join(req, res, next) {
  try {
    const { id } = req.params;
    const tournament = await prisma.tournament.findUnique({ where: { id } });
    if (!tournament) throw new AppError('Tournament not found', 404);
    if (tournament.status !== 'ACTIVE') throw new AppError('Tournament is not active', 400);

    const existing = await prisma.tournamentEntry.findUnique({
      where: { userId_tournamentId: { userId: req.user.id, tournamentId: id } },
    });
    if (existing) throw new AppError('Already joined this tournament', 409);

    const entry = await prisma.tournamentEntry.create({
      data: { userId: req.user.id, tournamentId: id, score: 0 },
    });

    // Participation XP
    await awardXP(req.user.id, 50, 'tournament_join', id);
    triggerQuestProgress(req.user.id, 'TOURNAMENT_JOIN').catch(() => {});

    res.status(201).json({ entry, message: 'Joined tournament successfully' });
  } catch (err) { next(err); }
}

async function getScoreboard(req, res, next) {
  try {
    const { id } = req.params;
    const entries = await prisma.tournamentEntry.findMany({
      where: { tournamentId: id },
      orderBy: { score: 'desc' },
      take: 100,
      include: {
        user: { select: { id: true, username: true, avatarUrl: true, level: true, xp: true } },
      },
    });

    res.json({
      scoreboard: entries.map((e, i) => ({
        rank: i + 1,
        score: e.score,
        user: e.user,
        joinedAt: e.joinedAt,
      })),
    });
  } catch (err) { next(err); }
}

async function submit(req, res, next) {
  try {
    const { id } = req.params;
    const { code, language, score, timeTaken } = req.body;

    const tournament = await prisma.tournament.findUnique({ where: { id } });
    if (!tournament || tournament.status !== 'ACTIVE') throw new AppError('Tournament not active', 400);

    const entry = await prisma.tournamentEntry.findUnique({
      where: { userId_tournamentId: { userId: req.user.id, tournamentId: id } },
    });
    if (!entry) throw new AppError('You must join before submitting', 400);

    // Record submission
    await prisma.tournamentSubmission.create({
      data: { userId: req.user.id, tournamentId: id, code, language, score, timeTaken },
    });

    // Update entry score if higher
    if (score > entry.score) {
      await prisma.tournamentEntry.update({
        where: { id: entry.id },
        data: { score },
      });
    }

    const xpEarned = Math.floor(score * 0.5);
    await awardXP(req.user.id, xpEarned, 'tournament_submission', id);

    res.json({ message: 'Submission recorded', xpEarned, score });
  } catch (err) { next(err); }
}

module.exports = { getAll, getCurrent, getById, join, getScoreboard, submit, claimRankRewards };
