// ─── AUTH ROUTES ──────────────────────────────────────────
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);
router.get('/me', authenticate, async (req, res, next) => {
  const { prisma } = require('../config/db');
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { interests: true, badges: { include: { badge: true } } },
    });
    const { passwordHash, googleId, ...safe } = user;
    res.json({ user: safe });
  } catch (err) { next(err); }
});

module.exports = router;
