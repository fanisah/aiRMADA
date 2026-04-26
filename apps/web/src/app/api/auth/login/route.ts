/**
 * API Route: /api/auth/login
 *
 * @location apps/web/src/app/api/auth/login/route.ts
 * TODO: Login via Supabase Auth
 */
import { NextResponse } from 'next/server'

export async function POST(_req: Request) {
  return NextResponse.json({
    message: 'TODO: implement POST /api/auth/login',
  })
}
