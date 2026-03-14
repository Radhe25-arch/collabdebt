import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { subject, title, content, patch_notes } = await req.json()

    // Send via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'CollabDebt <updates@resend.dev>',
        to: ['fleet-broadcast@collabdebt.com'], // Example distribution list
        subject: `[PATCH] ${subject || 'System Update Notification'}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>System Patch</title>
</head>
<body style="margin:0;padding:0;background-color:#020609;font-family:'JetBrains Mono',monospace;color:#94a3b8;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    
    <div style="display:flex;align-items:center;margin-bottom:32px;">
      <div style="padding:8px 16px;background:rgba(0,242,255,0.1);border:1px solid rgba(0,242,255,0.2);border-radius:4px;font-weight:900;color:#00f2ff;font-size:12px;text-transform:uppercase;letter-spacing:2px;">
        Update Log
      </div>
      <div style="margin-left:auto;font-size:11px;color:#475569;font-weight:800;text-transform:uppercase;">
        Cycle: ${new Date().toLocaleDateString()}
      </div>
    </div>

    <div style="background-color:#050b14;border:1px solid rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;padding:40px;border-left:4px solid #00f2ff;">
      <h1 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#ffffff;letter-spacing:-1px;">
        ${title || 'System Optimization Complete'}
      </h1>
      <p style="margin:0 0 32px;font-size:14px;color:#94a3b8;line-height:1.6;font-weight:500;">
        ${content || 'New stabilization protocols have been deployed to your command terminal. Review the patch notes below for architectural changes.'}
      </p>

      <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.05);padding:24px;border-radius:8px;">
        <div style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#475569;margin-bottom:16px;">Patch Notes v4.2.0:</div>
        <ul style="margin:0;padding:0 0 0 20px;color:#cbd5e1;font-size:13px;line-height:1.8;">
          ${(patch_notes || [
            'Enhanced anomaly detection latency by 42%',
            'Fixed critical race condition in auth uplink',
            'Implemented real-time ROI tracking on dashboard',
            'Neutralized UI jitter in mesh backgrounds'
          ]).map(note => `<li>${note}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-top:40px;text-align:center;">
        <a href="https://collabdebt.com/dashboard"
          style="display:inline-block;border:1px solid #00f2ff;color:#00f2ff;font-weight:900;font-size:12px;padding:14px 28px;border-radius:4px;text-decoration:none;text-transform:uppercase;letter-spacing:2px;">
          Access Terminal
        </a>
      </div>
    </div>

    <div style="text-align:center;margin-top:40px;">
      <p style="font-size:10px;color:#475569;margin:0;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
        End Transmission | CollabDebt Core
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
