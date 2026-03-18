const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');

// ─── PLATFORM STATS ────────────────────────────────────────
async function getStats(req, res, next) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);

    const [
      totalUsers, activeToday, newThisWeek, newThisMonth,
      totalCourses, publishedCourses,
      totalEnrollments, totalCompletions,
      totalLessonProgress, totalQuizAttempts,
      totalTournaments, activeTournaments,
      totalBattles, completedBattles,
      topUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { lastActiveAt: { gte: today } } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
      prisma.course.count(),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { completedAt: { not: null } } }),
      prisma.lessonProgress.count(),
      prisma.quizAttempt.count(),
      prisma.tournament.count(),
      prisma.tournament.count({ where: { status: 'ACTIVE' } }),
      prisma.battle.count(),
      prisma.battle.count({ where: { status: 'COMPLETED' } }),
      prisma.user.findMany({
        orderBy: { xp: 'desc' }, take: 10,
        select: { id: true, username: true, xp: true, level: true, coursesCompleted: true },
      }),
    ]);

    res.json({
      users: { total: totalUsers, activeToday, newThisWeek, newThisMonth },
      courses: { total: totalCourses, published: publishedCourses, enrollments: totalEnrollments, completions: totalCompletions },
      learning: { lessonsCompleted: totalLessonProgress, quizAttempts: totalQuizAttempts },
      tournaments: { total: totalTournaments, active: activeTournaments },
      battles: { total: totalBattles, completed: completedBattles },
      topUsers,
    });
  } catch (err) { next(err); }
}

// ─── LIST USERS ────────────────────────────────────────────
async function getUsers(req, res, next) {
  try {
    const { page = 1, limit = 50, search, role } = req.query;
    const where = {};
    if (search) where.OR = [
      { username: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { fullName: { contains: search, mode: 'insensitive' } },
    ];
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, username: true, email: true, fullName: true, role: true, xp: true, level: true, streak: true, coursesCompleted: true, isActive: true, createdAt: true, lastActiveAt: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
}

// ─── TOGGLE USER ACTIVE ────────────────────────────────────
async function toggleUser(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) throw new AppError('User not found', 404);
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: !user.isActive },
    });
    res.json({ message: `User ${updated.isActive ? 'activated' : 'suspended'}`, isActive: updated.isActive });
  } catch (err) { next(err); }
}

// ─── COURSE MANAGEMENT ─────────────────────────────────────
async function getCourses(req, res, next) {
  try {
    const courses = await prisma.course.findMany({
      include: {
        category: true,
        _count: { select: { lessons: true, enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ courses });
  } catch (err) { next(err); }
}

async function toggleCourse(req, res, next) {
  try {
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course) throw new AppError('Course not found', 404);
    const updated = await prisma.course.update({
      where: { id: req.params.id },
      data: { isPublished: !course.isPublished },
    });
    res.json({ message: `Course ${updated.isPublished ? 'published' : 'unpublished'}` });
  } catch (err) { next(err); }
}

// ─── CREATE TOURNAMENT ─────────────────────────────────────
async function createTournament(req, res, next) {
  try {
    const { title, type, startsAt, endsAt, xpBonus = 500, description } = req.body;
    const d = new Date(startsAt);
    const weekNum = Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 86400000 + 1) / 7);

    const tournament = await prisma.tournament.create({
      data: { title, type, weekNumber: weekNum, status: 'UPCOMING', startsAt: new Date(startsAt), endsAt: new Date(endsAt), xpBonus, description },
    });
    res.status(201).json({ tournament });
  } catch (err) { next(err); }
}

// ─── HALL OF FAME ──────────────────────────────────────────
async function getHallOfFame(req, res, next) {
  try {
    const entries = await prisma.hallOfFame.findMany({
      orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }, { rank: 'asc' }],
      take: 30,
    });
    res.json({ entries });
  } catch (err) { next(err); }
}

module.exports = { getStats, getUsers, toggleUser, getCourses, toggleCourse, createTournament, getHallOfFame };
