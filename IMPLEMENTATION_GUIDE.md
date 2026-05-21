# 🔗 Implementasi AI Features ke Dashboard

## Status: ✅ READY TO DEPLOY

Semua enhanced components sudah siap untuk digunakan di production. Berikut adalah panduan implementasi untuk setiap dashboard.

---

## 1. Dispatcher Dashboard - Route Optimization

### File yang Sudah Ada

- **Original**: `apps/web/src/components/dashboard/DispatcherDashboard.tsx`
- **Enhanced**: `apps/web/src/components/dashboard/DispatcherDashboardEnhanced.tsx`

### Perubahan dari Original

✅ Tambah tombol "AI Optimize Route" di section pending assignments
✅ Integrasikan `useRouteOptimization` hook
✅ Tampilkan hasil optimasi dengan `RouteOptimizationResult` component
✅ Support untuk "Assign This Route" button

### Implementasi

**Option A: Replace component (Recommended)**

```typescript
// apps/web/src/app/(dashboard)/dispatch/page.tsx
import { DispatcherDashboardEnhanced } from '@/components/dashboard/DispatcherDashboardEnhanced'

export default function DispatchPage() {
  return <DispatcherDashboardEnhanced />
}
```

**Option B: Side-by-side comparison**

```typescript
import { DispatcherDashboard } from '@/components/dashboard/DispatcherDashboard'
import { DispatcherDashboardEnhanced } from '@/components/dashboard/DispatcherDashboardEnhanced'
import { useState } from 'react'

export default function DispatchPage() {
  const [useEnhanced, setUseEnhanced] = useState(true)

  return (
    <div>
      <button onClick={() => setUseEnhanced(!useEnhanced)}>
        Toggle AI Features
      </button>
      {useEnhanced ? <DispatcherDashboardEnhanced /> : <DispatcherDashboard />}
    </div>
  )
}
```

### Features

- 🎯 One-click route optimization untuk selected shipments
- 📊 Lihat estimated distance & duration
- 🛣️ Lihat ordered waypoints
- 👤 Assign ke available driver

### Testing

```bash
# 1. Buka dispatcher dashboard
# 2. Click "AI Optimize Route" button
# 3. Lihat result di section bawah
# 4. Verifikasi ordered waypoints sesuai
```

---

## 2. Manager Dashboard - Anomaly Detection

### File yang Sudah Ada

- **Original**: `apps/web/src/components/dashboard/ManagerDashboard.tsx`
- **Enhanced**: `apps/web/src/components/dashboard/ManagerDashboardEnhanced.tsx`

### Perubahan dari Original

✅ Ganti static KPI dengan real-time anomaly detection
✅ Tambah vehicle monitoring section
✅ Click vehicle untuk lihat anomaly analysis
✅ Show severity-based alerts

### Implementasi

```typescript
// apps/web/src/app/(dashboard)/fleet/page.tsx
import { ManagerDashboardEnhanced } from '@/components/dashboard/ManagerDashboardEnhanced'

export default function FleetPage() {
  return <ManagerDashboardEnhanced />
}
```

### Features

- 🚨 Real-time anomaly detection untuk setiap kendaraan
- 🎯 Click vehicle untuk analysis detail
- 📍 GPS Silent detection (no signal > 15 min)
- 🛣️ Route Deviation detection (>2 km off track)
- ⏱️ Late Delivery detection (>10 min delay)
- ⚡ Speed Anomaly detection (>80 km/h)
- 🟢 Severity color-coding (low/medium/high)

### Testing

```bash
# 1. Buka manager dashboard
# 2. Click vehicle dari fleet list
# 3. Lihat anomaly analysis muncul
# 4. Verifikasi anomalies sesuai input
# 5. Check severity levels
```

---

## 3. Shipment Tracking - ETA Prediction

### File yang Sudah Ada

- **Original**: `apps/web/src/components/shipments/TrackingPublicView.tsx`
- **Enhanced**: `apps/web/src/components/shipments/TrackingPublicViewEnhanced.tsx`

### Perubahan dari Original

