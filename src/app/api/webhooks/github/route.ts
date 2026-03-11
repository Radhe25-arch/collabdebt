import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/server'

function verifySignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature) return false
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-hub-signature-256')
  const event = req.headers.get('x-github-event')

  // Verify webhook signature
  if (!verifySignature(rawBody, signature, process.env.GITHUB_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const supabase = await createAdminClient()

  if (event === 'push') {
    // Queue async scan job — non-blocking
    const repoFullName = payload.repository?.full_name
    const changedFiles = payload.commits?.flatMap((c: { modified: string[]; added: string[] }) => [...c.modified, ...c.added]) ?? []

    // Trigger scan (in production: add to job queue like BullMQ or Inngest)
    // For now: fire and forget
    triggerScan(repoFullName, changedFiles, supabase).catch(console.error)

    return NextResponse.json({ queued: true })
  }

  if (event === 'pull_request') {
    const action = payload.action
    if (action === 'opened' || action === 'synchronize') {
      const prNumber = payload.pull_request?.number
      const repoFullName = payload.repository?.full_name
      // In production: scan PR diff + post comment
      console.log(`PR #${prNumber} in ${repoFullName} — scan queued`)
    }
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ignored: true })
}

async function triggerScan(repoFullName: string, files: string[], supabase: ReturnType<typeof createAdminClient> extends Promise<infer T> ? T : never) {
  // 1. Find repo in DB
  const { data: repo } = await supabase
    .from('repos')
    .select('*')
    .eq('full_name', repoFullName)
    .single()

  if (!repo) return

  // 2. In production: run tree-sitter + semgrep + Claude analysis
  // 3. Save results to debt_items
  // 4. Update repo health_score
  // 5. Trigger Supabase Realtime notification

  console.log(`Scan triggered for ${repoFullName}, ${files.length} files changed`)
}
