const nodemailer = require('nodemailer');
const logger = require('./logger');
 
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
});
 
async function send({ to, subject, html }) {
  if (!process.env.SMTP_USER) {
    logger.warn(`[EMAIL] SMTP not configured — skipping email to ${to}: ${subject}`);
    if (process.env.NODE_ENV !== 'production') {
      logger.debug(`[EMAIL_DEV_PREVIEW] Content for ${to}:\n${html}`);
    }
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'CodeArena <noreply@codearena.dev>',
      to, subject, html,
    });
    logger.info(`[EMAIL] Sent "${subject}" to ${to}`);
  } catch (err) {
    logger.error(`[EMAIL] Failed to send to ${to}: ${err.message}`);
  }
}
 
// ─── BASE TEMPLATE ──────────────────────────────────────────────────────────
// CodeArena theme: white background, blue accents — matches the app UI exactly
function base(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>CodeArena</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #F1F5F9;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #0F172A;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .outer { padding: 40px 16px; }
    .wrap {
      max-width: 600px;
      margin: 0 auto;
      background: #FFFFFF;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
    }
    .topbar { height: 5px; background: linear-gradient(90deg, #1D4ED8, #3B82F6, #06B6D4); }
    .header {
      padding: 32px 48px 28px;
      border-bottom: 1px solid #F1F5F9;
      display: flex; align-items: center; justify-content: space-between;
    }
    .logo-wrap { display: flex; align-items: center; gap: 10px; }
    .logo-icon {
      width: 38px; height: 38px;
      background: #2563EB;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
    }
    .logo-text { font-size: 18px; font-weight: 800; color: #0F172A; letter-spacing: -0.03em; }
    .header-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; font-weight: 600;
      color: #94A3B8; text-transform: uppercase; letter-spacing: 0.08em;
      background: #F8FAFC; border: 1px solid #E2E8F0;
      padding: 4px 10px; border-radius: 6px;
    }
    .body { padding: 44px 48px; }
    h1 {
      font-size: 28px; font-weight: 800;
      color: #0F172A; letter-spacing: -0.03em;
      line-height: 1.25; margin-bottom: 12px;
    }
    .lead { font-size: 15px; color: #64748B; line-height: 1.7; margin-bottom: 28px; }
    .accent { color: #2563EB; font-weight: 700; }
    .btn {
      display: inline-block;
      background: #2563EB; color: #FFFFFF !important;
      text-decoration: none;
      padding: 14px 36px; border-radius: 12px;
      font-size: 15px; font-weight: 700; letter-spacing: -0.01em;
      box-shadow: 0 4px 14px rgba(37,99,235,0.3);
    }
    .btn-wrap { text-align: center; margin: 32px 0; }
    .divider { height: 1px; background: #F1F5F9; margin: 32px 0; }
    .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 24px 0; }
    .stat-card {
      background: #F8FAFC; border: 1px solid #E2E8F0;
      border-radius: 14px; padding: 18px 20px;
    }
    .stat-val { font-size: 26px; font-weight: 800; color: #0F172A; letter-spacing: -0.03em; margin-bottom: 2px; }
    .stat-lbl { font-size: 11px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.08em; }
    .steps { margin: 24px 0; }
    .step { display: flex; gap: 14px; align-items: flex-start; padding: 14px 0; border-bottom: 1px solid #F1F5F9; }
    .step:last-child { border-bottom: none; }
    .step-num {
      width: 28px; height: 28px; border-radius: 8px;
      background: #EFF6FF; color: #2563EB;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; margin-top: 2px;
    }
    .step-text { font-size: 14px; color: #334155; line-height: 1.6; }
    .step-text strong { color: #0F172A; font-weight: 700; }
    .badge-row { display: flex; gap: 8px; flex-wrap: wrap; margin: 20px 0; }
    .badge {
      background: #EFF6FF; border: 1px solid #BFDBFE;
      border-radius: 8px; padding: 5px 12px;
      font-size: 12px; font-weight: 600; color: #2563EB;
    }
    .info-box {
      background: #EFF6FF; border: 1px solid #BFDBFE;
      border-left: 4px solid #2563EB;
      border-radius: 12px; padding: 16px 20px;
      margin: 20px 0; font-size: 14px; color: #1E40AF; line-height: 1.6;
    }
    .otp-wrap {
      background: #F8FAFC; border: 2px dashed #BFDBFE;
      border-radius: 16px; padding: 36px 24px;
      text-align: center; margin: 28px 0;
    }
    .otp-label { font-size: 11px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 14px; }
    .otp-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 46px; font-weight: 700;
      color: #2563EB; letter-spacing: 10px; line-height: 1;
    }
    .otp-expiry { font-size: 12px; color: #94A3B8; margin-top: 12px; }
    .terminal {
      background: #0F172A; border-radius: 12px;
      padding: 18px 22px; margin: 20px 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px; line-height: 1.9;
    }
    .t-prompt { color: #475569; }
    .t-cmd    { color: #60A5FA; }
    .t-out    { color: #34D399; }
    .t-val    { color: #FFFFFF; }
    .t-dim    { color: #334155; }
    .warn-box {
      background: #FFF7ED; border: 1px solid #FED7AA;
      border-radius: 12px; padding: 14px 18px;
      font-size: 13px; color: #9A3412; margin-top: 16px; line-height: 1.6;
    }
    .alert-box {
      background: #FEF2F2; border: 1px solid #FECACA;
      border-left: 4px solid #EF4444;
      border-radius: 12px; padding: 14px 18px;
      font-size: 13px; color: #991B1B; margin: 16px 0; line-height: 1.6;
    }
    .footer {
      padding: 24px 48px; background: #F8FAFC; border-top: 1px solid #F1F5F9;
      display: flex; justify-content: space-between; align-items: center; gap: 16px;
    }
    .footer-text { font-size: 11px; color: #94A3B8; }
    .footer-link { font-size: 11px; font-weight: 600; color: #2563EB; text-decoration: none; }
    @media (max-width: 600px) {
      .header { padding: 24px 28px 20px; }
      .body   { padding: 32px 28px; }
      .footer { padding: 20px 28px; flex-direction: column; text-align: center; gap: 8px; }
      .stat-grid { grid-template-columns: 1fr; }
      h1 { font-size: 24px; }
      .otp-code { font-size: 36px; letter-spacing: 6px; }
    }
  </style>
</head>
<body>
  <div class="outer">
    <div class="wrap">
      <div class="topbar"></div>
      <div class="header">
        <div class="logo-wrap">
          <div class="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <span class="logo-text">CodeArena</span>
        </div>
        <span class="header-tag">Automated Message</span>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <span class="footer-text">© 2026 CodeArena. All rights reserved.</span>
        <a href="${process.env.CLIENT_URL || 'https://codearena.dev'}" class="footer-link">codearena.dev →</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}
 
// ─── WELCOME EMAIL ──────────────────────────────────────────────────────────
async function sendWelcome(user) {
  const html = base(`
    <h1>Welcome to CodeArena, <span class="accent">${user.username}!</span> 🎉</h1>
    <p class="lead">
      Your account is live. You've joined thousands of developers levelling up their skills
      through real challenges, courses, and 1v1 battles — completely free, forever.
    </p>
 
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-val">139+</div>
        <div class="stat-lbl">Free Courses</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">+100</div>
        <div class="stat-lbl">Bonus XP Awarded</div>
      </div>
    </div>
 
    <div class="divider"></div>
 
    <p style="font-size:14px;font-weight:700;color:#0F172A;margin-bottom:4px;">Here's how to get started:</p>
 
    <div class="steps">
      <div class="step">
        <div class="step-num">01</div>
        <div class="step-text">
          <strong>Pick a course</strong> — Browse 139+ free courses across JavaScript, Python, TypeScript, C++, and more. No credit card, no paywall.
        </div>
      </div>
      <div class="step">
        <div class="step-num">02</div>
        <div class="step-text">
          <strong>Complete daily quests</strong> — Earn XP every day by finishing lessons, passing quizzes, and maintaining streaks.
        </div>
      </div>
      <div class="step">
        <div class="step-num">03</div>
        <div class="step-text">
          <strong>Challenge others</strong> — Enter the 1v1 Arena or join weekly tournaments to climb the global leaderboard.
        </div>
      </div>
    </div>
 
    <div class="btn-wrap">
      <a href="${process.env.CLIENT_URL || 'https://codearena.dev'}/courses" class="btn">Browse Courses →</a>
    </div>
 
    <div class="badge-row">
      <span class="badge">✦ Level 1</span>
      <span class="badge">🔥 New Member</span>
      <span class="badge">⚡ +100 XP</span>
    </div>
 
    <p style="font-size:12px;color:#94A3B8;margin-top:24px;">
      You're receiving this because you created a CodeArena account with this email address.
      If this wasn't you, you can safely ignore this message.
    </p>
  `);
 
  await send({
    to:      user.email,
    subject: `Welcome to CodeArena, ${user.username}! Your account is ready ⚡`,
    html,
  });
}
 
// ─── PASSWORD RESET EMAIL ───────────────────────────────────────────────────
async function sendPasswordReset(user, otp) {
  const html = base(`
    <h1>Reset Your Password</h1>
    <p class="lead">
      Hi <span class="accent">@${user.username}</span>, we received a request to reset your
      CodeArena password. Use the one-time code below to proceed.
    </p>
 
    <div class="otp-wrap">
      <div class="otp-label">Your One-Time Reset Code</div>
      <div class="otp-code">${otp}</div>
      <div class="otp-expiry">⏱ Valid for 15 minutes only &nbsp;·&nbsp; Do not share this code</div>
    </div>
 
    <div class="info-box">
      Enter this code on the password reset page along with your new password.
      Once used, this code expires immediately.
    </div>
 
    <div class="terminal">
      <div><span class="t-prompt">$ </span><span class="t-cmd">codearena</span> auth reset --otp=<span class="t-out">${otp}</span></div>
      <div style="margin-top:6px"><span class="t-dim">→ status:  </span><span class="t-out">VALID · awaiting new password</span></div>
      <div><span class="t-dim">→ user:    </span><span class="t-val">@${user.username}</span></div>
      <div><span class="t-dim">→ expires: </span><span class="t-val">15 minutes from request</span></div>
    </div>
 
    <div class="btn-wrap">
      <a href="${process.env.CLIENT_URL || 'https://codearena.dev'}/login" class="btn">Go to Login Page →</a>
    </div>
 
    <div class="warn-box">
      ⚠️ <strong>Didn't request this?</strong> Your account is safe — someone may have mistyped
      their email. You can safely ignore this message. If this keeps happening, please contact support.
    </div>
 
    <p style="font-size:12px;color:#94A3B8;margin-top:20px;">
      For security, this code is single-use and expires in 15 minutes.
      Never share your reset code with anyone.
    </p>
  `);
 
  await send({
    to:      user.email,
    subject: '[CodeArena] Your password reset code',
    html,
  });
}
 
// ─── STREAK REMINDER ────────────────────────────────────────────────────────
async function sendStreakReminder(user) {
  const html = base(`
    <h1>Your streak is at risk! 🔥</h1>
    <p class="lead">
      Hey <span class="accent">@${user.username || user.fullName}</span>, your
      <strong>${user.streak}-day streak</strong> is about to expire.
      Complete any lesson or quest before midnight UTC to keep it alive.
    </p>
 
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-val">${user.streak}</div>
        <div class="stat-lbl">Day Streak 🔥</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">&lt; 24h</div>
        <div class="stat-lbl">Time Remaining</div>
      </div>
    </div>
 
    <div class="alert-box">
      <strong>Action required!</strong> You haven't completed any activity today.
      Finish a lesson, quiz, or quest to maintain your streak.
    </div>
 
    <div class="btn-wrap">
      <a href="${process.env.CLIENT_URL || 'https://codearena.dev'}/dashboard" class="btn">Keep My Streak →</a>
    </div>
 
    <p style="font-size:12px;color:#94A3B8;margin-top:8px;">
      Consistency compounds. Every day you show up, you get better. Don't break the chain.
    </p>
  `);
 
  await send({
    to:      user.email,
    subject: `[CodeArena] Your ${user.streak}-day streak expires today 🔥`,
    html,
  });
}
 
// ─── WEEKLY SUMMARY ─────────────────────────────────────────────────────────
async function sendWeeklySummary(user, stats) {
  const html = base(`
    <h1>Your Weekly Report 📊</h1>
    <p class="lead">
      Here's what <span class="accent">@${user.username}</span> accomplished this week on CodeArena.
    </p>
 
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-val">+${stats.xpEarned.toLocaleString()}</div>
        <div class="stat-lbl">XP Earned</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${stats.lessonsCompleted}</div>
        <div class="stat-lbl">Lessons Done</div>
      </div>
    </div>
 
    <div class="terminal">
      <div><span class="t-prompt">$ </span><span class="t-cmd">codearena</span> analytics <span class="t-out">--week</span></div>
      <div style="margin-top:8px"><span class="t-dim">xp_earned:    </span><span class="t-out">+${stats.xpEarned} XP</span></div>
      <div><span class="t-dim">lessons:      </span><span class="t-val">${stats.lessonsCompleted} completed</span></div>
      <div><span class="t-dim">daily_avg:    </span><span class="t-out">+${Math.round(stats.xpEarned / 7)} XP/day</span></div>
      <div><span class="t-dim">current_lvl:  </span><span class="t-val">Level ${user.level || 1}</span></div>
    </div>
 
    <div class="info-box">
      Keep the momentum going! Consistent practice is the fastest path to mastery.
    </div>
 
    <div class="btn-wrap">
      <a href="${process.env.CLIENT_URL || 'https://codearena.dev'}/dashboard" class="btn">Continue Learning →</a>
    </div>
 
    <p style="font-size:12px;color:#94A3B8;margin-top:8px;">
      You're receiving this weekly summary because you have an active CodeArena account.
    </p>
  `);
 
  await send({
    to:      user.email,
    subject: `[CodeArena] Your week in review: +${stats.xpEarned} XP earned`,
    html,
  });
}
 
// ─── LEVEL UP NOTIFICATION ──────────────────────────────────────────────────
async function sendLevelUp(user, newLevel, levelName) {
  const html = base(`
    <h1>Level Up! You're now <span class="accent">Level ${newLevel}</span> 🏆</h1>
    <p class="lead">
      Incredible work, <span class="accent">@${user.username}</span>!
      You've reached <strong>${levelName}</strong>. Your dedication is paying off.
    </p>
 
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-val">${newLevel}</div>
        <div class="stat-lbl">New Level</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${(user.xp || 0).toLocaleString()}</div>
        <div class="stat-lbl">Total XP</div>
      </div>
    </div>
 
    <div class="terminal">
      <div><span class="t-prompt">$ </span><span class="t-cmd">codearena</span> promote <span class="t-out">--achieved</span></div>
      <div style="margin-top:8px"><span class="t-dim">prev_level:  </span><span class="t-dim">Level ${newLevel - 1}</span></div>
      <div><span class="t-dim">new_level:   </span><span class="t-out">Level ${newLevel} — ${levelName}</span></div>
      <div><span class="t-dim">total_xp:    </span><span class="t-val">${(user.xp || 0).toLocaleString()} XP</span></div>
    </div>
 
    <div class="info-box">
      New challenges and advanced courses have been unlocked for your level. Keep pushing!
    </div>
 
    <div class="btn-wrap">
      <a href="${process.env.CLIENT_URL || 'https://codearena.dev'}/profile" class="btn">View My Profile →</a>
    </div>
  `);
 
  await send({
    to:      user.email,
    subject: `[CodeArena] 🏆 Level Up! You reached Level ${newLevel}: ${levelName}`,
    html,
  });
}
 
module.exports = { sendWelcome, sendPasswordReset, sendStreakReminder, sendWeeklySummary, sendLevelUp };