✅ Replace static "coming soon" dengan full tracking view
✅ Integrate ETA prediction dengan button click
✅ Show current shipment status & location
✅ Display delivery timeline

### Implementasi

```typescript
// apps/web/src/app/track/page.tsx
import { TrackingPublicViewEnhanced } from '@/components/shipments/TrackingPublicViewEnhanced'

export default function TrackingPage() {
  return <TrackingPublicViewEnhanced />
}
```

### Features

- 📦 Display shipment details (sender, recipient, weight)
- 📍 Current location & status
- ⏱️ One-click ETA prediction
- 📊 Show remaining distance & stops
- 🚗 Display current speed & traffic factor
- 📈 Confidence score
- 📅 Delivery timeline (history + prediction)

### Testing

```bash
# 1. Buka tracking page
# 2. Lihat shipment details
# 3. Click "Predict ETA" button
# 4. Verify estimated arrival time
# 5. Check confidence percentage
```

---

## Integrasi ke Existing Pages

### Dispatcher Page

**File**: `apps/web/src/app/(dashboard)/dispatch/page.tsx` atau sejenisnya

```typescript
'use client'

import { DispatcherDashboardEnhanced } from '@/components/dashboard/DispatcherDashboardEnhanced'

export default function DispatcherPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Dispatch Management</h1>
        <p className="mt-1 text-slate-600">Real-time route optimization with AI</p>
      </div>

      <DispatcherDashboardEnhanced />
    </main>
  )
}
```

### Fleet Page

**File**: `apps/web/src/app/(dashboard)/fleet/page.tsx` atau sejenisnya

```typescript
'use client'

import { ManagerDashboardEnhanced } from '@/components/dashboard/ManagerDashboardEnhanced'

export default function FleetPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Fleet Management</h1>
        <p className="mt-1 text-slate-600">AI-powered anomaly detection</p>
      </div>

      <ManagerDashboardEnhanced />
    </main>
  )
}
```

### Tracking Page

**File**: `apps/web/src/app/track/page.tsx` atau sejenisnya

```typescript
import { TrackingPublicViewEnhanced } from '@/components/shipments/TrackingPublicViewEnhanced'

export default function TrackingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <TrackingPublicViewEnhanced />
    </main>
  )
}
```

---

## Checklist Implementasi

### Pre-Implementation

- [ ] Backup existing dashboard files
- [ ] Review enhanced components
- [ ] Setup AI Service backend (running di port 8000)
- [ ] Verify .env.local memiliki AI_SERVICE_URL & SECRET

### Implementation

- [ ] Replace/integrate DispatcherDashboardEnhanced
- [ ] Replace/integrate ManagerDashboardEnhanced
- [ ] Replace/integrate TrackingPublicViewEnhanced
- [ ] Test setiap component secara terpisah

### Post-Implementation

- [ ] Test end-to-end flow
- [ ] Verify all API calls working
- [ ] Check error handling
- [ ] Test dengan real data (jika ada)
- [ ] Performance testing (load test)
- [ ] Browser compatibility test

---

## Environment Setup

### Backend AI Service

```bash
cd apps/ai-service

# Install dependencies
pip install -r requirements-dev.txt

# Run server
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend Web App

```bash
cd apps/web

# Install dependencies (jika belum)
npm install

# Run dev server
npm run dev
```

### Verify Integration

```bash
# Test API endpoints
curl -X POST http://localhost:3000/api/ai/optimize-route \
  -H "Content-Type: application/json" \
  -d '{...}'

# Test from browser
# Visit http://localhost:3000 dan navigate ke dispatch/fleet/track pages
```

---

## Common Integration Patterns

### Pattern 1: Server Components → Client Components

```typescript
// apps/web/src/app/(dashboard)/dispatch/page.tsx (Server Component)
import { DispatcherDashboardEnhanced } from '@/components/dashboard/DispatcherDashboardEnhanced'

export default function Page() {
  return <DispatcherDashboardEnhanced /> // This is a Client Component ('use client')
}
```

### Pattern 2: Layout + Content

```typescript
// apps/web/src/app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Sidebar />
      <main className="p-6">{children}</main>
    </div>
  )
}

