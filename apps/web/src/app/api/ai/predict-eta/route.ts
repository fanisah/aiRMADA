/**
 * API Route: /api/ai/predict-eta
 *
 * @location apps/web/src/app/api/ai/predict-eta/route.ts
 * TODO: Prediksi ETA berdasarkan rute + histori
 */
import { NextResponse } from 'next/server'

export async function POST(_req: Request) {
  return NextResponse.json({
    message: 'TODO: implement POST /api/ai/predict-eta',
  })
}
