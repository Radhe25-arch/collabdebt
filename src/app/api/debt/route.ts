import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/debt — list debt items with filters
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const repoId = searchParams.get('repoId')
  const status = searchParams.get('status')
  const severity = searchParams.get('severity')

  let query = supabase
    .from('debt_items')
    .select('*, repos!inner(workspace_id)')
    .order('created_at', { ascending: false })

  if (repoId) query = query.eq('repo_id', repoId)
  if (status) query = query.eq('status', status)
  if (severity) query = query.eq('severity', severity)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}

// POST /api/debt — create debt item manually
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, file_path, severity, description, cost_usd, repo_id } = body

  if (!title || !file_path || !severity || !repo_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('debt_items')
    .insert({
      title,
      file_path,
      severity,
      description: description || '',
      cost_usd: cost_usd || 0,
      repo_id,
      status: 'identified',
      type: 'todo',
      line_start: 1,
      line_end: 1,
      fix_days: 1,
      votes: 0,
      created_by: 'manual',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data }, { status: 201 })
}
