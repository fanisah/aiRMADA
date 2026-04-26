/**
 * API Route: /api/analytics/performance
 *
 * @location apps/web/src/app/api/analytics/performance/route.ts
 * TODO: Tren performa dalam rentang waktu
 */
import { NextResponse } from 'next/server'

export async function GET(_req: Request) {
  return NextResponse.json({
    message: 'TODO: implement GET /api/analytics/performance',
  })
}
