import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://collabdebt.com'}/auth/reset-password?token=${token}`

    // Send via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'CollabDebt <security@resend.dev>',
        to: [email],
        subject: `[AUTHORIZATION] Password Reset Request`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Authorization</title>
</head>
<body style="margin:0;padding:0;background-color:#020609;font-family:'JetBrains Mono',monospace;color:#94a3b8;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:40px;">
      <div style="display:inline-block;padding:12px 24px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:12px;">
        <span style="font-size:18px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;text-transform:uppercase;">Collab<span style="color:#ffd600;">Debt</span></span>
      </div>
      <div style="margin-top:12px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:4px;color:#475569;">Security Protocol Active</div>
    </div>

    <div style="background-color:#050b14;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;padding:40px;">
      <h1 style="margin:0 0 24px;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;text-transform:uppercase;">
        Reset Authorization
      </h1>
      <p style="margin:0 0 32px;font-size:14px;color:#94a3b8;line-height:1.6;font-weight:500;">
        A request has been initiated to modify the access credentials for your system terminal. If you did not authorize this, please ignore this transmission.
      </p>

      <div style="text-align:center;margin-bottom:32px;">
        <a href="${resetLink}"
          style="display:inline-block;background:#ffd600;color:#020609;font-weight:900;font-size:12px;padding:16px 32px;border-radius:8px;text-decoration:none;text-transform:uppercase;letter-spacing:2px;">
          Confirm Reset Protocol
        </a>
      </div>

      <div style="border-top:1px solid rgba(255,255,255,0.05);padding-top:24px;">
        <p style="font-size:11px;color:#475569;margin:0 0 8px;font-weight:700;text-transform:uppercase;">Verification Token:</p>
        <div style="padding:12px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:8px;font-size:10px;color:#64748b;word-break:break-all;">
          ${token}
        </div>
      </div>
    </div>

    <div style="text-align:center;margin-top:40px;">
      <p style="font-size:10px;color:#475569;margin:0;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
        CollabDebt Security Infrastructure &copy; 2024
      </p>
    </div>
  </div>
</body>
</html>`,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
