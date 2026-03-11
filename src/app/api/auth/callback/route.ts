import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const userData = data.user
      const meta = userData.user_metadata || {}

      // Check if this user already existed BEFORE upserting
      const { count: existingCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('id', userData.id)

      const isNewUser = (existingCount ?? 0) === 0

      // Upsert profile
      await supabase.from('users').upsert(
        {
          id: userData.id,
          email: userData.email!,
          name:
            meta.name ||
            meta.full_name ||
            userData.email!.split('@')[0],
          username: meta.preferred_username || meta.username || null,
          avatar_url: meta.avatar_url || meta.picture || null,
        },
        { onConflict: 'id', ignoreDuplicates: true }
      )

      // Send welcome email only on first login
      if (isNewUser) {
        await fetch(`${origin}/api/email/welcome`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: meta.name || meta.full_name,
            email: userData.email,
          }),
        })
      }

      // Redirect to onboarding for new OAuth users, dashboard for existing
      const redirectPath = isNewUser ? '/auth/onboarding' : next
      return NextResponse.redirect(`${origin}${redirectPath}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
}
