/**
 * API Route: /api/ai/optimize-route
 *
 * @location apps/web/src/app/api/ai/optimize-route/route.ts
 * TODO: Kirim ke AI service untuk optimasi TSP
 */
import { NextResponse } from 'next/server'

export async function POST(_req: Request) {
  return NextResponse.json({
    message: 'TODO: implement POST /api/ai/optimize-route',
  })
}
