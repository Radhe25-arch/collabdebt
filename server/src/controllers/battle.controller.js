const { prisma } = require('../config/db');
const { awardXP, awardBadge, checkMilestoneBadges } = require('../utils/xp');
const AppError = require('../utils/AppError');

// ─── SEND CHALLENGE ────────────────────────────────────────

async function challenge(req, res, next) {
  try {
    const { challengedUsername, problemId, timeLimit = 1800 } = req.body;

    const challenged = await prisma.user.findUnique({ where: { username: challengedUsername } });
    if (!challenged) throw new AppError('User not found', 404);
    if (challenged.id === req.user.id) throw new AppError('Cannot challenge yourself', 400);

    // Check no active battle between these two
    const existing = await prisma.battle.findFirst({
      where: {
        status: { in: ['PENDING', 'ACTIVE'] },
        OR: [
          { challengerId: req.user.id, challengedId: challenged.id },
          { challengerId: challenged.id, challengedId: req.user.id },
        ],
      },
    });
    if (existing) throw new AppError('Active battle already exists between you two', 409);

    const battle = await prisma.battle.create({
      data: {
        challengerId: req.user.id,
        challengedId: challenged.id,
        problemId,
        timeLimit,
      },
      include: {
        challenger: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true } },
        challenged: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true } },
      },
    });

    res.status(201).json({ battle, message: 'Challenge sent!' });
  } catch (err) { next(err); }
}

// ─── RESPOND TO CHALLENGE ──────────────────────────────────

async function respond(req, res, next) {
  try {
    const { id } = req.params;
    const { accept } = req.body;

    const battle = await prisma.battle.findUnique({ where: { id } });
    if (!battle) throw new AppError('Battle not found', 404);
    if (battle.challengedId !== req.user.id) throw new AppError('Not your challenge', 403);
    if (battle.status !== 'PENDING') throw new AppError('Challenge already responded to', 400);

    if (!accept) {
      await prisma.battle.update({ where: { id }, data: { status: 'DECLINED' } });
      return res.json({ message: 'Challenge declined' });
    }

    const now = new Date();
    const endsAt = new Date(now.getTime() + battle.timeLimit * 1000);

    const updated = await prisma.battle.update({
      where: { id },
      data: { status: 'ACTIVE', startsAt: now, endsAt },
      include: {
        challenger: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true } },
        challenged: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true } },
      },
    });

    res.json({ battle: updated, message: 'Battle started! Good luck.' });
  } catch (err) { next(err); }
}

// ─── SUBMIT CODE ───────────────────────────────────────────

async function submit(req, res, next) {
  try {
    const { id } = req.params;
    const { code, language = 'javascript', passed = 0, total = 10, timeTaken } = req.body;

    const battle = await prisma.battle.findUnique({
      where: { id },
      include: { submissions: true },
    });
    if (!battle) throw new AppError('Battle not found', 404);
    if (battle.status !== 'ACTIVE') throw new AppError('Battle is not active', 400);
    if (battle.challengerId !== req.user.id && battle.challengedId !== req.user.id) {
      throw new AppError('You are not in this battle', 403);
    }
    if (new Date() > battle.endsAt) throw new AppError('Battle time expired', 400);

    const mySubmissions = battle.submissions.filter((s) => s.userId === req.user.id);
    const attempt = mySubmissions.length + 1;

    const submission = await prisma.battleSubmission.create({
      data: { battleId: id, userId: req.user.id, code, language, passed, total, timeTaken, attempt },
    });

    // Check if both players have submitted
    const allSubs = [...battle.submissions, submission];
    const challengerBest = getBestSubmission(allSubs, battle.challengerId);
    const challengedBest = getBestSubmission(allSubs, battle.challengedId);

    if (challengerBest && challengedBest) {
      // Auto-complete the battle and generate report
      await completeBattle(battle, challengerBest, challengedBest);
    }

    res.json({ submission, attempt, message: `Test cases: ${passed}/${total}` });
  } catch (err) { next(err); }
}

// ─── GET BATTLE ────────────────────────────────────────────

async function getBattle(req, res, next) {
  try {
    const { id } = req.params;
    const battle = await prisma.battle.findUnique({
      where: { id },
      include: {
        challenger: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true, streak: true, coursesCompleted: true, totalQuizAttempts: true, correctQuizAnswers: true } },
        challenged: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true, streak: true, coursesCompleted: true, totalQuizAttempts: true, correctQuizAnswers: true } },
        submissions: { orderBy: { submittedAt: 'asc' } },
        report: true,
      },
    });
    if (!battle) throw new AppError('Battle not found', 404);

    // Verify access
    if (battle.challengerId !== req.user.id && battle.challengedId !== req.user.id) {
      throw new AppError('Access denied', 403);
    }

    res.json({ battle });
  } catch (err) { next(err); }
}

// ─── GET MY BATTLES ────────────────────────────────────────

