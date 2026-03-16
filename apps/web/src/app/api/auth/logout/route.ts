/**
 * API Route: /api/auth/logout
 *
 * @location apps/web/src/app/api/auth/logout/route.ts
 * TODO: Invalidate session
 */
import { NextResponse } from 'next/server'

export async function POST(_req: Request) {
  return NextResponse.json({
    message: 'TODO: implement POST /api/auth/logout',
  })
}
