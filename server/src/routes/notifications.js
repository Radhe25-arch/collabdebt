const express = require('express');
const router  = express.Router();
const { prisma } = require('../config/db');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    const unread = notifications.filter((n) => !n.read).length;
    res.json({ notifications, unread });
  } catch (err) { next(err); }
});

router.patch('/read-all', authenticate, async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, read: false },
      data: { read: true },
    });
    res.json({ message: 'All marked as read' });
  } catch (err) { next(err); }
});

router.patch('/:id/read', authenticate, async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: { read: true },
    });
    res.json({ message: 'Marked as read' });
  } catch (err) { next(err); }
});

module.exports = router;
