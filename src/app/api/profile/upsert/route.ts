import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { name, username, bio } = body

    const { error } = await supabase.from('users').upsert({
      id: user.id,
      email: user.email!,
      name: name || user.email!.split('@')[0],
      username: username || null,
      bio: bio || null,
    }, { onConflict: 'id' })

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Profile upsert error:', err)
    return NextResponse.json({ error: 'Failed to upsert profile' }, { status: 500 })
  }
}
