const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

function errorHandler(err, req, res, next) {
  let { statusCode = 500, message } = err;

  // Prisma unique constraint
  if (err.code === 'P2002') {
    statusCode = 409;
    message = `Duplicate value for field: ${err.meta?.target?.join(', ')}`;
  }
  // Prisma record not found
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.path} — ${err.message}`, { stack: err.stack });
  }

  res.status(statusCode).json({
    error: message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
