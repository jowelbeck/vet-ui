import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Routes that require an authenticated session. Kept in sync with the matcher
  // below. RLS is still the real data boundary — this is the edge auth gate.
  const PROTECTED = ['/app', '/patients', '/billing', '/pharmacy', '/lab', '/analytics', '/team', '/appointments', '/admin']
  const path = request.nextUrl.pathname
  const isProtected = PROTECTED.some((p) => path === p || path.startsWith(p + '/'))

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Account-level deactivation: a logged-in but deactivated user is bounced to
  // the deactivated notice on every protected navigation.
  if (user && isProtected) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('deactivated')
      .eq('id', user.id)
      .maybeSingle()
    if (profile?.deactivated) {
      const url = request.nextUrl.clone()
      url.pathname = '/deactivated'
      return NextResponse.redirect(url)
    }
  }

  if (user && ['/login', '/signup'].includes(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/app'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/app/:path*',
    '/patients/:path*',
    '/billing/:path*',
    '/pharmacy/:path*',
    '/lab/:path*',
    '/analytics/:path*',
    '/team/:path*',
    '/appointments/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
    '/onboarding',
  ],
}
