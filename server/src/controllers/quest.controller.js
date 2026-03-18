const { prisma } = require('../config/db');
const { awardXP } = require('../utils/xp');
const AppError = require('../utils/AppError');

const QUEST_TEMPLATES = [
  { title: 'Morning Warmup',     description: 'Complete 1 lesson today',            type: 'LESSON_COMPLETE',    target: 1, xpReward: 75,  difficulty: 'EASY' },
  { title: 'Knowledge Check',    description: 'Pass 2 quizzes with 80%+ score',      type: 'QUIZ_PASS',         target: 2, xpReward: 100, difficulty: 'EASY' },
  { title: 'Code Grinder',       description: 'Complete 3 lessons in one day',       type: 'LESSON_COMPLETE',   target: 3, xpReward: 200, difficulty: 'MEDIUM' },
  { title: 'Quiz Champion',      description: 'Pass 5 quizzes today',                type: 'QUIZ_PASS',         target: 5, xpReward: 250, difficulty: 'HARD' },
  { title: 'Stay on Streak',     description: 'Log in and complete one activity',    type: 'STREAK_MAINTAIN',   target: 1, xpReward: 50,  difficulty: 'EASY' },
  { title: 'Explorer',           description: 'Enroll in a new course today',        type: 'COURSE_ENROLL',     target: 1, xpReward: 125, difficulty: 'EASY' },
  { title: 'Tournament Fighter', description: 'Join today\'s active tournament',    type: 'TOURNAMENT_JOIN',   target: 1, xpReward: 150, difficulty: 'MEDIUM' },
  { title: 'Deep Dive',          description: 'Complete 5 lessons in one session',   type: 'LESSON_COMPLETE',   target: 5, xpReward: 350, difficulty: 'HARD' },
];

// ─── GET TODAY'S QUESTS ────────────────────────────────────

async function getTodayQuests(req, res, next) {
  try {
    const today = getToday();

    // Ensure quests exist for today
    await ensureQuestsForDate(today);

    const quests = await prisma.dailyQuest.findMany({
      where: { date: today },
      include: {
        completions: {
          where: { userId: req.user.id },
          take: 1,
        },
      },
    });

    const result = quests.map((q) => ({
      ...q,
      userProgress: q.completions[0] || null,
      completions: undefined,
    }));

    res.json({ quests: result, date: today });
  } catch (err) { next(err); }
}

// ─── UPDATE QUEST PROGRESS ─────────────────────────────────

async function updateProgress(req, res, next) {
  try {
    const { type, increment = 1 } = req.body;

    const today = getToday();
    const quests = await prisma.dailyQuest.findMany({
      where: { date: today, type },
    });

    const results = [];
    for (const quest of quests) {
      const completion = await prisma.questCompletion.upsert({
        where: { userId_questId: { userId: req.user.id, questId: quest.id } },
        update: {
          progress: { increment },
        },
        create: {
          userId: req.user.id,
          questId: quest.id,
          progress: increment,
        },
      });

      // Check if quest just completed
      if (!completion.completed && completion.progress >= quest.target) {
        const updated = await prisma.questCompletion.update({
          where: { id: completion.id },
          data: { completed: true, completedAt: new Date(), xpAwarded: quest.xpReward },
        });
        await awardXP(req.user.id, quest.xpReward, 'quest_complete', quest.id);
        results.push({ quest, completed: true, xpAwarded: quest.xpReward });
      } else {
        results.push({ quest, completed: false, progress: completion.progress });
      }
    }

    res.json({ results });
  } catch (err) { next(err); }
}

// ─── GET QUEST HISTORY ─────────────────────────────────────

async function getHistory(req, res, next) {
  try {
    const completions = await prisma.questCompletion.findMany({
      where: { userId: req.user.id, completed: true },
      include: { quest: true },
      orderBy: { completedAt: 'desc' },
      take: 30,
    });

    const totalXP = completions.reduce((s, c) => s + c.xpAwarded, 0);
    const streak  = calcQuestStreak(completions);

    res.json({ completions, totalXP, questStreak: streak });
  } catch (err) { next(err); }
}

// ─── HELPERS ───────────────────────────────────────────────

function getToday() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function ensureQuestsForDate(date) {
  const existing = await prisma.dailyQuest.count({ where: { date } });
  if (existing >= 3) return;

  // Pick 3 quests for today using date-based seeded selection
  const seed = date.getTime();
  const shuffled = [...QUEST_TEMPLATES].sort(() => seededRandom(seed) - 0.5);
  const picked   = [shuffled[0], shuffled[1], shuffled[2]]; // easy, medium, hard

  for (const q of picked) {
    await prisma.dailyQuest.upsert({
      where: { date_type: { date, type: q.type } },
      update: {},
      create: { date, ...q },
    });
  }
}

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function calcQuestStreak(completions) {
  if (!completions.length) return 0;
  const days = [...new Set(completions.map((c) => c.completedAt.toISOString().slice(0, 10)))].sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  let check   = today;
  for (const day of days) {
    if (day === check) { streak++; const d = new Date(check); d.setDate(d.getDate() - 1); check = d.toISOString().slice(0, 10); }
    else break;
  }
  return streak;
}

module.exports = { getTodayQuests, updateProgress, getHistory };
