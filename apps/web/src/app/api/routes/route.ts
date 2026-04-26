/**
 * API Route: /api/routes
 *
 * @location apps/web/src/app/api/routes/route.ts
 * TODO: List + create rute
 */
import { NextResponse } from 'next/server'

export async function GET(_req: Request) {
  return NextResponse.json({
    message: 'TODO: implement GET /api/routes',
  })
}

export async function POST(_req: Request) {
  return NextResponse.json({
    message: 'TODO: implement POST /api/routes',
  })
}
