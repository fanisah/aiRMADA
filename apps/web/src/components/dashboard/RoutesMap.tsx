import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import { Shipment } from '@/types'

interface RoutesMapProps {
  shipments: Shipment[]
  origin: {
    lat: number
    lng: number
    name: string
  }
  selectedShipment: Shipment | null
}

// =============================================================================
// OSRM ROUTING HELPER
// Menggunakan OSRM public demo server — gratis, berbasis OpenStreetMap.
// Untuk production, ganti dengan server OSRM sendiri atau OpenRouteService.
//
// Format koordinat OSRM: lng,lat (kebalikan dari Leaflet lat,lng)
// =============================================================================

const ORS_BASE = 'https://api.openrouteservice.org/v2/directions/driving-car'
const ORS_API_KEY = process.env.NEXT_PUBLIC_ORS_API_KEY

interface ORSResponse {
  type: string
  features: Array<{
    type: string
    geometry: {
      type: string
      coordinates: [number, number][] // [lng, lat]
    }
    properties: {
      summary: {
        distance: number // meter
        duration: number // detik
        ascent: number
        descent: number
      }
    }
  }>
}

async function fetchRoadRoute(
  waypoints: Array<{ lat: number; lng: number }>
): Promise<{ coords: L.LatLngTuple[]; distance: number; duration: number } | null> {
  // ORS butuh minimal 2 titik
  if (waypoints.length < 2) return null

  let allCoords: L.LatLngTuple[] = []
  let totalDistance = 0
  let totalDuration = 0

  try {
    // Karena spesifikasi endpoint GET hanya menerima 1 pasang start & end,
    // kita memanggilnya secara berpasangan untuk setiap segmen waypoint (A->B, B->C, dst).
    for (let i = 0; i < waypoints.length - 1; i++) {
      const start = waypoints[i]
      const end = waypoints[i + 1]

      const url = `${ORS_BASE}?api_key=${ORS_API_KEY}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`

      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
      if (!res.ok) return null

      const data: ORSResponse = await res.json()
      if (!data.features || data.features.length === 0) return null

      const route = data.features[0]

      // Konversi [lng, lat] dari GeoJSON LineString → L.LatLngTuple [lat, lng] untuk Leaflet
      const segmentCoords: L.LatLngTuple[] = route.geometry.coordinates.map(([lng, lat]) => [
        lat,
        lng,
      ])

      allCoords = allCoords.concat(segmentCoords)
      totalDistance += route.properties.summary.distance
      totalDuration += route.properties.summary.duration
    }

    return {
      coords: allCoords,
      distance: totalDistance / 1000, // Konversi meter ke km
      duration: totalDuration / 60, // Konversi detik ke menit
    }
  } catch (error) {
    console.error('Gagal mengambil rute dari ORS:', error)
    return null
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function RoutesMap({ shipments, origin, selectedShipment }: RoutesMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const mainPolylineRef = useRef<L.Polyline | null>(null)
  const selectedPolylineRef = useRef<L.Polyline | null>(null)

  const [isFetchingRoute, setIsFetchingRoute] = useState(false)

  // ── Inisiasi peta + marker ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([origin.lat, origin.lng], 12)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current)
    }

    const map = mapRef.current

    // Hapus marker lama
    markersRef.current.forEach((marker) => map.removeLayer(marker))
    markersRef.current.clear()

    // Marker origin
    const originIcon = L.divIcon({
      html: `
        <div style="
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white; border-radius: 50%;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
          border: 2px solid white;
        ">🚚</div>
      `,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    })

    const originMarker = L.marker([origin.lat, origin.lng], { icon: originIcon })
      .addTo(map)
      .bindPopup(`<b>${origin.name}</b>`)
    markersRef.current.set('origin', originMarker)

    // Marker tiap shipment
    const priorityColors: Record<string, string> = {
      same_day: '#dc2626',
      express: '#f97316',
      regular: '#3b82f6',
    }

    shipments.forEach((shipment, index) => {
      const color = priorityColors[shipment.priority] ?? '#6b7280'

      const icon = L.divIcon({
        html: `
          <div style="
            background: ${color}; color: white;
            border-radius: 50%; width: 36px; height: 36px;
            display: flex; align-items: center; justify-content: center;
            font-weight: bold; font-size: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: 2px solid white;
          ">${index + 1}</div>
        `,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })

      const statusLabel =
        shipment.status === 'delivered'
          ? 'Terkirim'
          : shipment.status === 'in_transit'
            ? 'Dalam Perjalanan'
            : shipment.status === 'pickup'
              ? 'Pengambilan'
              : 'Pending'

      const marker = L.marker([shipment.recipient_lat, shipment.recipient_lng], { icon }).addTo(map)
        .bindPopup(`
          <div style="min-width:200px">
            <b>${shipment.recipient_name}</b><br/>
            ${shipment.recipient_address}<br/>
            <hr style="margin:8px 0">
            <small><b>Status:</b> ${statusLabel}</small><br/>
            <small><b>Berat:</b> ${shipment.weight_kg} kg</small><br/>
            <small><b>Tracking:</b> ${shipment.tracking_code}</small>
          </div>
        `)

      markersRef.current.set(shipment.id, marker)
    })

    // Fit bounds ke semua marker
    if (shipments.length > 0) {
      const bounds = L.latLngBounds([[origin.lat, origin.lng]])
      shipments.forEach((s) => bounds.extend([s.recipient_lat, s.recipient_lng]))
      map.fitBounds(bounds, { padding: [60, 60] })
    }
  }, [shipments, origin])

  // ── Gambar rute utama via OSRM (origin → semua shipment secara urutan) ──────
  useEffect(() => {
    const map = mapRef.current
    if (!map || shipments.length === 0) return

    // Hapus polyline lama
    if (mainPolylineRef.current) {
      map.removeLayer(mainPolylineRef.current)
      mainPolylineRef.current = null
    }

    const waypoints = [
      { lat: origin.lat, lng: origin.lng },
      ...shipments.map((s) => ({ lat: s.recipient_lat, lng: s.recipient_lng })),
    ]

    setIsFetchingRoute(true)

    fetchRoadRoute(waypoints).then((result) => {
      setIsFetchingRoute(false)
      if (!mapRef.current) return

      const coords =
        result?.coords ??
        // Fallback: garis lurus jika OSRM gagal
        waypoints.map((w): L.LatLngTuple => [w.lat, w.lng])

      mainPolylineRef.current = L.polyline(coords, {
        color: '#94a3b8',
        weight: 3,
        opacity: 0.55,
        dashArray: '8 6',
      }).addTo(mapRef.current)
    })
  }, [shipments, origin])

  // ── Highlight rute ke shipment yang dipilih ──────────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Hapus highlight lama
    if (selectedPolylineRef.current) {
      map.removeLayer(selectedPolylineRef.current)
      selectedPolylineRef.current = null
    }

    if (!selectedShipment) return

    const waypoints = [
      { lat: origin.lat, lng: origin.lng },
      { lat: selectedShipment.recipient_lat, lng: selectedShipment.recipient_lng },
    ]

    fetchRoadRoute(waypoints).then((result) => {
      if (!mapRef.current) return

      const coords = result?.coords ?? waypoints.map((w): L.LatLngTuple => [w.lat, w.lng])

      selectedPolylineRef.current = L.polyline(coords, {
        color: '#f97316',
        weight: 5,
        opacity: 0.85,
      }).addTo(mapRef.current)

      // Buka popup marker yang dipilih
      const marker = markersRef.current.get(selectedShipment.id)
      if (marker) {
        marker.openPopup()

        // Fit bounds ke rute yang dipilih (origin + tujuan)
        const bounds = L.latLngBounds(coords)
        mapRef.current.fitBounds(bounds, { padding: [80, 80], maxZoom: 14 })
      }
    })
  }, [selectedShipment, origin])

  return (
    <>
      {/* Loading indicator */}
      {isFetchingRoute && (
        <div className="pointer-events-none absolute top-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-md">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-orange-500" />
            Memuat rute jalan...
          </div>
        </div>
      )}

      <div id="map" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
    </>
  )
}