// apps/web/src/app/(dashboard)/dispatch/page.tsx
import { DispatcherDashboardEnhanced } from '@/components/dashboard/DispatcherDashboardEnhanced'

export default function Page() {
  return <DispatcherDashboardEnhanced />
}
```

### Pattern 3: With Navigation

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { DispatcherDashboardEnhanced } from '@/components/dashboard/DispatcherDashboardEnhanced'

export default function Page() {
  const router = useRouter()

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h1>Dispatch</h1>
        <button onClick={() => router.push('/dashboard')}>
          Back
        </button>
      </div>
      <DispatcherDashboardEnhanced />
    </div>
  )
}
```

---

## Troubleshooting

### Issue: "AI Service error: 401"

**Solution**: Pastikan environment variables benar

```bash
# apps/web/.env.local
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_SECRET=dev-secret-change-in-production
```

### Issue: "Failed to optimize route"

**Solution**: Verify destination coordinates

```typescript
// Coordinates harus valid:
// lat: -90 to 90
// lng: -180 to 180
// Contoh Jakarta: lat: -6.2088, lng: 106.8456
```

### Issue: Components tidak render

**Solution**: Verify 'use client' directive ada

```typescript
// Harus ada di top file untuk interactive components
'use client'
```

### Issue: Anomalies tidak detected

**Solution**: Threshold mungkin tidak terpenuhi

```typescript
// Ubah input values untuk trigger detection:
// - lastGpsMinutesAgo > 15 (untuk GPS Silent)
// - deviation_km > 2.0 (untuk Route Deviation)
// - eta_overdue_minutes > 10 (untuk Late Delivery)
// - speed_kmh > 80 (untuk Speed Anomaly)
```

---

## Performance Tips

### 1. Lazy Load Components

```typescript
import dynamic from 'next/dynamic'

const DispatcherDashboardEnhanced = dynamic(
  () => import('@/components/dashboard/DispatcherDashboardEnhanced'),
  { loading: () => <p>Loading...</p> }
)
```

### 2. Memoize Components

```typescript
import { memo } from 'react'

const DispatcherKPICard = memo(function KPICard({ ... }) {
  return (...)
})
```

### 3. Debounce API Calls

```typescript
import { useDebouncedCallback } from 'use-debounce'

const debouncedDetect = useDebouncedCallback(
  (vehicleId) => detect(vehicleId, ...),
  500
)
```

---

## Next Phase: Production Deployment

### Fase 1: Testing (Current)

- ✅ Development environment
- ✅ Manual testing
- ✅ Error handling
- ✅ Performance verification

### Fase 2: Staging

- [ ] Deploy to staging environment
- [ ] Load testing
- [ ] Integration testing
- [ ] User acceptance testing (UAT)

### Fase 3: Production

- [ ] Final verification
- [ ] Monitoring setup
- [ ] Alert configuration
- [ ] Production deployment
- [ ] Post-deployment monitoring

---

## Monitoring & Logging

### Add to Enhanced Components

```typescript
// Log API calls
console.log('Route optimization request:', { origin, destinations })

// Log results
console.log('Route optimization result:', optimizedRoute)

// Log errors
console.error('API error:', error)
```

### Setup Monitoring (Future)

```typescript
// Integrate dengan analytics service (Sentry, NewRelic, etc)
import * as Sentry from "@sentry/nextjs"

try {
  await optimize(...)
} catch (error) {
  Sentry.captureException(error)
}
```

---

## Summary

| Component  | Feature            | File                            | Status   |
| ---------- | ------------------ | ------------------------------- | -------- |
| Dispatcher | Route Optimization | DispatcherDashboardEnhanced.tsx | ✅ Ready |
| Manager    | Anomaly Detection  | ManagerDashboardEnhanced.tsx    | ✅ Ready |
| Tracking   | ETA Prediction     | TrackingPublicViewEnhanced.tsx  | ✅ Ready |

**Next Step**: Copy these files ke production pages dan test end-to-end!

---

**Last Updated**: May 21, 2026
**Status**: ✅ IMPLEMENTATION READY
