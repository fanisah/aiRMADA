/**
 * API Route: /api/auth/me
 *
 * @location apps/web/src/app/api/auth/me/route.ts
 * TODO: Profil user saat ini
 */
import { NextResponse } from 'next/server'

export async function GET(_req: Request) {
  return NextResponse.json({
    message: 'TODO: implement GET /api/auth/me',
  })
}

export async function PATCH(_req: Request) {
  return NextResponse.json({
    message: 'TODO: implement PATCH /api/auth/me',
  })
}
