const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { prisma } = require('./db');
const { awardXP } = require('../utils/xp');

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email from Google'), null);

        // Find or create user
        let user = await prisma.user.findFirst({
          where: { OR: [{ googleId: profile.id }, { email }] },
        });

        if (user) {
          // Update googleId if missing
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId: profile.id, isVerified: true },
            });
          }
        } else {
          // New user via Google
          const baseUsername = email.split('@')[0].replace(/[^a-z0-9_]/gi, '_').toLowerCase();
          let username = baseUsername;
          let suffix = 0;
          while (await prisma.user.findUnique({ where: { username } })) {
            username = `${baseUsername}${++suffix}`;
          }

          user = await prisma.user.create({
            data: {
              email,
              googleId:   profile.id,
              fullName:   profile.displayName || username,
              username,
              avatarUrl:  profile.photos?.[0]?.value,
              isVerified: true,
              onboarded:  false,
            },
          });

          // Welcome XP
          await awardXP(user.id, 100, 'welcome_bonus');
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Wire Google OAuth routes
function setupOAuthRoutes(app) {
  app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
  );

  app.get('/api/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
    require('../controllers/auth.controller').googleCallback
  );
}

module.exports = { setupOAuthRoutes };
