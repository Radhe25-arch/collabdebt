import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// POST /api/collab/create
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { workspace_id, repo_id, file_path } = await req.json()

  // Generate a short unique token
  const token = crypto.randomBytes(6).toString('hex') // e.g. "a3f9b2c1d4e5"

  const { data, error } = await supabase
    .from('collab_sessions')
    .insert({
      token,
      host_id: user.id,
      workspace_id,
      repo_id: repo_id || null,
      file_path: file_path || 'untitled.ts',
      active: true,
      participants: [user.id],
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/collab/${token}`

  return NextResponse.json({ data: { ...data, url } }, { status: 201 })
}
