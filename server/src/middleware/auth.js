const { verifyAccessToken } = require('../utils/jwt');
const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) throw new AppError('No token provided', 401);

    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, isActive: true },
    });
    if (!user || !user.isActive) throw new AppError('User not found or inactive', 401);

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return next(new AppError('Token expired', 401));
    if (err.name === 'JsonWebTokenError')  return next(new AppError('Invalid token', 401));
    next(err);
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return next(new AppError('Admin access required', 403));
  }
  next();
}

// Optional auth — sets req.user if token present, doesn't fail if absent
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return next();
    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, isActive: true },
    });
    if (user?.isActive) req.user = user;
  } catch (_) { /* ignore */ }
  next();
}

module.exports = { authenticate, requireAdmin, optionalAuth };
