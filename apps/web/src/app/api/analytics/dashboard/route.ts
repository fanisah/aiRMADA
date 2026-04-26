/**
 * API Route: /api/analytics/dashboard
 *
 * @location apps/web/src/app/api/analytics/dashboard/route.ts
 * TODO: KPI utama dari analytics_snapshots
 */
import { NextResponse } from 'next/server'

export async function GET(_req: Request) {
  return NextResponse.json({
    message: 'TODO: implement GET /api/analytics/dashboard',
  })
}
