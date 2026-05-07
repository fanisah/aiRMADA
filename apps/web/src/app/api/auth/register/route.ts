import { NextRequest, NextResponse } from 'next/server'
import { DUMMY_USERS } from '@airmada/mocks'

/**
 * POST /api/auth/register
 * Register a new user account
 *
 * @location apps/web/src/app/api/auth/register/route.ts
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, password, confirmPassword, cellPhone } = body

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, error: 'Passwords do not match' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if email already exists in dummy users (as a demo check)
    const existingUser = DUMMY_USERS.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    )

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      )
    }

    // TODO: In production, this would:
    // 1. Hash the password using bcrypt or similar
    // 2. Insert user into database via Supabase auth.signUp()
    // 3. Create user profile in 'users' table
    // 4. Send verification email

    // For demo, create a mock user object
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      full_name: fullName,
      cell_phone: cellPhone || null,
      role: 'DRIVER' as const, // Default role for new registrations
      short_name: fullName.split(' ')[0],
      avatar_url: null,
      status: 'active' as const,
      created_at: new Date().toISOString(),
    }

    // Set session cookie
    const response = NextResponse.json(
      {
        success: true,
        user: newUser,
        email,
        registeredAt: new Date().toISOString(),
      },
      { status: 201 }
    )

    response.cookies.set({
      name: 'airmada_session',
      value: 'authenticated',
      maxAge: 86400, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
