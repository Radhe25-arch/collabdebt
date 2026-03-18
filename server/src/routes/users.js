const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { prisma } = require('../config/db');
const { getLevelName, getXPProgress } = require('../utils/xp');
const AppError = require('../utils/AppError');

const router = express.Router();

router.get('/me/stats', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [user, enrollments, badges, tourEntries, activityLogs] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, include: { interests: true } }),
      prisma.enrollment.findMany({ where: { userId }, include: { course: { include: { category: true } } } }),
      prisma.userBadge.findMany({ where: { userId }, include: { badge: true } }),
      prisma.tournamentEntry.findMany({ where: { userId }, include: { tournament: true }, orderBy: { joinedAt: 'desc' }, take: 10 }),
      prisma.activityLog.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 90 }),
    ]);
    const rank = (await prisma.user.count({ where: { xp: { gt: user.xp } } })) + 1;
    const accuracy = user.totalQuizAttempts > 0 ? Math.round((user.correctQuizAnswers / user.totalQuizAttempts) * 100) : 0;
    const skillMap = {};
    for (const e of enrollments) {
      const cat = e.course.category.slug;
      if (!skillMap[cat]) skillMap[cat] = { completed: 0, total: 0 };
      skillMap[cat].total++;
      if (e.completedAt) skillMap[cat].completed++;
    }
    const { passwordHash, googleId, ...safe } = user;
    res.json({ user: { ...safe, rank, accuracy, levelName: getLevelName(user.level), xpProgress: getXPProgress(user.xp) }, enrollments, badges, tournamentHistory: tourEntries, activityLogs, skills: skillMap });
  } catch (err) { next(err); }
});

router.get('/:username', optionalAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      include: { interests: true, badges: { include: { badge: true } }, enrollments: { include: { course: { select: { title: true, slug: true } } }, take: 10 } },
    });
    if (!user) throw new AppError('User not found', 404);
    const rank = (await prisma.user.count({ where: { xp: { gt: user.xp } } })) + 1;
    const { passwordHash, googleId, ...safe } = user;
    res.json({ user: { ...safe, rank, levelName: getLevelName(user.level) } });
  } catch (err) { next(err); }
});

// PUT — basic profile update (name, bio, avatar)
router.put('/me', authenticate, async (req, res, next) => {
  try {
    const { fullName, bio, avatarUrl } = req.body;
    const user = await prisma.user.update({ where: { id: req.user.id }, data: { fullName, bio, avatarUrl } });
    const { passwordHash, googleId, ...safe } = user;
    res.json({ user: safe });
  } catch (err) { next(err); }
});

// PATCH — onboarding + interests update
router.patch('/me', authenticate, async (req, res, next) => {
  try {
    const { role, ageGroup, interests, onboarded, fullName, bio, avatarUrl } = req.body;
    const updateData = {};
    if (role !== undefined)      updateData.role      = role;
    if (ageGroup !== undefined)  updateData.ageGroup  = ageGroup;
    if (onboarded !== undefined) updateData.onboarded = onboarded;
    if (fullName !== undefined)  updateData.fullName  = fullName;
    if (bio !== undefined)       updateData.bio       = bio;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    if (interests && Array.isArray(interests)) {
      await prisma.userInterest.deleteMany({ where: { userId: req.user.id } });
      updateData.interests = { create: interests.map((category) => ({ category })) };
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      include: { interests: true },
    });
    const { passwordHash, googleId, ...safe } = user;
    res.json({ user: safe });
  } catch (err) { next(err); }
});

router.post('/:id/follow', authenticate, async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) throw new AppError('Cannot follow yourself', 400);
    await prisma.follow.upsert({
      where: { followerId_followingId: { followerId: req.user.id, followingId: req.params.id } },
      update: {},
      create: { followerId: req.user.id, followingId: req.params.id },
    });
    res.json({ message: 'Following' });
  } catch (err) { next(err); }
});

router.delete('/:id/follow', authenticate, async (req, res, next) => {
  try {
    await prisma.follow.deleteMany({ where: { followerId: req.user.id, followingId: req.params.id } });
    res.json({ message: 'Unfollowed' });
  } catch (err) { next(err); }
});

module.exports = router;
