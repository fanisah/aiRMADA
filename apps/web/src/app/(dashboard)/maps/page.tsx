'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Clock, Gauge, Package, AlertCircle, Zap, RefreshCw } from 'lucide-react'
import { Shipment, ShipmentPriority, Location } from '@/types'
import { mockShipments } from '@/mocks'
import { mockWarehouses } from '@/mocks'

// Driver origin (warehouse/starting point)
const FALLBACK_ORIGIN: Location = {
  lat: mockWarehouses[0].lat,
  lng: mockWarehouses[0].long,
  id: mockWarehouses[0].name,
}

// Dynamically import map component
const RoutesMap = dynamic(() => import('../../../components/dashboard/RoutesMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-orange-400"></div>
        <p className="mt-4 text-gray-600">Memuat peta...</p>
      </div>
    </div>
  ),
})

// Priority configuration
function getPriorityConfig(priority: ShipmentPriority) {
  const config: Record<
    ShipmentPriority,
    { color: string; label: string; icon: React.ReactNode; badge: string }
  > = {
    same_day: {
      color: 'text-red-600 bg-red-50',
      label: 'Hari Ini',
      icon: <Zap size={16} />,
      badge: 'bg-red-100 text-red-700',
    },
    express: {
      color: 'text-orange-600 bg-orange-50',
      label: 'Express',
      icon: <AlertCircle size={16} />,
      badge: 'bg-orange-100 text-orange-700',
    },
    regular: {
      color: 'text-blue-600 bg-blue-50',
      label: 'Regular',
      icon: <Package size={16} />,
      badge: 'bg-blue-100 text-blue-700',
    },
    cargo: {
      color: 'text-indigo-600 bg-indigo-50',
      label: 'Cargo',
      icon: <Package size={16} />,
      badge: 'bg-indigo-100 text-indigo-700',
    },
    economy: {
      color: 'text-gray-600 bg-gray-50',
      label: 'Economy',
      icon: <Package size={16} />,
      badge: 'bg-gray-100 text-gray-700',
    },
  }
  return config[priority]
}

