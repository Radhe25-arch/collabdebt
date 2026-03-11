import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { status, assigned_to, sprint_id, pr_url } = body

  const updates: Record<string, unknown> = {}
  if (status) updates.status = status
  if (assigned_to !== undefined) updates.assigned_to = assigned_to
  if (sprint_id !== undefined) updates.sprint_id = sprint_id
  if (pr_url !== undefined) updates.pr_url = pr_url
  if (status === 'fixed') updates.fixed_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('debt_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  // Only managers can delete
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'manager') {
    return NextResponse.json({ error: 'Only managers can delete debt items' }, { status: 403 })
  }

  const { error } = await supabase.from('debt_items').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ deleted: true })
}
