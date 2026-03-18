const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST  || 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
});

async function send({ to, subject, html }) {
  if (!process.env.SMTP_USER) {
    logger.warn(`[EMAIL] SMTP not configured — skipping email to ${to}: ${subject}`);
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

// ─── BASE TEMPLATE ─────────────────────────────────────────
function base(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#0A0A0F;font-family:'JetBrains Mono',monospace;color:#F0EEF8}
    .wrap{max-width:580px;margin:40px auto;background:#111118;border:1px solid rgba(124,58,237,0.3);border-radius:16px;overflow:hidden}
    .topbar{height:4px;background:linear-gradient(90deg,#7C3AED,#9D65F5,#00D9B5)}
    .header{padding:28px 36px 24px;border-bottom:1px solid rgba(124,58,237,0.15)}
    .logo-row{display:flex;align-items:center;gap:10px;margin-bottom:6px}
    .logo-icon{width:32px;height:32px;background:linear-gradient(135deg,#7C3AED,#00D9B5);border-radius:8px;display:flex;align-items:center;justify-content:center}
    .logo-text{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;background:linear-gradient(135deg,#9D65F5,#00D9B5);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .header-cmd{font-size:11px;color:#5A5870;letter-spacing:0.08em}
    .body{padding:32px 36px}
    h1{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;margin-bottom:8px;color:#F0EEF8}
    p{font-size:13px;line-height:1.8;color:#9896AA;margin-bottom:16px}
    .highlight{color:#9D65F5;font-weight:600}
    .teal{color:#00D9B5}
    .code-line{font-size:12px;color:#5A5870;margin-bottom:4px}
    .code-line .kw{color:#9D65F5}
    .code-line .str{color:#00D9B5}
    .code-line .fn{color:#F0EEF8}
    .btn{display:inline-block;background:linear-gradient(135deg,#7C3AED,#9D65F5);color:#fff!important;text-decoration:none;padding:14px 32px;border-radius:10px;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;letter-spacing:0.04em;margin:8px 0}
    .btn-outline{display:inline-block;border:1px solid rgba(124,58,237,0.4);color:#9D65F5!important;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:12px}
    .stat-row{display:flex;gap:12px;margin:20px 0}
    .stat{flex:1;background:#16161F;border:1px solid rgba(124,58,237,0.15);border-radius:10px;padding:16px;text-align:center}
    .stat-val{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;background:linear-gradient(135deg,#9D65F5,#00D9B5);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .stat-lbl{font-size:10px;color:#5A5870;text-transform:uppercase;letter-spacing:0.1em;margin-top:4px}
    .divider{height:1px;background:rgba(124,58,237,0.12);margin:24px 0}
    .otp-box{background:#16161F;border:1px dashed rgba(0,217,181,0.4);border-radius:10px;padding:24px;text-align:center;margin:20px 0}
    .otp-num{font-family:'Syne',sans-serif;font-size:36px;font-weight:800;letter-spacing:12px;color:#00D9B5}
    .otp-exp{font-size:11px;color:#5A5870;margin-top:8px}
    .badge-row{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}
    .badge{background:rgba(124,58,237,0.12);border:1px solid rgba(124,58,237,0.25);border-radius:100px;padding:4px 12px;font-size:11px;color:#9D65F5}
    .xp-bar-wrap{background:#16161F;border-radius:100px;height:8px;margin:12px 0;overflow:hidden}
    .xp-bar{height:100%;background:linear-gradient(90deg,#7C3AED,#00D9B5);border-radius:100px}
    .footer{padding:20px 36px;border-top:1px solid rgba(124,58,237,0.1);display:flex;justify-content:space-between;align-items:center}
    .footer-text{font-size:11px;color:#5A5870}
    .footer-link{font-size:11px;color:#7C3AED;text-decoration:none}
    .terminal{background:#0A0A0F;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:16px 20px;margin:16px 0;font-size:12px}
    .terminal .prompt{color:#5A5870}
    .terminal .cmd{color:#9D65F5}
    .terminal .out{color:#00D9B5}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="topbar"></div>
    <div class="header">
      <div class="logo-row">
        <div class="logo-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
        </div>
        <span class="logo-text">CodeArena</span>
      </div>
      <div class="header-cmd">// system.notification &gt; user.inbox</div>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <span class="footer-text">© CodeArena — Free. Forever.</span>
      <a href="${process.env.CLIENT_URL || 'https://codearena.dev'}" class="footer-link">codearena.dev</a>
    </div>
  </div>
</body>
</html>`;
}

// ─── WELCOME EMAIL ─────────────────────────────────────────
async function sendWelcome(user) {
  const html = base(`
    <h1>Welcome to the Arena, <span class="highlight">${user.username}</span></h1>
    <p>Your account is live. You just joined <span class="teal">48,291 developers</span> who are learning, competing, and leveling up — for free, forever.</p>

    <div class="terminal">
      <div><span class="prompt">$ </span><span class="cmd">arena</span> <span class="out">new-user --init</span></div>
      <div style="margin-top:8px;color:#5A5870">✓ Profile created: <span style="color:#F0EEF8">@${user.username}</span></div>
      <div style="color:#5A5870">✓ Level: <span style="color:#9D65F5">1 — Beginner</span></div>
      <div style="color:#5A5870">✓ XP awarded: <span style="color:#00D9B5">+100 welcome bonus</span></div>
      <div style="color:#5A5870">✓ Status: <span style="color:#00D9B5">READY TO COMPETE</span></div>
    </div>

    <div class="stat-row">
      <div class="stat"><div class="stat-val">127</div><div class="stat-lbl">Free Courses</div></div>
      <div class="stat"><div class="stat-val">∞</div><div class="stat-lbl">No Paywall</div></div>
      <div class="stat"><div class="stat-val">10</div><div class="stat-lbl">Levels</div></div>
    </div>

    <p>Here's how to hit the ground running:</p>

    <div style="margin:16px 0">
      <div class="code-line"><span class="kw">01.</span> <span class="fn">Pick a course</span> — <span class="str">Web Dev, DSA, Python, React</span></div>
      <div class="code-line"><span class="kw">02.</span> <span class="fn">Complete daily quests</span> — <span class="str">earn XP every day</span></div>
      <div class="code-line"><span class="kw">03.</span> <span class="fn">Join this week's tournament</span> — <span class="str">free entry, real glory</span></div>
      <div class="code-line"><span class="kw">04.</span> <span class="fn">Challenge someone</span> — <span class="str">1v1 battle, full report card</span></div>
    </div>

    <div class="xp-bar-wrap"><div class="xp-bar" style="width:2%"></div></div>
    <p style="font-size:11px;color:#5A5870">Your XP: 100 / 500 to reach Apprentice</p>

    <a href="${process.env.CLIENT_URL || 'https://codearena.dev'}/dashboard" class="btn">Enter the Arena →</a>

    <div class="divider"></div>
    <div class="badge-row">
      <span class="badge">Beginner</span>
      <span class="badge">Level 1</span>
      <span class="badge">+100 XP</span>
    </div>
    <p style="font-size:11px;color:#5A5870">You're receiving this because you signed up at CodeArena. No spam, ever.</p>
  `);

  await send({
    to:      user.email,
    subject: '[CodeArena] Welcome to the Arena — You\'re In!',
    html,
  });
}

// ─── PASSWORD RESET ────────────────────────────────────────
async function sendPasswordReset(user, otp) {
  const html = base(`
    <h1>Password Reset</h1>
    <p>Someone requested a password reset for <span class="highlight">@${user.username}</span>. If that wasn't you, ignore this.</p>

    <div class="otp-box">
      <div style="font-size:11px;color:#5A5870;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.1em">Your one-time code</div>
      <div class="otp-num">${otp}</div>
      <div class="otp-exp">Expires in 15 minutes · Single use only</div>
    </div>

    <div class="terminal">
      <div><span class="prompt">$ </span><span class="cmd">arena</span> reset-password --otp=<span class="out">${otp}</span></div>
    </div>

    <p>Enter this code on the password reset page. Do not share it with anyone.</p>
  `);

  await send({
    to:      user.email,
    subject: '[CodeArena] Password Reset Code',
    html,
  });
}

// ─── STREAK REMINDER ───────────────────────────────────────
async function sendStreakReminder(user) {
  const html = base(`
    <h1>Your streak is at risk 🔥</h1>
    <p>You have a <span class="highlight">${user.streak}-day learning streak</span>. Don't let it break today.</p>

    <div class="terminal">
      <div><span class="prompt">$ </span><span class="cmd">arena</span> <span class="out">streak --status</span></div>
      <div style="margin-top:8px;color:#5A5870">Current streak: <span style="color:#f97316">${user.streak} days 🔥</span></div>
      <div style="color:#f87171">WARNING: No activity detected today</div>
      <div style="color:#5A5870">Action required: <span style="color:#F0EEF8">complete 1 lesson</span></div>
    </div>

    <p>Complete just one lesson today — it takes under 10 minutes — and your streak stays alive.</p>

    <a href="${process.env.CLIENT_URL || 'https://codearena.dev'}/courses" class="btn">Keep My Streak →</a>
  `);

  await send({
    to:      user.email,
    subject: `[CodeArena] Your ${user.streak}-day streak expires today`,
    html,
  });
}

// ─── WEEKLY SUMMARY ────────────────────────────────────────
async function sendWeeklySummary(user, stats) {
  const html = base(`
    <h1>Your Week in Review</h1>
    <p>Here's what <span class="highlight">@${user.username}</span> accomplished this week on CodeArena:</p>

    <div class="stat-row">
      <div class="stat"><div class="stat-val">+${stats.xpEarned}</div><div class="stat-lbl">XP Earned</div></div>
      <div class="stat"><div class="stat-val">${stats.lessonsCompleted}</div><div class="stat-lbl">Lessons</div></div>
      <div class="stat"><div class="stat-val">Lv${user.level}</div><div class="stat-lbl">Level</div></div>
    </div>

    <div class="terminal">
      <div><span class="prompt">$ </span><span class="cmd">arena</span> <span class="out">weekly-report --user=${user.username}</span></div>
      <div style="margin-top:8px;color:#5A5870">xp_this_week: <span style="color:#9D65F5">+${stats.xpEarned}</span></div>
      <div style="color:#5A5870">lessons_done: <span style="color:#00D9B5">${stats.lessonsCompleted}</span></div>
      <div style="color:#5A5870">current_level: <span style="color:#F0EEF8">${user.level}</span></div>
      <div style="color:#5A5870">streak: <span style="color:#f97316">${user.streak} days 🔥</span></div>
    </div>

    <p>New tournament starts Monday. Free entry, bonus XP for top finishers.</p>

    <a href="${process.env.CLIENT_URL || 'https://codearena.dev'}/dashboard" class="btn">Back to Arena →</a>
    &nbsp;
    <a href="${process.env.CLIENT_URL || 'https://codearena.dev'}/tournaments" class="btn-outline">View Tournament</a>
  `);

  await send({
    to:      user.email,
    subject: `[CodeArena] Your week: +${stats.xpEarned} XP earned`,
    html,
  });
}

// ─── LEVEL UP NOTIFICATION ─────────────────────────────────
async function sendLevelUp(user, newLevel, levelName) {
  const html = base(`
    <h1>Level Up! <span class="teal">${levelName}</span></h1>
    <p>Congratulations <span class="highlight">@${user.username}</span> — you just reached <span class="teal">Level ${newLevel}: ${levelName}</span>!</p>

    <div class="terminal">
      <div><span class="prompt">$ </span><span class="cmd">arena</span> <span class="out">level-up --achieved</span></div>
      <div style="margin-top:8px;color:#5A5870">previous: <span style="color:#5A5870">Level ${newLevel - 1}</span></div>
      <div style="color:#5A5870">current:  <span style="color:#00D9B5">Level ${newLevel} — ${levelName}</span></div>
      <div style="color:#5A5870">total_xp: <span style="color:#9D65F5">${user.xp.toLocaleString()} XP</span></div>
    </div>

    <p>Keep going — the leaderboard is watching.</p>

    <a href="${process.env.CLIENT_URL || 'https://codearena.dev'}/profile" class="btn">View Your Profile →</a>
  `);

  await send({
    to:      user.email,
    subject: `[CodeArena] You reached Level ${newLevel}: ${levelName}!`,
    html,
  });
}

module.exports = { sendWelcome, sendPasswordReset, sendStreakReminder, sendWeeklySummary, sendLevelUp };
