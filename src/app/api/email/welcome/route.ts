import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const firstName = name?.split(' ')[0] || 'Entity'

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
        subject: `[AUTHENTICATION] Welcome to CollabDebt System`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to CollabDebt</title>
</head>
<body style="margin:0;padding:0;background-color:#020609;font-family:'DM Sans',Arial,sans-serif;color:#94a3b8;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- Header / Branding -->
    <div style="text-align:center;margin-bottom:40px;">
      <div style="display:inline-block;padding:12px 24px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:20px;">
        <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-1px;text-transform:uppercase;">Collab<span style="color:#00f2ff;">Debt</span></span>
      </div>
      <div style="margin-top:12px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:4px;color:#475569;">System Interface Active</div>
    </div>

    <!-- Main Content Card -->
    <div style="background-color:#050b14;border:1px solid rgba(255,255,255,0.08);border-radius:32px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.5);">
      
      <!-- Holographic Accent -->
      <div style="height:4px;background:linear-gradient(90deg, #00f2ff, #7c3aed, #00f2ff);background-size:200% auto;"></div>

      <div style="padding:48px 40px;">
        <h1 style="margin:0 0 16px;font-size:28px;font-weight:900;color:#ffffff;line-height:1.1;letter-spacing:-1px;">
          Welcome to the <span style="color:#00f2ff;">Fleet</span>, ${firstName}.
        </h1>
        <p style="margin:0 0-32px;font-size:16px;color:#94a3b8;line-height:1.6;font-weight:500;">
          Your command terminal is now established. Prepare to neutralize technical anomalies and stabilize your codebase architecture.
        </p>

        <div style="margin:40px 0;">
          <div style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#475569;margin-bottom:20px;">Deployment Protocols:</div>
          
          ${[
            ['01', '#00f2ff', 'Sync Core Repos', 'Enlist your GitHub or GitLab repositories into the system grid.'],
            ['02', '#ffd600', 'Anomaly Scan', 'Initiate high-fidelity analysis to calculate real-world debt gravity.'],
            ['03', '#00ff88', 'Fleet Collaboration', 'Assign fixed cycles and track stabilization in real-time.'],
          ].map(([n, c, t, d]) => `
          <div style="display:flex;margin-bottom:20px;padding:20px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:16px;">
            <div style="margin-right:20px;">
               <div style="width:32px;height:32px;background:${c}10;border:1px solid ${c}30;border-radius:8px;color:${c};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;font-family:monospace;">${n}</div>
            </div>
            <div>
              <div style="font-size:15px;font-weight:800;color:#ffffff;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">${t}</div>
              <div style="font-size:13px;color:#64748b;font-weight:500;">${d}</div>
            </div>
          </div>`).join('')}
        </div>

        <!-- Action Button -->
        <div style="text-align:center;margin-bottom:32px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://collabdebt.com'}/dashboard"
            style="display:inline-block;background:#00f2ff;color:#020609;font-weight:900;font-size:14px;padding:18px 48px;border-radius:18px;text-decoration:none;text-transform:uppercase;letter-spacing:2px;box-shadow:0 10px 30px rgba(0,242,255,0.2);">
            Initialize Terminal
          </a>
        </div>

        <!-- Status Indicator -->
        <div style="border-top:1px solid rgba(255,255,255,0.05);padding-top:24px;text-align:center;">
          <div style="display:inline-flex;align-items:center;padding:6px 16px;background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.1);border-radius:100px;">
            <div style="width:6px;height:6px;background:#00ff88;border-radius:50%;margin-right:8px;box-shadow:0 0 8px #00ff88;"></div>
            <span style="font-size:11px;font-weight:800;color:#00ff88;text-transform:uppercase;letter-spacing:1px;">Fleet Status: Operational</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Information -->
    <div style="text-align:center;margin-top:40px;">
      <p style="font-size:11px;color:#475569;margin:0 0 12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
        Secure Link Transmission &copy; 2024 CollabDebt
      </p>
      <div style="display:flex;justify-content:center;gap:20px;">
        <a href="#" style="color:#00f2ff;text-decoration:none;font-size:11px;font-weight:700;text-transform:uppercase;">Protocol Settings</a>
        <a href="#" style="color:#64748b;text-decoration:none;font-size:11px;font-weight:700;text-transform:uppercase;">Encrypted Support</a>
      </div>
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
