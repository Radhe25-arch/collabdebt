require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
});

async function test() {
  console.log('Testing SMTP with:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: Number(process.env.SMTP_PORT) === 465,
    user: process.env.SMTP_USER,
    from: process.env.EMAIL_FROM
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'your-email@example.com', // Replace with a test email or leave as is to see error
      subject: 'SkillForge SMTP Test',
      text: 'If you see this, SMTP is working.',
    });
    console.log('✅ Email sent:', info.messageId);
  } catch (err) {
    console.error('❌ Email failed:', err.message);
    if (err.stack) console.error(err.stack);
  }
}

test();
