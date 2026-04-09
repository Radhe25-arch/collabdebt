const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const DEFAULT_FROM = process.env.EMAIL_FROM || 'SkillForge <onboarding@resend.dev>';

const industrialDarkTemplate = (content, title = 'SYSTEM NOTIFICATION') => `
<div style="background-color: #000000; color: #FFFFFF; font-family: 'Courier New', Courier, monospace; padding: 40px; border: 1px solid #333 text-align: left;">
  <div style="border-bottom: 2px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px;">
    <h1 style="font-size: 24px; font-weight: 900; letter-spacing: 5px; margin: 0; color: #FFFFFF;">SKILLFORGE // ${title}</h1>
  </div>
  
  <div style="font-size: 14px; line-height: 1.6; color: #AAAAAA;">
    ${content}
  </div>

  <div style="margin-top: 40px; border-top: 1px solid #1A1A1A; padding-top: 20px; font-size: 10px; color: #444444;">
    © 2026 SKILLFORGE OPERATIONS // ALL RIGHTS RESERVED<br/>
    ENCRYPTION: AES-256-GCM VERIFIED
  </div>
</div>
`;

async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: DEFAULT_FROM,
      to,
      subject,
      html,
    });
    console.log(`[MAIL] Successfully sent to ${to}: ${subject}`);
  } catch (error) {
    console.error(`[MAIL] Failed to send to ${to}:`, error.message);
  }
}

async function sendSignUpWelcome(user) {
  const content = `
    <p>OPERATIVE <span style="color: #3B82F6;">${user.username}</span> INITIALIZED.</p>
    <p>Welcome to the SkillForge Elite Platform. Your neural link is now active. Access the catalog to begin your ascension.</p>
    <div style="margin-top: 30px;">
      <a href="${process.env.CLIENT_URL}/dashboard" style="background-color: #3B82F6; color: #FFFFFF; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px;">INITIALIZE DASHBOARD</a>
    </div>
  `;
  await sendEmail(user.email, 'SKILLFORGE // ACCOUNT_INITIALIZED', industrialDarkTemplate(content, 'WELCOME OPERATIVE'));
}

async function sendCourseEnrollment(user, course) {
  const content = `
    <p>ENROLLMENT SUCCESSFUL.</p>
    <p>Target: <span style="color: #3B82F6;">${course.title}</span></p>
    <p>Status: ARCHIVING DATA...</p>
    <p>Recommended Action: Commencing FOUNDATION module immediately.</p>
  `;
  await sendEmail(user.email, `SKILLFORGE // MODULE_DEPLOYED: ${course.title}`, industrialDarkTemplate(content, 'ENROLLMENT CONFIRMED'));
}

async function sendCourseCompletionReport(user, course, xpAwarded) {
  const content = `
    <h2 style="color: #10B981;">MODULE COMPLETED: ${course.title}</h2>
    <div style="background-color: #050505; border: 1px solid #111; padding: 20px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 5px 0;">XP AWARDED: <span style="color: #F59E0B;">+${xpAwarded} UNITS</span></p>
      <p style="margin: 5px 0;">TOTAL ACCRUED: <span style="color: #3B82F6;">${user.xp} UNITS</span></p>
      <p style="margin: 5px 0;">SYSTEM RANK: LV ${user.level || 1}</p>
    </div>
    <p>Report card generated. All skills archived successfully. Ready for next tactical deployment.</p>
  `;
  await sendEmail(user.email, `SKILLFORGE // REPORT_CARD: ${course.title}`, industrialDarkTemplate(content, 'MODULE_ARCHIVED'));
}

module.exports = {
  sendSignUpWelcome,
  sendCourseEnrollment,
  sendCourseCompletionReport
};
