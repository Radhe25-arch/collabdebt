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
      from: process.env.EMAIL_FROM || 'SkillForge <noreply@skillforge.dev>',
      to, subject, html,
    });
    logger.info(`[EMAIL] Sent "${subject}" to ${to}`);
  } catch (err) {
    logger.error(`[EMAIL] Failed to send to ${to}: ${err.message}`);
  }
}
 
// ─── BASE TEMPLATE ─────────────────────────────────────────
function base(content) {
  const clientUrl = process.env.CLIENT_URL || 'https://skillforge.dev';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>SkillForge</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#F8FAFC;font-family:'Inter',Arial,sans-serif;color:#1E293B;line-height:1.6;-webkit-font-smoothing:antialiased}
    .outer{padding:32px 16px;background:#F1F5F9}
    .wrap{max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)}
    .topbar{height:5px;background:linear-gradient(90deg,#2563EB,#3B82F6,#06B6D4)}
    .header{padding:36px 40px 28px;border-bottom:1px solid #F1F5F9;background:#FFFFFF}
    .logo-row{display:flex;align-items:center;gap:10px;margin-bottom:0}
    .logo-box{width:36px;height:36px;background:#2563EB;border-radius:10px;display:flex;align-items:center;justify-content:center}
    .logo-text{font-size:20px;font-weight:800;letter-spacing:-0.03em;color:#0F172A}
    .body{padding:36px 40px}
    h1{font-size:26px;font-weight:800;margin-bottom:10px;color:#0F172A;letter-spacing:-0.025em;line-height:1.3}
    h1 span{color:#2563EB}
    p{font-size:15px;color:#475569;margin-bottom:18px;line-height:1.7}
    .highlight{color:#2563EB;font-weight:700}
    .card-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:24px 0}
    @media(max-width:480px){.card-grid{grid-template-columns:1fr}}
    .stat-card{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:18px 20px;text-align:left}
    .stat-val{font-size:28px;font-weight:900;color:#0F172A;margin-bottom:4px;letter-spacing:-0.03em}
    .stat-lbl{font-size:11px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.08em;font-weight:600}
    .steps{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:16px;padding:24px;margin:24px 0}
    .step{display:flex;gap:14px;margin-bottom:18px;align-items:flex-start}
    .step:last-child{margin-bottom:0}
    .step-num{min-width:32px;height:32px;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#2563EB;font-family:'JetBrains Mono',monospace;flex-shrink:0}
    .step-text{font-size:14px;color:#334155;line-height:1.6;padding-top:5px}
    .step-text strong{color:#0F172A;font-weight:700}
    .btn-wrap{text-align:center;margin:28px 0 8px}
    .btn{display:inline-block;background:#2563EB;color:#FFFFFF!important;text-decoration:none;padding:15px 36px;border-radius:12px;font-size:15px;font-weight:700;letter-spacing:0.01em;box-shadow:0 4px 14px rgba(37,99,235,0.3)}
    .divider{height:1px;background:#F1F5F9;margin:28px 0}
    .badge-row{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 20px}
    .badge{background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:5px 12px;font-size:11px;font-weight:700;color:#2563EB;letter-spacing:0.02em}
    .badge.green{background:#F0FDF4;border-color:#BBF7D0;color:#16A34A}
    .badge.amber{background:#FFFBEB;border-color:#FDE68A;color:#D97706}
    .footer{padding:20px 40px 28px;background:#F8FAFC;border-top:1px solid #F1F5F9;text-align:center}
    .footer p{font-size:12px;color:#94A3B8;margin:0}
    .footer a{color:#2563EB;text-decoration:none;font-weight:600}
    .xp-banner{background:linear-gradient(135deg,#EFF6FF,#F0FDF4);border:1px solid #BFDBFE;border-radius:14px;padding:18px 22px;display:flex;align-items:center;gap:14px;margin:20px 0}
    .xp-icon{width:44px;height:44px;background:#2563EB;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .xp-title{font-size:15px;font-weight:800;color:#0F172A}
    .xp-sub{font-size:12px;color:#64748B;margin-top:2px}
  </style>
</head>
<body>
<div class="outer">
  <div class="wrap">
    <div class="topbar"></div>
    <div class="header">
      <div class="logo-row">
        <div class="logo-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </div>
        <span class="logo-text">SkillForge</span>
      </div>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>© 2026 SkillForge — Master the Future of Technology.<br>
      <a href="${clientUrl}">Visit SkillForge</a> &nbsp;·&nbsp; <a href="${clientUrl}/settings">Manage Notifications</a></p>
    </div>
  </div>
</div>
</body>
</html>`;
}
 
// ─── WELCOME EMAIL ─────────────────────────────────────────
async function sendWelcome(user) {
  const clientUrl = process.env.CLIENT_URL || 'https://skillforge.dev';
  const html = base(`
    <h1>Welcome to SkillForge, <span>${user.username}!</span> 🎉</h1>
    <p>Your account is live. You've joined thousands of developers levelling up their skills through real challenges, courses, and 1v1 battles — completely free, forever.</p>
 
    <div class="xp-banner">
      <div class="xp-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      </div>
      <div>
        <div class="xp-title">+100 XP Bonus Unlocked</div>
        <div class="xp-sub">Your starting bonus has been added to your profile.</div>
      </div>
    </div>
 
    <div class="card-grid">
      <div class="stat-card">
        <div class="stat-val">139+</div>
        <div class="stat-lbl">Free Courses</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">1v1</div>
        <div class="stat-lbl">Live Battles</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">∞</div>
        <div class="stat-lbl">Daily Quests</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">#1</div>
        <div class="stat-lbl">Leaderboard Awaits</div>
      </div>
    </div>
 
    <div class="steps">
      <div class="step">
        <div class="step-num">01</div>
        <div class="step-text"><strong>Pick your first course</strong> — Browse 139+ free courses across Web, AI, DevOps, and more.</div>
      </div>
      <div class="step">
        <div class="step-num">02</div>
        <div class="step-text"><strong>Complete your first lesson</strong> — Earn XP, build your streak, and unlock new ranks.</div>
      </div>
      <div class="step">
        <div class="step-num">03</div>
        <div class="step-text"><strong>Join a 1v1 Battle</strong> — Challenge other developers in real-time coding duels.</div>
      </div>
      <div class="step">
        <div class="step-num">04</div>
        <div class="step-text"><strong>Claim Daily Quests</strong> — Complete objectives every day for bonus XP rewards.</div>
      </div>
    </div>
 
    <div class="btn-wrap">
      <a href="${clientUrl}/dashboard" class="btn">Start Learning Now →</a>
    </div>
 
    <div class="divider"></div>
 
    <div class="badge-row">
      <span class="badge">Level 1</span>
      <span class="badge green">+100 XP Bonus</span>
      <span class="badge amber">New Member</span>
    </div>
 
    <p style="font-size:13px;color:#94A3B8;margin:0">You're receiving this because you created an account at SkillForge. Questions? Reply to this email.</p>
  `);
 
  await send({
    to:      user.email,
    subject: `Welcome to SkillForge, ${user.username}! Your account is ready ⚡`,
    html,
  });
}
 
// ─── PASSWORD RESET ────────────────────────────────────────
async function sendPasswordReset(user, otp) {
  const html = base(`
    <h1>Reset Your <span>Password</span></h1>
    <p>We received a request to reset the password for <strong class="highlight">@${user.username}</strong>. Use the code below to proceed.</p>
 
    <div style="background:#F8FAFC;border:2px dashed #BFDBFE;border-radius:16px;padding:32px;text-align:center;margin:24px 0">
      <div style="font-size:11px;color:#94A3B8;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600">Your One-Time Code</div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:40px;font-weight:800;letter-spacing:12px;color:#2563EB">${otp}</div>
      <div style="font-size:12px;color:#94A3B8;margin-top:14px">Valid for 15 minutes · Do not share this code</div>
    </div>
 
    <p style="font-size:13px;color:#94A3B8">If you did not request this, please ignore this email. Your account is safe.</p>
  `);
 
  await send({
    to:      user.email,
    subject: '[SkillForge] Reset Your Password',
    html,
  });
}
 
// ─── STREAK REMINDER ───────────────────────────────────────
async function sendStreakReminder(user) {
  const clientUrl = process.env.CLIENT_URL || 'https://skillforge.dev';
  const html = base(`
    <h1>Your <span>${user.streak}-Day Streak</span> is at Risk 🔥</h1>
    <p>Hey <strong class="highlight">@${user.username}</strong>, your streak will expire in less than 24 hours. Complete one lesson to keep it alive!</p>
 
    <div class="stat-card" style="margin:20px 0;text-align:center">
      <div class="stat-val" style="color:#F97316">${user.streak} Days 🔥</div>
      <div class="stat-lbl">Current Streak — Don't lose it!</div>
    </div>
 
    <div class="btn-wrap">
      <a href="${clientUrl}/courses" class="btn" style="background:#F97316;box-shadow:0 4px 14px rgba(249,115,22,0.3)">Keep My Streak →</a>
    </div>
 
    <p style="font-size:13px;color:#94A3B8;text-align:center">Just one lesson is all it takes. You've got this!</p>
  `);
 
  await send({
    to:      user.email,
    subject: `⚠️ Your ${user.streak}-day streak expires in 24 hours`,
    html,
  });
}
 
// ─── WEEKLY SUMMARY ────────────────────────────────────────
async function sendWeeklySummary(user, stats) {
  const clientUrl = process.env.CLIENT_URL || 'https://skillforge.dev';
  const html = base(`
    <h1>Your <span>Weekly Report</span> 📊</h1>
    <p>Great work this week, <strong class="highlight">@${user.username}</strong>! Here's a summary of your progress.</p>
 
    <div class="card-grid">
      <div class="stat-card">
        <div class="stat-val">+${stats.xpEarned}</div>
        <div class="stat-lbl">XP Earned</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${stats.lessonsCompleted}</div>
        <div class="stat-lbl">Lessons Done</div>
      </div>
    </div>
 
    <div class="steps">
      <div class="step">
        <div class="step-num" style="background:#F0FDF4;border-color:#BBF7D0;color:#16A34A">📈</div>
        <div class="step-text"><strong>Daily Average:</strong> ${Math.round(stats.xpEarned / 7)} XP/day this week.</div>
      </div>
      <div class="step">
        <div class="step-num" style="background:#FFFBEB;border-color:#FDE68A;color:#D97706">⚡</div>
        <div class="step-text"><strong>Current Level:</strong> Level ${user.level} — keep grinding!</div>
      </div>
    </div>
 
    <div class="btn-wrap">
      <a href="${clientUrl}/dashboard" class="btn">View Full Dashboard →</a>
    </div>
  `);
 
  await send({
    to:      user.email,
    subject: `[SkillForge] Weekly Report: +${stats.xpEarned} XP this week!`,
    html,
  });
}
 
// ─── LEVEL UP NOTIFICATION ─────────────────────────────────
async function sendLevelUp(user, newLevel, levelName) {
  const clientUrl = process.env.CLIENT_URL || 'https://skillforge.dev';
  const html = base(`
    <h1>You reached <span>Level ${newLevel}!</span> 🏆</h1>
    <p>Amazing work, <strong class="highlight">@${user.username}</strong>! You've officially reached <strong>Level ${newLevel}: ${levelName}</strong>.</p>
 
    <div class="stat-card" style="margin:20px 0;text-align:center;background:linear-gradient(135deg,#EFF6FF,#F0FDF4);border-color:#BFDBFE">
      <div class="stat-val" style="color:#2563EB">Level ${newLevel}</div>
      <div class="stat-lbl">${levelName} · ${user.xp?.toLocaleString() || 0} Total XP</div>
    </div>
 
    <p>New challenges, battles, and content are unlocked at your tier. Keep pushing forward!</p>
 
    <div class="btn-wrap">
      <a href="${clientUrl}/profile" class="btn">View My Profile →</a>
    </div>
 
    <div class="badge-row">
      <span class="badge">Level ${newLevel}</span>
      <span class="badge green">${levelName}</span>
      <span class="badge amber">${user.xp?.toLocaleString() || 0} XP</span>
    </div>
  `);
 
  await send({
    to:      user.email,
    subject: `🎉 Level Up! You're now Level ${newLevel} on SkillForge`,
    html,
  });
}
 
module.exports = { sendWelcome, sendPasswordReset, sendStreakReminder, sendWeeklySummary, sendLevelUp };
