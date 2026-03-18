const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { prisma } = require('../config/db');
const { awardXP, triggerQuestProgress, checkMilestoneBadges } = require('../utils/xp');
const AppError = require('../utils/AppError');

const courseRouter = express.Router();
const lessonRouter = express.Router();

// ─── COURSES ──────────────────────────────────────────────

courseRouter.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { category, difficulty, search, page = 1, limit = 20 } = req.query;
    const where = { isPublished: true };
    if (category)   where.category = { slug: category };
    if (difficulty) where.difficulty = difficulty.toUpperCase();
    if (search)     where.title = { contains: search, mode: 'insensitive' };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: { category: true, _count: { select: { lessons: true, enrollments: true } } },
        orderBy: { order: 'asc' },
        skip: (page - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.course.count({ where }),
    ]);

    let enrolledIds = new Set();
    if (req.user) {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: req.user.id, courseId: { in: courses.map((c) => c.id) } },
        select: { courseId: true },
      });
      enrolledIds = new Set(enrollments.map((e) => e.courseId));
    }

    res.json({
      courses: courses.map((c) => ({ ...c, isEnrolled: enrolledIds.has(c.id) })),
      total, page: Number(page), pages: Math.ceil(total / limit),
    });
  } catch (err) { next(err); }
});

courseRouter.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { courses: true } } },
    });
    res.json({ categories });
  } catch (err) { next(err); }
});

courseRouter.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const course = await prisma.course.findFirst({
      where: { OR: [{ id: req.params.id }, { slug: req.params.id }], isPublished: true },
      include: {
        category: true, badge: true,
        lessons: { orderBy: { order: 'asc' }, select: { id: true, title: true, slug: true, order: true, duration: true, xpReward: true } },
        _count: { select: { enrollments: true } },
      },
    });
    if (!course) throw new AppError('Course not found', 404);

    let enrollment = null;
    let completedLessonIds = [];
    if (req.user) {
      enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: req.user.id, courseId: course.id } },
      });
      const lp = await prisma.lessonProgress.findMany({
        where: { userId: req.user.id, lessonId: { in: course.lessons.map((l) => l.id) } },
        select: { lessonId: true },
      });
      completedLessonIds = lp.map((l) => l.lessonId);
    }

    res.json({ course, enrollment, completedLessonIds });
  } catch (err) { next(err); }
});

courseRouter.post('/:id/enroll', authenticate, async (req, res, next) => {
  try {
    const course = await prisma.course.findFirst({
      where: { OR: [{ id: req.params.id }, { slug: req.params.id }] },
    });
    if (!course) throw new AppError('Course not found', 404);

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: req.user.id, courseId: course.id } },
    });
    if (existing) return res.json({ enrollment: existing, message: 'Already enrolled' });

    const enrollment = await prisma.enrollment.create({ data: { userId: req.user.id, courseId: course.id } });
    res.status(201).json({ enrollment, message: 'Enrolled successfully' });
  } catch (err) { next(err); }
});

// ─── LESSONS ──────────────────────────────────────────────

lessonRouter.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const lesson = await prisma.lesson.findFirst({
      where: { OR: [{ id: req.params.id }, { slug: req.params.id }] },
      include: {
        course: { select: { id: true, title: true, slug: true } },
        quiz: { include: { questions: { orderBy: { order: 'asc' } } } },
      },
    });
    if (!lesson) throw new AppError('Lesson not found', 404);

    let isCompleted = false;
    if (req.user) {
      const lp = await prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId: req.user.id, lessonId: lesson.id } },
      });
      isCompleted = !!lp;
    }

    const sanitizedLesson = {
      ...lesson,
      quiz: lesson.quiz ? {
        ...lesson.quiz,
        questions: lesson.quiz.questions.map(({ correctIndex, explanation, ...q }) => q),
      } : null,
    };

    res.json({ lesson: sanitizedLesson, isCompleted });
  } catch (err) { next(err); }
});

lessonRouter.post('/:id/complete', authenticate, async (req, res, next) => {
  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } });
    if (!lesson) throw new AppError('Lesson not found', 404);

    const existing = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: req.user.id, lessonId: lesson.id } },
    });
    if (existing) return res.json({ message: 'Already completed', xpAwarded: 0 });

    await prisma.lessonProgress.create({ data: { userId: req.user.id, lessonId: lesson.id } });

    const course = await prisma.course.findUnique({
      where: { id: lesson.courseId },
      include: { _count: { select: { lessons: true } } },
    });
    const completedCount = await prisma.lessonProgress.count({
      where: { userId: req.user.id, lesson: { courseId: lesson.courseId } },
    });
    const progress = Math.round((completedCount / course._count.lessons) * 100);
    const isCompleted = progress === 100;

    await prisma.enrollment.updateMany({
      where: { userId: req.user.id, courseId: lesson.courseId },
      data: { progress, completedAt: isCompleted ? new Date() : null },
    });

    if (isCompleted) {
      await prisma.user.update({ where: { id: req.user.id }, data: { coursesCompleted: { increment: 1 } } });
    }

    const xpResult = await awardXP(req.user.id, lesson.xpReward, 'lesson_complete', lesson.id);

    // Auto-trigger quest progress + milestone badges (non-blocking)
    triggerQuestProgress(req.user.id, 'LESSON_COMPLETE').catch(() => {});
    checkMilestoneBadges(req.user.id).catch(() => {});
    if (isCompleted) {
      triggerQuestProgress(req.user.id, 'COURSE_ENROLL').catch(() => {});
    }

    res.json({ message: 'Lesson completed', xpAwarded: lesson.xpReward, courseProgress: progress, courseCompleted: isCompleted, ...xpResult });
  } catch (err) { next(err); }
});

lessonRouter.post('/:id/quiz', authenticate, async (req, res, next) => {
  try {
    const { answers } = req.body;
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: { quiz: { include: { questions: { orderBy: { order: 'asc' } } } } },
    });
    if (!lesson?.quiz) throw new AppError('No quiz for this lesson', 404);

    const questions = lesson.quiz.questions;
    let correct = 0;
    const results = questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctIndex;
      if (isCorrect) correct++;
      return { questionId: q.id, correct: isCorrect, correctIndex: q.correctIndex, explanation: q.explanation };
    });

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 70;
    const xpReward = passed ? Math.round(lesson.xpReward * 0.5) : 0;

    await prisma.quizAttempt.create({
      data: { userId: req.user.id, quizId: lesson.quiz.id, score: correct, total: questions.length, xpAwarded: xpReward },
    });
    await prisma.user.update({
      where: { id: req.user.id },
      data: { totalQuizAttempts: { increment: questions.length }, correctQuizAnswers: { increment: correct } },
    });

    let xpResult = null;
    if (xpReward > 0) xpResult = await awardXP(req.user.id, xpReward, 'quiz_pass', lesson.quiz.id);

    // Auto-trigger quest for quiz pass
    if (passed) triggerQuestProgress(req.user.id, 'QUIZ_PASS').catch(() => {});
    checkMilestoneBadges(req.user.id).catch(() => {});

    res.json({ score, passed, correct, total: questions.length, results, xpAwarded: xpReward, xpResult });
  } catch (err) { next(err); }
});

module.exports = { courseRouter, lessonRouter };
