const { prisma } = require('../config/db');
const { awardXP, triggerQuestProgress, awardBadge } = require('../utils/xp');
const AppError = require('../utils/AppError');

async function getAll(req, res, next) {
  try {
    const { status } = req.query;
    const tournaments = await prisma.tournament.findMany({
      where: status ? { status } : {},
      orderBy: { startsAt: 'desc' },
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
      data: { userId: req.user.id, tournamentId: id },
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
        user: { select: { id: true, username: true, avatarUrl: true, level: true } },
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

module.exports = { getAll, getCurrent, getById, join, getScoreboard, submit };
