const express = require('express');
const router  = express.Router();
const { prisma } = require('../config/db');
const { authenticate } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const badges = await prisma.badge.findMany({ orderBy: { rarity: 'asc' } });
    res.json({ badges });
  } catch (err) { next(err); }
});

router.get('/user/:id', async (req, res, next) => {
  try {
    const badges = await prisma.userBadge.findMany({
      where: { userId: req.params.id },
      include: { badge: true },
      orderBy: { awardedAt: 'desc' },
    });
    res.json({ badges });
  } catch (err) { next(err); }
});

module.exports = router;
