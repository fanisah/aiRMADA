import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import { Shipment } from '@/types'

interface RoutesMapProps {
  shipments: Shipment[]
  origin: {
    lat: number
    lng: number
    id: string
  }
  selectedShipment: Shipment | null
  onShipmentSelect?: (shipment: Shipment) => void
  onRouteOptimized?: (orderedShipmentIds: string[]) => void
  onRouteCalculated?: (distance: number, duration: number) => void
}

export default function RoutesMap({
  shipments,
  origin,
  selectedShipment,
  onShipmentSelect,
  onRouteOptimized,
  onRouteCalculated,
}: RoutesMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const mainPolylineRef = useRef<L.Polyline | null>(null)
  const selectedPolylineRef = useRef<L.Polyline | null>(null)
  const routeCache = useRef<Record<string, [number, number][]>>({})
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([])

  const [isFetchingRoute, setIsFetchingRoute] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Pin sizes: 1.5x bigger on mobile
  const originIconSize = isMobile ? 60 : 40
  const originIconAnchor = isMobile ? 30 : 20
  const shipmentIconSize = isMobile ? 54 : 36
  const shipmentIconAnchor = isMobile ? 27 : 18

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
          width: ${originIconSize}px; height: ${originIconSize}px;
          display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: ${isMobile ? 24 : 18}px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
          border: 2px solid white;
        ">🚚</div>
      `,
      className: '',
      iconSize: [originIconSize, originIconSize],
      iconAnchor: [originIconAnchor, originIconAnchor],
    })

    const originMarker = L.marker([origin.lat, origin.lng], { icon: originIcon })
      .addTo(map)
      .bindPopup(`<b>${origin.id}</b>`)
    markersRef.current.set('origin', originMarker)

    // Marker tiap shipment
    const priorityColors: Record<string, string> = {
      same_day: '#dc2626',
      express: '#f97316',
      regular: '#3b82f6',
      cargo: '#6366f1',
      economy: '#6b7280',
    }

    shipments.forEach((shipment, index) => {
      const color = priorityColors[shipment.priority] ?? '#6b7280'

      const icon = L.divIcon({
        html: `
          <div style="
            background: ${color}; color: white;
            border-radius: 50%; width: ${shipmentIconSize}px; height: ${shipmentIconSize}px;
            display: flex; align-items: center; justify-content: center;
            font-weight: bold; font-size: ${isMobile ? 18 : 15}px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: 2px solid white;
          ">${index + 1}</div>
        `,
        className: '',
        iconSize: [shipmentIconSize, shipmentIconSize],
        iconAnchor: [shipmentIconAnchor, shipmentIconAnchor],
      })

      const statusLabel =
        shipment.status === 'delivered'
          ? 'Terkirim'
          : shipment.status === 'in_transit'
            ? 'Dalam Perjalanan'
            : shipment.status === 'pickup'
              ? 'Pengambilan'
              : 'Pending'

      const marker = L.marker([shipment.recipient_lat, shipment.recipient_lng], { icon })
        .addTo(map)
        .bindPopup(
          `
          <div style="min-width:200px">
            <b>${shipment.recipient_name}</b><br/>
            ${shipment.recipient_address}<br/>
            <hr style="margin:8px 0">
            <small><b>Status:</b> ${statusLabel}</small><br/>
            <small><b>Berat:</b> ${shipment.weight_kg} kg</small><br/>
            <small><b>Tracking:</b> ${shipment.tracking_code}</small>
          </div>
        `
        )
        .on('click', () => {
          onShipmentSelect?.(shipment)
        })

      markersRef.current.set(shipment.id, marker)
    })

    // Fit bounds ke semua marker
    if (shipments.length > 0) {
      const bounds = L.latLngBounds([[origin.lat, origin.lng]])
      shipments.forEach((s) => bounds.extend([s.recipient_lat, s.recipient_lng]))
      map.fitBounds(bounds, { padding: [60, 60] })
    }
  }, [shipments, origin, isMobile])

  // ── Gambar rute utama via OSRM (origin → semua shipment secara urutan) ──────
  useEffect(() => {
    const map = mapRef.current
    if (!map || shipments.length === 0) return

    // Hapus polyline lama
    if (mainPolylineRef.current) {
      map.removeLayer(mainPolylineRef.current)
      mainPolylineRef.current = null
    }

    setIsFetchingRoute(true)

    // Format data ke dalam URL query parameters
    const originParam = `${origin.lng},${origin.lat}`
    const destParam = shipments
      .map((s) => `${s.recipient_lng},${s.recipient_lat}`) // Hanya koordinat
      .join('|')
    const prioritiesParam = shipments
      .map((s) => s.priority) // Dipisah
      .join('|')

    fetch(
      `/api/routes?origin=${originParam}&destinations=${destParam}&priorities=${prioritiesParam}`
    )
      .then((res) => res.json())
      .then((result) => {
        setIsFetchingRoute(false)
        if (!mapRef.current) return

        if (result.success && result.data) {
          // 2. Kirim data jarak dan durasi ke parent (page.tsx)
          if (onRouteCalculated) {
            // Dibulatkan untuk durasi menit
            onRouteCalculated(result.data.distance || 0, Math.round(result.data.duration || 0))
          }

          // 3. Kirim data urutan paket untuk mengurutkan Sidebar
          if (onRouteOptimized && result.data.orderedIndices) {
            // Index dari ORS dihitung dari 1, jadi kita kurangi 1 untuk mencocokkan dengan array
            const orderedIds = result.data.orderedIndices.map(
              (idx: number) => shipments[idx - 1].id
            )
            onRouteOptimized(orderedIds)
          }
        }

        const coords =
          result.success && result.data?.coords
            ? result.data.coords
            : [
                [origin.lat, origin.lng],
                ...shipments.map((s) => [s.recipient_lat, s.recipient_lng]),
              ]

        mainPolylineRef.current = L.polyline(coords, {
          color: '#3b82f6',
          weight: 3,
          opacity: 0.75,
          dashArray: '8 6',
        }).addTo(mapRef.current)
      })
      .catch((err) => {
        console.error('Fetch route error:', err)
        setIsFetchingRoute(false)
      })
  }, [shipments, origin])

  // ── Highlight rute ke shipment yang dipilih ──────────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedShipment || shipments.length === 0) return

    const currentIndex = shipments.findIndex((s) => s.id === selectedShipment.id)

    // Tentukan titik mulai (Jika index 0, dari asal driver. Jika > 0, dari lokasi paket sebelumnya)
    const startPoint =
      currentIndex > 0
        ? {
            lat: shipments[currentIndex - 1].recipient_lat,
            lng: shipments[currentIndex - 1].recipient_lng,
          }
        : {
            lat: origin.lat,
            lng: origin.lng,
          }

    const controller = new AbortController()

    const originParam = `${startPoint.lng},${startPoint.lat}`
    const destParam = `${selectedShipment.recipient_lng},${selectedShipment.recipient_lat}`
    const priorityParam = selectedShipment.priority

    fetch(
      `/api/routes?origin=${originParam}&destinations=${destParam}&priorities=${priorityParam}`,
      {
        signal: controller.signal,
      }
    )
      .then((res) => res.json())
      .then((result) => {
        if (!mapRef.current) return

        // Hapus garis lama
        if (selectedPolylineRef.current) {
          mapRef.current.removeLayer(selectedPolylineRef.current)
          selectedPolylineRef.current = null
        }

        if (result.success && result.data?.coords) {
          selectedPolylineRef.current = L.polyline(result.data.coords, {
            color: '#3b82f6',
            weight: 10,
            opacity: 1,
          }).addTo(mapRef.current)
        }
      })
      .catch((err) => {
        // Abaikan error di console jika request sengaja kita batalkan
        if (err.name !== 'AbortError') {
          console.error('Fetch segment route error:', err)
        }
      })

    // 5. CLEANUP: Bersihkan referensi garis dan batalkan fetch jika user berpindah paket / unmount
    return () => {
      controller.abort()
      if (selectedPolylineRef.current && mapRef.current) {
        mapRef.current.removeLayer(selectedPolylineRef.current)
        selectedPolylineRef.current = null
      }
    }
  }, [selectedShipment, shipments, origin])

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