export default function MapsPage() {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [sortedShipments, setSortedShipments] = useState<Shipment[]>([])
  const [driverOrigin, setDriverOrigin] = useState(FALLBACK_ORIGIN)
  const [routeStarted, setRouteStarted] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [routeStats, setRouteStats] = useState({ distance: 0, duration: 0 })

  /**
   * Naikkan nilai ini untuk memaksa RoutesMap menghapus cache segmen dan
   * melakukan fetch ulang ke ORS (refresh manual oleh pengguna).
   */
  const [routeRefreshKey, setRouteRefreshKey] = useState(0)

  useEffect(() => {
    setSortedShipments(mockShipments)
    if (mockShipments.length > 0) {
      setSelectedShipment(mockShipments[0])
    }
  }, [])

  // Get device location
  const handleStartRoute = () => {
    setIsLoadingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError('Geolocation tidak didukung oleh browser Anda')
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setDriverOrigin({
          lat: latitude,
          lng: longitude,
          id: 'driver-location',
        })
        setRouteStarted(true)
        setIsLoadingLocation(false)
      },
      (error) => {
        let errorMsg = 'Gagal mendapatkan lokasi'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Izin akses lokasi ditolak'
            break
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Informasi lokasi tidak tersedia'
            break
          case error.TIMEOUT:
            errorMsg = 'Permintaan lokasi timeout'
            break
        }
        setLocationError(errorMsg)
        setIsLoadingLocation(false)
      }
    )
  }

  const handleRouteOptimized = (orderedIds: string[]) => {
    setSortedShipments((prev) => {
      const currentOrder = prev.map((s) => s.id).join(',')
      const newOrder = orderedIds.join(',')
      if (currentOrder === newOrder) return prev
      return [...prev].sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id))
    })
  }

  /**
   * Hapus cache dan minta RoutesMap fetch ulang seluruh rute dari ORS.
   * Dipanggil saat pengguna menekan tombol "Optimasi Rute".
   */
  const handleRefreshRoute = () => {
    setRouteRefreshKey((k) => k + 1)
  }

  const totalWeight = sortedShipments.reduce((sum, s) => sum + s.weight_kg, 0)

  return (
    <div className="flex h-full overflow-hidden bg-white">
      {/* Map */}
      <div className="relative flex-1">
        <RoutesMap
          shipments={sortedShipments}
          origin={driverOrigin}
          selectedShipment={selectedShipment}
          onShipmentSelect={setSelectedShipment}
          onRouteOptimized={handleRouteOptimized}
          onRouteCalculated={(dist, dur) => setRouteStats({ distance: dist, duration: dur })}
          refreshKey={routeRefreshKey}
        />

        {/* Map controls - Stats floating card */}
        <div className="absolute bottom-6 left-6 z-10 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="space-y-3 p-4">
            {/* Item: Total Jarak */}
            <div className="flex items-center justify-between gap-x-8">
              <div className="flex items-center gap-2 text-gray-600">
                <Gauge size={16} />
                <span className="text-sm">Total Jarak</span>
              </div>
              <p className="font-bold text-gray-900">{routeStats.distance.toFixed(1)} km</p>
            </div>

            {/* Item: Est. Durasi */}
            <div className="flex items-center justify-between gap-x-8">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={16} />
                <span className="text-sm">Est. Durasi</span>
              </div>
              <p className="font-bold text-gray-900">{routeStats.duration} menit</p>
            </div>

            {/* Item: Total Beban */}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between gap-x-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <Package size={16} />
                  <span className="text-sm">Total Beban</span>
                </div>
                <p className="font-bold text-gray-900">{totalWeight} kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Shipment list */}
      <div className="hidden w-full max-w-sm flex-col overflow-hidden border-l border-gray-200 bg-white sm:flex">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Rute Perjalanan</h2>
          <p className="mt-1 text-sm text-gray-500">{sortedShipments.length} paket dioptimalkan</p>
        </div>

        {/* Origin point */}
        <div className="border-b border-gray-200 bg-blue-50 px-6 py-3">
          <div className="flex items-start gap-3">
            <div
              className={`mt-1 h-3 w-3 shrink-0 rounded-full ${routeStarted ? 'animate-pulse bg-green-600' : 'bg-blue-600'}`}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">Titik Awal</p>
              <p className="truncate text-xs text-gray-600">{driverOrigin.id}</p>
              {routeStarted && (
                <p className="mt-1 text-xs text-green-600">
                  {driverOrigin.lat.toFixed(4)}, {driverOrigin.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Shipments list */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2 p-4">
            {sortedShipments.map((shipment, index) => {
              const priorityConfig = getPriorityConfig(shipment.priority)
              const isSelected = selectedShipment?.id === shipment.id

              return (
                <button
                  key={shipment.id}
                  onClick={() => setSelectedShipment(shipment)}
                  className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-transparent bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {/* Number + Priority */}
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${priorityConfig.badge}`}
                      >
                        {priorityConfig.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{shipment.tracking_code}</span>
                  </div>

                  {/* Recipient */}
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {shipment.recipient_name}
                  </p>
                  <p className="mb-2 truncate text-xs text-gray-600">
                    {shipment.recipient_address}
                  </p>

                  {/* Status + Weight */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          shipment.status === 'delivered'
                            ? 'bg-green-600'
                            : shipment.status === 'in_transit'
                              ? 'bg-blue-600'
                              : shipment.status === 'pickup'
                                ? 'bg-orange-600'
                                : 'bg-gray-400'
                        }`}
                      />
                      <span className="text-gray-600">
                        {shipment.status === 'delivered'
                          ? 'Terkirim'
                          : shipment.status === 'in_transit'
                            ? 'Dalam Perjalanan'
                            : shipment.status === 'pickup'
                              ? 'Pengambilan'
                              : 'Pending'}
                      </span>
                    </span>
                    <span className="text-xs font-medium text-gray-700">
                      {shipment.weight_kg} kg
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer - Action buttons */}
        <div className="space-y-2 border-t border-gray-200 p-4">
          {locationError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-xs text-red-700">{locationError}</p>
            </div>
          )}
          <button
            onClick={handleStartRoute}
            disabled={isLoadingLocation || routeStarted}
            className={`w-full rounded-lg px-4 py-2.5 font-medium text-white transition-colors ${
              routeStarted
                ? 'bg-green-600 hover:bg-green-700'
                : isLoadingLocation
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {isLoadingLocation
              ? 'Mendapatkan Lokasi...'
              : routeStarted
                ? '✓ Rute Dimulai'
                : 'Mulai Rute'}
          </button>
          <button
            onClick={handleRefreshRoute}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <RefreshCw size={15} />
            Optimasi Rute
          </button>
        </div>
      </div>
    </div>
  )
}
