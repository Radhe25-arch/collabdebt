const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');

async function getGlobal(req, res, next) {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: { xp: 'desc' },
        skip: Number(skip),
        take: Number(limit),
        select: { id: true, username: true, fullName: true, avatarUrl: true, xp: true, level: true, streak: true, coursesCompleted: true },
      }),
      prisma.user.count(),
    ]);
    const data = {
      users: users.map((u, i) => ({ ...u, rank: skip + i + 1 })),
      total, page: Number(page), pages: Math.ceil(total / limit),
    };
    if (req.user) data.myRank = await getUserRank(req.user.id);
    res.json(data);
  } catch (err) { next(err); }
}

async function getWeekly(req, res, next) {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    const xpRows = await prisma.xPTransaction.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: weekAgo } },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 50,
    });
    const userIds = xpRows.map((r) => r.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true, fullName: true, avatarUrl: true, level: true, streak: true },
    });
    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
    res.json({
      users: xpRows.map((r, i) => ({ ...userMap[r.userId], weeklyXP: r._sum.amount, rank: i + 1 })).filter((u) => u.username),
    });
  } catch (err) { next(err); }
}

async function getByCategory(req, res, next) {
  try {
    const { slug } = req.params;
    const completions = await prisma.enrollment.groupBy({
      by: ['userId'],
      where: { completedAt: { not: null }, course: { category: { slug } } },
      _count: { courseId: true },
      orderBy: { _count: { courseId: 'desc' } },
      take: 50,
    });
    const userIds = completions.map((r) => r.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true, fullName: true, avatarUrl: true, xp: true, level: true },
    });
    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
    res.json({
      category: slug,
      users: completions.map((r, i) => ({ ...userMap[r.userId], coursesCompleted: r._count.courseId, rank: i + 1 })).filter((u) => u.username),
    });
  } catch (err) { next(err); }
}

async function getFriends(req, res, next) {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    const follows = await prisma.follow.findMany({ where: { followerId: req.user.id }, select: { followingId: true } });
    const friendIds = [req.user.id, ...follows.map((f) => f.followingId)];
    const users = await prisma.user.findMany({
      where: { id: { in: friendIds } },
      orderBy: { xp: 'desc' },
      select: { id: true, username: true, fullName: true, avatarUrl: true, xp: true, level: true, streak: true },
    });
    res.json({ users: users.map((u, i) => ({ ...u, rank: i + 1 })) });
  } catch (err) { next(err); }
}

async function getUserRank(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { xp: true } });
  if (!user) return null;
  return (await prisma.user.count({ where: { xp: { gt: user.xp } } })) + 1;
}

module.exports = { getGlobal, getWeekly, getByCategory, getFriends };
