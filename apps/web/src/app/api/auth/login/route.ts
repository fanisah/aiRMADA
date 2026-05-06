/**
 * API Route: /api/auth/login
 *
 * @location apps/web/src/app/api/auth/login/route.ts
 * Handles user authentication and session creation
 */
import { NextResponse, type NextRequest } from 'next/server'
import type { User } from '@airmada/types'
import { DUMMY_USERS } from '@airmada/mocks'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // ===== TEMPORARY: Dummy Authentication =====
    const user = DUMMY_USERS.find((u) => u.email === email)

    if (!user) {
      return NextResponse.json({ error: 'Email address not found' }, { status: 401 })
    }

    if (user.password !== password) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    // Extract user profile (tanpa password)
    const { password: _, ...userProfile } = user

    // Create response dengan session data
    const response = NextResponse.json(
      {
        success: true,
        user: userProfile as User,
        email: user.email,
        loginTime: new Date().toISOString(),
      },
      { status: 200 }
    )

    // Set session cookie
    response.cookies.set('airmada_session', 'authenticated', {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
    })

    return response

    // ===== FUTURE: Supabase Implementation =====
    // const { createClient } = await import('@/lib/supabase/server')
    // const supabase = await createClient()
    //
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // })
    //
    // if (error) {
    //   return NextResponse.json(
    //     { error: error.message },
    //     { status: 401 }
    //   )
    // }
    //
    // const { data: profile } = await supabase
    //   .from('users')
    //   .select('id, full_name, short_name, role, cell_phone')
    //   .eq('id', data.user.id)
    //   .single()
    //
    // if (!profile) {
    //   return NextResponse.json(
    //     { error: 'User profile not found' },
    //     { status: 404 }
    //   )
    // }
    //
    // const response = NextResponse.json(
    //   {
    //     success: true,
    //     user: profile as User,
    //     email: data.user.email,
    //     loginTime: new Date().toISOString(),
    //   },
    //   { status: 200 }
    // )
    //
    // return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
