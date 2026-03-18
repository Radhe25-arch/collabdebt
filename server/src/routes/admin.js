// admin.js
const express      = require('express');
const adminRouter  = express.Router();
const skillRouter  = express.Router();
const adminCtrl    = require('../controllers/admin.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { prisma } = require('../config/db');

adminRouter.use(authenticate, requireAdmin);

adminRouter.get('/stats',                    adminCtrl.getStats);
adminRouter.get('/users',                    adminCtrl.getUsers);
adminRouter.patch('/users/:id/toggle',       adminCtrl.toggleUser);
adminRouter.get('/courses',                  adminCtrl.getCourses);
adminRouter.patch('/courses/:id/toggle',     adminCtrl.toggleCourse);
adminRouter.post('/tournaments',             adminCtrl.createTournament);
adminRouter.get('/hall-of-fame',             adminCtrl.getHallOfFame);

// ─── SKILL DNA ─────────────────────────────────────────────
// Computed skill analysis per user

skillRouter.get('/me', authenticate, async (req, res, next) => {
  try {
    // Build skill DNA from quiz attempts, lesson completions, enrollment patterns
    const [enrollments, quizAttempts] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId: req.user.id },
        include: { course: { include: { category: true, lessons: { include: { quiz: { include: { attempts: { where: { userId: req.user.id } } } } } } } } },
      }),
      prisma.quizAttempt.findMany({
        where: { userId: req.user.id },
        include: { quiz: { include: { lesson: { include: { course: { include: { category: true } } } } } } },
        take: 200,
      }),
    ]);

    // Build category-level skill map
    const skillMap = {};

    for (const e of enrollments) {
      const cat = e.course.category?.slug || 'general';
      if (!skillMap[cat]) skillMap[cat] = { score: 0, trend: 0, coursesEnrolled: 0, coursesCompleted: 0, quizAccuracy: [], weakTopics: [], strongTopics: [] };
      skillMap[cat].coursesEnrolled++;
      if (e.completedAt) skillMap[cat].coursesCompleted++;
    }

    for (const a of quizAttempts) {
      const cat = a.quiz?.lesson?.course?.category?.slug || 'general';
      if (!skillMap[cat]) skillMap[cat] = { score: 0, trend: 0, coursesEnrolled: 0, coursesCompleted: 0, quizAccuracy: [], weakTopics: [], strongTopics: [] };
      const accuracy = a.total > 0 ? Math.round((a.score / a.total) * 100) : 0;
      skillMap[cat].quizAccuracy.push(accuracy);
    }

    // Compute final scores
    for (const cat of Object.keys(skillMap)) {
      const s = skillMap[cat];
      const avgAccuracy = s.quizAccuracy.length
        ? Math.round(s.quizAccuracy.reduce((a, v) => a + v, 0) / s.quizAccuracy.length)
        : 0;
      const completionRate = s.coursesEnrolled > 0
        ? Math.round((s.coursesCompleted / s.coursesEnrolled) * 100)
        : 0;

      s.score = Math.round((avgAccuracy * 0.6) + (completionRate * 0.4));
      s.weakTopics   = avgAccuracy < 60 ? ['quiz accuracy', 'concept review'] : [];
      s.strongTopics = avgAccuracy >= 80 ? ['problem solving', 'core concepts'] : [];
      delete s.quizAccuracy;
    }

    // Upsert to DB
    await prisma.skillDNA.upsert({
      where: { userId: req.user.id },
      update: { data: skillMap },
      create: { userId: req.user.id, data: skillMap },
    });

    res.json({ skills: skillMap });
  } catch (err) { next(err); }
});

module.exports = { adminRouter, skillRouter };
