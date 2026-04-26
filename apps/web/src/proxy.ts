import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// const PUBLIC_PATHS = ['/login', '/api/shipments/track', '/api/auth/login']

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  // const isPublic = PUBLIC_PATHS.some((p) => request.nextUrl.pathname.startsWith(p))

  // TODO: Comment sementara redirect /login
  // if (!user && !isPublic) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/overview', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