async function getMyBattles(req, res, next) {
  try {
    const battles = await prisma.battle.findMany({
      where: {
        OR: [{ challengerId: req.user.id }, { challengedId: req.user.id }],
      },
      include: {
        challenger: { select: { id: true, username: true, level: true, avatarUrl: true } },
        challenged: { select: { id: true, username: true, level: true, avatarUrl: true } },
        report: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json({ battles });
  } catch (err) { next(err); }
}

// ─── FORCE COMPLETE (time expired) ─────────────────────────

async function forceComplete(req, res, next) {
  try {
    const { id } = req.params;
    const battle = await prisma.battle.findUnique({
      where: { id },
      include: { submissions: true },
    });
    if (!battle) throw new AppError('Battle not found', 404);
    if (battle.status !== 'ACTIVE') throw new AppError('Battle not active', 400);
    if (battle.challengerId !== req.user.id && battle.challengedId !== req.user.id) {
      throw new AppError('Access denied', 403);
    }

    const challengerBest = getBestSubmission(battle.submissions, battle.challengerId);
    const challengedBest = getBestSubmission(battle.submissions, battle.challengedId);
    await completeBattle(battle, challengerBest, challengedBest);

    const updated = await prisma.battle.findUnique({
      where: { id },
      include: {
        challenger: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true } },
        challenged: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true } },
        report: true,
      },
    });
    res.json({ battle: updated });
  } catch (err) { next(err); }
}

// ─── HELPERS ───────────────────────────────────────────────

function getBestSubmission(submissions, userId) {
  const mine = submissions.filter((s) => s.userId === userId);
  if (!mine.length) return null;
  return mine.sort((a, b) => b.passed - a.passed || (a.timeTaken || 99999) - (b.timeTaken || 99999))[0];
}

async function completeBattle(battle, challengerBest, challengedBest) {
  // Determine winner
  let winnerId = null;
  const cScore  = challengerBest ? (challengerBest.passed / challengerBest.total) : 0;
  const cdScore = challengedBest ? (challengedBest.passed / challengedBest.total) : 0;

  if (cScore > cdScore) winnerId = battle.challengerId;
  else if (cdScore > cScore) winnerId = battle.challengedId;
  else if (challengerBest && challengedBest) {
    winnerId = (challengerBest.timeTaken || 99999) <= (challengedBest.timeTaken || 99999)
      ? battle.challengerId : battle.challengedId;
  }

  // Build per-player report data
  const buildScore = (subs, userId) => {
    const mine = subs.filter((s) => s.userId === userId);
    if (!mine.length) return { accuracy: 0, avgTime: null, attempts: 0, testsPassed: 0, testsTotal: 0, weakTopics: ['no submission'], bestAttempt: null };
    const best = getBestSubmission(mine, userId);
    const avgTime = mine.filter((s) => s.timeTaken).reduce((a, s) => a + s.timeTaken, 0) / (mine.filter((s) => s.timeTaken).length || 1);
    return {
      accuracy:   Math.round((best.passed / best.total) * 100),
      avgTime:    Math.round(avgTime),
      attempts:   mine.length,
      testsPassed: best.passed,
      testsTotal:  best.total,
      weakTopics: best.passed < best.total ? ['edge cases', 'time complexity'] : [],
      bestAttempt: best.attempt,
    };
  };

  const allSubs = await prisma.battleSubmission.findMany({ where: { battleId: battle.id } });
  const challengerScore = buildScore(allSubs, battle.challengerId);
  const challengedScore  = buildScore(allSubs, battle.challengedId);

  const analysis = generateAnalysis(challengerScore, challengedScore, winnerId, battle.challengerId);

  await prisma.$transaction([
    prisma.battle.update({
      where: { id: battle.id },
      data: { status: 'COMPLETED', winnerId, endsAt: new Date() },
    }),
    prisma.battleReport.upsert({
      where: { battleId: battle.id },
      update: { winnerId, challengerScore, challengedScore, analysis },
      create: { battleId: battle.id, winnerId, challengerScore, challengedScore, analysis },
    }),
  ]);

  // Award XP
  if (winnerId) {
    await awardXP(winnerId, 300, 'battle_win', battle.id);
    await awardBadge(winnerId, 'Battle Tested');
    await checkMilestoneBadges(winnerId);
    const loserId = winnerId === battle.challengerId ? battle.challengedId : battle.challengerId;
    await awardXP(loserId, 50, 'battle_participation', battle.id);
  } else {
    await awardXP(battle.challengerId, 150, 'battle_draw', battle.id);
    await awardXP(battle.challengedId, 150, 'battle_draw', battle.id);
  }
}

function generateAnalysis(cScore, cdScore, winnerId, challengerId) {
  const winner = winnerId === challengerId ? 'challenger' : winnerId ? 'challenged' : null;
  const lines = [];

  if (!winner) {
    lines.push('Both players tied — a rare and impressive result.');
  } else {
    lines.push(`${winner === 'challenger' ? 'Challenger' : 'Opponent'} wins with ${winner === 'challenger' ? cScore.accuracy : cdScore.accuracy}% accuracy.`);
  }

  if (cScore.attempts > 3) lines.push('Challenger made multiple attempts — focus on planning before coding.');
  if (cdScore.attempts > 3) lines.push('Opponent made multiple attempts — edge case handling needs work.');
  if (cScore.accuracy < 50) lines.push('Challenger should practice test-driven development and boundary analysis.');
  if (cdScore.accuracy < 50) lines.push('Opponent should review core algorithmic patterns.');
  if (cScore.avgTime && cScore.avgTime > 120000) lines.push('Challenger was slower — practice timed coding challenges daily.');
  if (cScore.weakTopics.length) lines.push(`Challenger weak areas: ${cScore.weakTopics.join(', ')}.`);
  if (cdScore.weakTopics.length) lines.push(`Opponent weak areas: ${cdScore.weakTopics.join(', ')}.`);

  return lines.join(' ');
}

module.exports = { challenge, respond, submit, getBattle, getMyBattles, forceComplete };
