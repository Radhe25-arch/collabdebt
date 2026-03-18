const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { awardXP } = require('../utils/xp');
const emailService = require('../utils/email');
const AppError = require('../utils/AppError');

async function register(req, res, next) {
  try {
    const { email, password, fullName, username, role, ageGroup, interests } = req.body;
    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existing) {
      if (existing.email === email) throw new AppError('Email already in use', 409);
      if (existing.username === username) throw new AppError('Username already taken', 409);
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email, passwordHash, fullName, username,
        role: role || 'STUDENT',
        ageGroup: ageGroup || 'COLLEGE',
        onboarded: true,
        interests: { create: (interests || []).map((category) => ({ category })) },
      },
    });
    await awardXP(user.id, 100, 'welcome_bonus');
    emailService.sendWelcome(user).catch(() => {});
    const accessToken  = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id });
    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });
    setRefreshCookie(res, refreshToken);
    res.status(201).json({ message: 'Account created successfully', user: sanitizeUser(user), accessToken });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email }, include: { interests: true } });
    if (!user || !user.passwordHash) throw new AppError('Invalid credentials', 401);
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError('Invalid credentials', 401);
    if (!user.isActive) throw new AppError('Account suspended', 403);
    const updatedStreak = await updateStreak(user);
    const accessToken  = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id });
    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });
    await prisma.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } });
    setRefreshCookie(res, refreshToken);
    res.json({ message: 'Login successful', user: { ...sanitizeUser(user), streak: updatedStreak }, accessToken });
  } catch (err) { next(err); }
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new AppError('No refresh token', 401);
    const payload = verifyRefreshToken(token);
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) throw new AppError('Refresh token expired or invalid', 401);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) throw new AppError('User not found', 401);
    await prisma.refreshToken.delete({ where: { token } });
    const newAccessToken  = signAccessToken({ sub: user.id, role: user.role });
    const newRefreshToken = signRefreshToken({ sub: user.id });
    await prisma.refreshToken.create({ data: { token: newRefreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });
    setRefreshCookie(res, newRefreshToken);
    res.json({ accessToken: newAccessToken });
  } catch (err) { next(err); }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (token) await prisma.refreshToken.deleteMany({ where: { token } });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ message: 'Logged out' });
  } catch (err) { next(err); }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ message: 'If that email exists, a reset code has been sent.' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.passwordReset.create({ data: { otp, userId: user.id, expiresAt: new Date(Date.now() + 15 * 60 * 1000) } });
    await emailService.sendPasswordReset(user, otp);
    res.json({ message: 'If that email exists, a reset code has been sent.' });
  } catch (err) { next(err); }
}

async function resetPassword(req, res, next) {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Invalid request', 400);
    const reset = await prisma.passwordReset.findFirst({
      where: { userId: user.id, otp, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!reset) throw new AppError('Invalid or expired OTP', 400);
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
      prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } }),
      prisma.refreshToken.deleteMany({ where: { userId: user.id } }),
    ]);
    res.json({ message: 'Password reset successfully' });
  } catch (err) { next(err); }
}

async function googleCallback(req, res) {
  try {
    const user = req.user;
    const accessToken  = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id });
    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });
    setRefreshCookie(res, refreshToken);
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`);
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
}

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
}

function sanitizeUser(user) {
  const { passwordHash, googleId, ...safe } = user;
  return safe;
}

async function updateStreak(user) {
  const now = new Date();
  const lastActive = user.lastActiveAt;
  if (!lastActive) return 1;
  const diffDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
  let newStreak = user.streak;
  if (diffDays === 0) return newStreak;
  if (diffDays === 1) newStreak += 1;
  else newStreak = 1;
  const longestStreak = Math.max(newStreak, user.longestStreak);
  await prisma.user.update({ where: { id: user.id }, data: { streak: newStreak, longestStreak, lastActiveAt: now } });
  if (newStreak % 7 === 0)  await awardXP(user.id, 200, 'streak_7_day_bonus');
  if (newStreak % 30 === 0) await awardXP(user.id, 1000, 'streak_30_day_bonus');
  return newStreak;
}

module.exports = { register, login, refresh, logout, forgotPassword, resetPassword, googleCallback };
