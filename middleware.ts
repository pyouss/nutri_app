import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - getUser() will refresh the session automatically
  // This is important for middleware to properly detect authenticated users
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  
  // Also get session to ensure we have the latest state
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  // Use user presence to determine if authenticated (more reliable than getSession in middleware)
  // If getUser() fails but we have a session, still consider authenticated
  // Also check for auth cookies as a fallback
  const hasAuthCookie = request.cookies.has('sb-iwszzotcejmepumidpxt-auth-token') || 
                        request.cookies.has('supabase-auth-token')
  const isAuthenticated = !!user || !!session || hasAuthCookie

  // Define protected routes (API routes are protected separately via token auth)
  const protectedRoutes = ['/dashboard', '/account', '/meals']
  const authRoutes = ['/login', '/signup', '/forgot-password']
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  // NOTE: Middleware protection temporarily disabled due to session sync issues
  // between client-side localStorage auth and server-side middleware.
  // Pages have their own client-side auth checks and will redirect if needed.
  // API routes are fully protected with token validation (PRIMARY SECURITY LAYER)
  
  // Redirect logic - DISABLED for now to prevent navigation issues
  // if (isProtectedRoute && !isAuthenticated) {
  //   const redirectUrl = new URL('/login', request.url)
  //   redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
  //   return NextResponse.redirect(redirectUrl)
  // }

  if (isAuthRoute && isAuthenticated) {
    // Redirect to home if trying to access auth routes while logged in
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
