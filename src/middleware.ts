import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // MUST create a new response and forward request cookies
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Step 1: set on request (so subsequent server code sees them)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Step 2: create fresh response with updated request
          supabaseResponse = NextResponse.next({ request })
          // Step 3: set on response (so browser stores them)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: always call getUser() to refresh session tokens.
  // Never use getSession() in middleware — it does not refresh tokens.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Allow auth/onboarding through without redirect
  const isOnboarding = pathname.startsWith('/auth/onboarding')

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect logged-in users away from auth pages
  if (
    pathname.startsWith('/auth') &&
    user &&
    !pathname.includes('callback') &&
    !isOnboarding
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Always return supabaseResponse — it carries the refreshed session cookies
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
