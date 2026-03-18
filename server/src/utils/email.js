const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST  || 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // Use SSL for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
});

async function send({ to, subject, html }) {
  if (!process.env.SMTP_USER) {
    logger.warn(`[EMAIL] SMTP not configured — skipping email to ${to}: ${subject}`);
    // In dev, we can log the HTML for verification
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
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#020205;font-family:'Inter',sans-serif;color:#F0EEF8;line-height:1.6}
    .wrap{max-width:600px;margin:40px auto;background:#0A0A0F;border:1px solid rgba(124,58,237,0.25);border-radius:24px;overflow:hidden;box-shadow:0 24px 48px rgba(0,0,0,0.5)}
    .topbar{height:6px;background:linear-gradient(90deg,#7C3AED,#A855F7,#2DD4BF)}
    .header{padding:40px 48px 32px;border-bottom:1px solid rgba(255,255,255,0.05)}
    .logo-row{display:flex;align-items:center;gap:12px;margin-bottom:8px}
    .logo-icon{width:36px;height:36px;background:linear-gradient(135deg,#7C3AED,#2DD4BF);border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(124,58,237,0.3)}
    .logo-text{font-size:20px;font-weight:800;letter-spacing:-0.03em;color:#FFFFFF}
    .header-cmd{font-family:'JetBrains Mono',monospace;font-size:11px;color:#5A5870;letter-spacing:0.04em}
    .body{padding:40px 48px}
    h1{font-size:28px;font-weight:800;margin-bottom:12px;color:#FFFFFF;letter-spacing:-0.02em}
    p{font-size:15px;color:#94A3B8;margin-bottom:20px}
    .highlight{color:#A855F7;font-weight:700}
    .teal{color:#2DD4BF;font-weight:600}
    .btn{display:inline-block;background:linear-gradient(135deg,#7C3AED,#A855F7);color:#FFFFFF!important;text-decoration:none;padding:16px 36px;border-radius:12px;font-size:15px;font-weight:700;letter-spacing:0.01em;margin:12px 0;box-shadow:0 10px 20px rgba(124,58,237,0.2)}
    .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0}
    .stat-card{background:#11111A;border:1px solid rgba(255,255,255,0.05);border-radius:16px;padding:20px;text-align:left}
    .stat-val{font-size:24px;font-weight:800;color:#FFFFFF;margin-bottom:4px}
    .stat-lbl{font-size:11px;color:#64748B;text-transform:uppercase;letter-spacing:0.1em}
    .terminal{background:#050508;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:20px 24px;margin:24px 0;font-family:'JetBrains Mono',monospace;font-size:12px}
    .terminal .prompt{color:#5A5870}
    .terminal .cmd{color:#A855F7}
    .terminal .out{color:#2DD4BF}
    .divider{height:1px;background:rgba(255,255,255,0.05);margin:32px 0}
    .footer{padding:24px 48px;background:#050508;border-top:1px solid rgba(255,255,255,0.05);display:flex;justify-content:space-between;align-items:center}
    .footer-text{font-size:11px;color:#475569}
    .footer-link{font-size:11px;color:#7C3AED;text-decoration:none;font-weight:600}
    .badge-wrap{display:flex;gap:8px;margin:16px 0}
    .badge{background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.2);border-radius:8px;padding:6px 14px;font-size:11px;font-weight:600;color:#A855F7}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="topbar"></div>
    <div class="header">
      <div class="logo-row">
        <div class="logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
        </div>
        <span class="logo-text">SkillForge</span>
      </div>
      <div class="header-cmd">system.broadcast://welcome_new_architect</div>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <span class="footer-text">© 2026 SkillForge — Master the Machine.</span>
      <a href="${process.env.CLIENT_URL || 'https://skillforge.dev'}" class="footer-link">skillforge.dev</a>
    </div>
  </div>
</body>
</html>`;
}

// ─── WELCOME EMAIL ─────────────────────────────────────────
async function sendWelcome(user) {
  const html = base(`
    <h1>Welcome to the Forge, <span class="highlight">${user.username}</span></h1>
    <p>Your workspace is initialized. You've joined a global network of architects building the future of software, one commit at a time.</p>

    <div class="terminal">
      <div><span class="prompt">$ </span><span class="cmd">skillforge</span> <span class="out">user --activate</span></div>
      <div style="margin-top:10px;color:#5A5870">✓ Network identity: <span style="color:#FFFFFF">@${user.username}</span></div>
      <div style="color:#5A5870">✓ Architect Tier: <span style="color:#A855F7">Candidate</span></div>
      <div style="color:#5A5870">✓ Resource Access: <span style="color:#2DD4BF">UNLOCKED</span></div>
      <div style="color:#5A5870">✓ Initial Bonus: <span style="color:#2DD4BF">+100 XP provisioned</span></div>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-val">102</div>
        <div class="stat-lbl">Domain Clusters</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">∞</div>
        <div class="stat-lbl">Intellect Capacity</div>
      </div>
    </div>

    <p>Your journey begins with these tactical objectives:</p>

    <div style="margin:20px 0;background:rgba(255,255,255,0.02);border-radius:12px;padding:24px;border:1px solid rgba(255,255,255,0.04)">
      <div style="display:flex;gap:12px;margin-bottom:16px">
        <div style="color:#A855F7;font-weight:800;font-family:'JetBrains Mono',monospace">01</div>
        <div style="font-size:14px;color:#FFFFFF"><strong>Claim your path</strong> — Select a language or architecture domain library.</div>
      </div>
      <div style="display:flex;gap:12px;margin-bottom:16px">
        <div style="color:#A855F7;font-weight:800;font-family:'JetBrains Mono',monospace">02</div>
        <div style="font-size:14px;color:#FFFFFF"><strong>Deploy code</strong> — Complete your first lesson to solidify your streak.</div>
      </div>
      <div style="display:flex;gap:12px">
        <div style="color:#A855F7;font-weight:800;font-family:'JetBrains Mono',monospace">03</div>
        <div style="font-size:14px;color:#FFFFFF"><strong>Consult the Mentor</strong> — Sync with the Lead Architect for code reviews.</div>
      </div>
    </div>

    <div style="text-align:center;margin-top:32px">
      <a href="${process.env.CLIENT_URL || 'https://skillforge.dev'}/dashboard" class="btn">Enter the Core Library →</a>
    </div>

    <div class="divider"></div>
    <div class="badge-wrap">
      <span class="badge">Level 1</span>
      <span class="badge">New Architect</span>
      <span class="badge">+100 XP Bonus</span>
    </div>
    <p style="font-size:12px;color:#475569;margin-top:20px">You are receiving this encrypted transmission because of your registration at SkillForge.</p>
  `);

  await send({
    to:      user.email,
    subject: `[SkillForge] Workspace Initialized — Welcome, ${user.username}!`,
    html,
  });
}

// ─── PASSWORD RESET ────────────────────────────────────────
async function sendPasswordReset(user, otp) {
  const html = base(`
    <h1>Security Override</h1>
    <p>A password reset request was initiated for your profile: <span class="highlight">@${user.username}</span>.</p>

    <div style="background:#050508;border:1px dashed rgba(45,212,191,0.3);border-radius:16px;padding:32px;text-align:center;margin:28px 0">
      <div style="font-size:11px;color:#64748B;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.12em">One-Time Verification Code</div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:42px;font-weight:800;letter-spacing:10px;color:#2DD4BF">${otp}</div>
      <div style="font-size:12px;color:#475569;margin-top:12px">Valid for 15 minutes · Non-transferable</div>
    </div>

    <div class="terminal">
      <div><span class="prompt">$ </span><span class="cmd">skillforge</span> auth --reset --otp=<span class="out">${otp}</span></div>
    </div>

    <p>If you did not request this, please secure your account immediately.</p>
  `);

  await send({
    to:      user.email,
    subject: '[SkillForge] Reset Your Security Credentials',
    html,
  });
}

// ─── STREAK REMINDER ───────────────────────────────────────
async function sendStreakReminder(user) {
  const html = base(`
    <h1>Critical Performance Alert</h1>
    <p>Your training continuity is at risk. Your <span class="highlight">${user.streak}-day streak</span> will expire in less than 24 hours.</p>

    <div class="terminal">
      <div><span class="prompt">$ </span><span class="cmd">skillforge</span> <span class="out">streak --status</span></div>
      <div style="margin-top:10px;color:#5A5870">Current continuity: <span style="color:#F97316">${user.streak} days 🔥</span></div>
      <div style="color:#F87171">STATUS: DEGRADING</div>
      <div style="color:#5A5870">Required Action: <span style="color:#FFFFFF">Deploy 1 lesson module</span></div>
    </div>

    <p>Consistency is the difference between a coder and an architect. Don't let the fire go out.</p>

    <div style="text-align:center">
      <a href="${process.env.CLIENT_URL || 'https://skillforge.dev'}/dashboard" class="btn">Maintain Continuity →</a>
    </div>
  `);

  await send({
    to:      user.email,
    subject: `[SkillForge] Critical: Your ${user.streak}-day streak is at risk`,
    html,
  });
}

// ─── WEEKLY SUMMARY ────────────────────────────────────────
async function sendWeeklySummary(user, stats) {
  const html = base(`
    <h1>Sector Performance Report</h1>
    <p>Weekly intelligence summary for architect <span class="highlight">@${user.username}</span>.</p>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-val">+${stats.xpEarned}</div>
        <div class="stat-lbl">XP Gain</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${stats.lessonsCompleted}</div>
        <div class="stat-lbl">Modules Done</div>
      </div>
    </div>

    <div class="terminal">
      <div><span class="prompt">$ </span><span class="cmd">skillforge</span> <span class="out">analytics --user=@${user.username}</span></div>
      <div style="margin-top:10px;color:#5A5870">velocity: <span style="color:#A855F7">+${Math.round(stats.xpEarned/7)} XP/day</span></div>
      <div style="color:#5A5870">rank_shift: <span style="color:#2DD4BF">STABLE</span></div>
      <div style="color:#5A5870">current_tier: <span style="color:#FFFFFF">Level ${user.level}</span></div>
    </div>

    <p>Elite tournaments are provisioning for the next cycle. Ensure your hardware is ready.</p>

    <div style="text-align:center;margin-top:24px">
      <a href="${process.env.CLIENT_URL || 'https://skillforge.dev'}/dashboard" class="btn">Return to Task Board →</a>
    </div>
  `);

  await send({
    to:      user.email,
    subject: `[SkillForge] Weekly Report: +${stats.xpEarned} XP Provisioned`,
    html,
  });
}

// ─── LEVEL UP NOTIFICATION ─────────────────────────────────
async function sendLevelUp(user, newLevel, levelName) {
  const html = base(`
    <h1>Tier Promotion: <span class="teal">${levelName}</span></h1>
    <p>Excellent work, <span class="highlight">${user.username}</span>. You've officially achieved <span class="teal">Level ${newLevel}: ${levelName}</span>.</p>

    <div class="terminal">
      <div><span class="prompt">$ </span><span class="cmd">skillforge</span> <span class="out">promote --achieved</span></div>
      <div style="margin-top:10px;color:#5A5870">previous_tier: <span style="color:#5A5870">Level ${newLevel - 1}</span></div>
      <div style="color:#5A5870">current_tier:  <span style="color:#2DD4BF">Level ${newLevel} — ${levelName}</span></div>
      <div style="color:#5A5870">network_xp: <span style="color:#A855F7">${user.xp.toLocaleString()} total</span></div>
    </div>

    <p>New architectural patterns and advanced modules have been unlocked for your tier.</p>

    <div style="text-align:center;margin-top:24px">
      <a href="${process.env.CLIENT_URL || 'https://skillforge.dev'}/profile" class="btn">View Identity Hub →</a>
    </div>
  `);

  await send({
    to:      user.email,
    subject: `[SkillForge] Promotion: You reached Level ${newLevel}!`,
    html,
  });
}

module.exports = { sendWelcome, sendPasswordReset, sendStreakReminder, sendWeeklySummary, sendLevelUp };
