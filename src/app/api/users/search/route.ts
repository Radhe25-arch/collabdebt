import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim()
    if (!q || q.length < 2) return NextResponse.json({ users: [] })

    // Search by name, username, or CD# code
    const { data, error } = await supabase
      .from('users')
      .select('id, name, username, user_code, avatar_url, bio, role, plan')
      .or(`name.ilike.%${q}%,username.ilike.%${q}%,user_code.ilike.%${q}%`)
      .neq('id', user.id) // exclude self
      .limit(10)

    if (error) throw error
    return NextResponse.json({ users: data || [] })
  } catch (err) {
    console.error('User search error:', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
