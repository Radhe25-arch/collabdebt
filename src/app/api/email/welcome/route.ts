import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const firstName = name?.split(' ')[0] || 'there'

    // Send via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'CollabDebt <onboarding@resend.dev>',
        to: [email],
        subject: `Welcome to CollabDebt — you're in`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to CollabDebt</title>
</head>
<body style="margin:0;padding:0;background:#050a0f;font-family:'DM Sans',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:10px;">
        <div style="width:36px;height:36px;background:#00e5ff;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-family:monospace;font-weight:700;font-size:13px;color:#050a0f;">CD</div>
        <span style="font-size:20px;font-weight:700;color:#e2f0f9;letter-spacing:-0.5px;">CollabDebt</span>
      </div>
    </div>

    <!-- Card -->
    <div style="background:#0d1e2e;border:1px solid #1a3040;border-radius:16px;overflow:hidden;">

      <!-- Top accent -->
      <div style="height:3px;background:linear-gradient(90deg,#00e5ff,#7c3aed);"></div>

      <div style="padding:36px 32px;">
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#e2f0f9;">
          Hey ${firstName}, welcome to CollabDebt 👋
        </h1>
        <p style="margin:0 0 28px;font-size:15px;color:#6b8fa8;line-height:1.6;">
          Your account is set up. You're now part of a community of engineering teams that take technical debt seriously.
        </p>

        <!-- Steps -->
        <div style="margin-bottom:28px;">
          ${[
            ['01', '#00e5ff', 'Connect your repository', 'Link your GitHub, GitLab, or Bitbucket repo in under 60 seconds.'],
            ['02', '#00ff88', 'Run your first scan', 'Our AI scans every file and shows you the real cost of your debt.'],
            ['03', '#ffd600', 'Fix together', 'Collaborate in real-time. Track progress. Watch your score improve.'],
          ].map(([n, c, t, d]) => `
          <div style="display:flex;gap:14px;margin-bottom:18px;padding:14px 16px;background:rgba(255,255,255,0.02);border:1px solid #1a3040;border-radius:10px;border-left:3px solid ${c};">
            <div style="font-family:monospace;font-size:16px;font-weight:700;color:${c};min-width:24px;padding-top:2px;">${n}</div>
            <div>
              <div style="font-size:14px;font-weight:600;color:#e2f0f9;margin-bottom:3px;">${t}</div>
              <div style="font-size:13px;color:#6b8fa8;">${d}</div>
            </div>
          </div>`).join('')}
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin-bottom:24px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://collabdebt.com'}/dashboard"
            style="display:inline-block;background:#00e5ff;color:#050a0f;font-weight:700;font-size:15px;padding:14px 36px;border-radius:10px;text-decoration:none;">
            Open your dashboard →
          </a>
        </div>

        <!-- Plan info -->
        <div style="text-align:center;padding:14px;background:rgba(0,229,255,0.04);border:1px solid rgba(0,229,255,0.1);border-radius:10px;">
          <span style="font-size:13px;color:#6b8fa8;">Your plan: </span>
          <span style="font-size:13px;font-weight:600;color:#00e5ff;">Free</span>
          <span style="font-size:13px;color:#6b8fa8;"> · Upgrade anytime</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:28px;">
      <p style="font-size:12px;color:#3d6070;margin:0 0 8px;">
        Questions? <a href="https://support.collabdebt.com" style="color:#00e5ff;text-decoration:none;">support.collabdebt.com</a>
      </p>
      <p style="font-size:11px;color:#3d6070;margin:0;">
        © 2024 CollabDebt. You received this because you signed up at collabdebt.com.
      </p>
    </div>
  </div>
</body>
</html>`,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      // Don't fail the signup — email is non-critical
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Welcome email error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
