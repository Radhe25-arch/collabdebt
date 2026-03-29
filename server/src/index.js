require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const passport = require('passport');

const { prisma } = require('./config/db');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const { setupOAuthRoutes } = require('./config/passport');

const authRoutes         = require('./routes/auth');
const userRoutes         = require('./routes/users');
const { courseRouter }   = require('./routes/courses');
const lessonRoutes       = require('./routes/lessons');
const leaderboardRoutes  = require('./routes/leaderboard');
const tournamentRoutes   = require('./routes/tournaments');
const badgeRoutes        = require('./routes/badges');
const notificationRoutes = require('./routes/notifications');
const { battleRouter, questRouter, portfolioRouter } = require('./routes/new-features');
const { adminRouter, skillRouter } = require('./routes/admin');
const { mentorRouter, roomRouter, codeRouter } = require('./routes/mentor-rooms');
const socialRoutes       = require('./routes/social');

const app = express();

// Trust Vercel proxy
app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  'https://collabdebt-wg48.vercel.app',
  'https://collabdebt.vercel.app',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

app.options('*', cors());
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(passport.initialize());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { error: 'Too many requests' },
  validate: { xForwardedForHeader: false },
}));

app.get('/health', async (req, res) => {
  try { await prisma.$queryRaw`SELECT 1`; res.json({ status: 'ok', db: 'connected' }); }
  catch (err) { res.status(503).json({ status: 'error', db: 'disconnected' }); }
});

app.get('/api/health', async (req, res) => {
  try { await prisma.$queryRaw`SELECT 1`; res.json({ status: 'ok', db: 'connected' }); }
  catch (err) { res.status(503).json({ status: 'error', db: 'disconnected' }); }
});

app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/courses',       courseRouter);
app.use('/api/lessons',       lessonRoutes);
app.use('/api/leaderboard',   leaderboardRoutes);
app.use('/api/tournaments',   tournamentRoutes);
app.use('/api/badges',        badgeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/battles',       battleRouter);
app.use('/api/quests',        questRouter);
app.use('/api/portfolio',     portfolioRouter);
app.use('/api/admin',         adminRouter);
app.use('/api/skills',        skillRouter);
app.use('/api/mentor',        mentorRouter);
app.use('/api/rooms',         roomRouter);
app.use('/api/code',          codeRouter);
app.use('/api/social',        socialRoutes);

setupOAuthRoutes(app);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  const { connectRedis } = require('./config/redis');
  const cronJobs = require('./utils/cronJobs');
  prisma.$connect()
    .then(() => connectRedis())
    .then(() => { cronJobs.init(); app.listen(PORT, () => logger.info('Server running on port ' + PORT)); })
    .catch((err) => { logger.error(err); process.exit(1); });
}

module.exports = app;
