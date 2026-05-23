'use client'

import Link from 'next/link'
import {
  ChevronLeft,
  MapPin,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Truck,
  Package,
  Calendar,
} from 'lucide-react'
import { Route } from 'next'
import { Shipment } from '@/types'

/**
 * Halaman detail paket
 * @location apps/web/src/app/(dashboard)/packages/[id]/page.tsx
 */

// Mock package detail
const mockPackageDetail: Record<string, Shipment> = {
  '1': {
    id: '1',
    tracking_code: 'TRK001',
    driver_id: '1',
    status: 'in_transit',
    sender_name: 'Warehouse Jakarta',
    sender_address: 'Jl. Industri No. 1, Jakarta 13920',
    recipient_name: 'PT. Mitra Abadi',
    recipient_address: 'Jl. Gatot Subroto No. 123, Jakarta Selatan 12950',
    recipient_lat: -6.2197,
    recipient_lng: 106.7997,
    weight_kg: 15.5,
    volume_m3: 0.08,
    priority: 'express',
    estimated_delivery: '2024-12-20T14:00:00Z',
    created_at: '2024-12-20T09:00:00Z',
    updated_at: '2024-12-20T12:30:00Z',
  },
  '2': {
    id: '2',
    tracking_code: 'TRK002',
    driver_id: '1',
    status: 'in_transit',
    sender_name: 'Warehouse Jakarta',
    sender_address: 'Jl. Industri No. 1, Jakarta',
    recipient_name: 'CV. Sukses Jaya',
    recipient_address: 'Jl. Ampera, Jakarta Selatan',
    recipient_lat: -6.2456,
    recipient_lng: 106.8052,
    weight_kg: 22.0,
    volume_m3: 0.15,
    priority: 'regular',
    estimated_delivery: '2024-12-20T16:30:00Z',
    created_at: '2024-12-20T09:30:00Z',
    updated_at: '2024-12-20T12:45:00Z',
  },
  '3': {
    id: '3',
    tracking_code: 'TRK003',
    driver_id: '1',
    status: 'delivered',
    sender_name: 'Warehouse Jakarta',
    sender_address: 'Jl. Industri No. 1, Jakarta',
    recipient_name: 'Klinik Sehat',
    recipient_address: 'Jl. Sudirman, Jakarta Pusat',
    recipient_lat: -6.2088,
    recipient_lng: 106.8212,
    weight_kg: 12.0,
    volume_m3: 0.06,
    priority: 'express',
    estimated_delivery: '2024-12-19T15:00:00Z',
    actual_delivery: '2024-12-19T14:45:00Z',
    created_at: '2024-12-19T08:00:00Z',
    updated_at: '2024-12-19T14:45:00Z',
  },
}

const statusSteps = ['pending', 'assigned', 'pickup', 'in_transit', 'delivered'] as const

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pkg = mockPackageDetail[id]

  if (!pkg) {
    return (
      <div className="space-y-4 p-4 lg:p-6">
        <Link
          href={'/packages' as Route}
          className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          <ChevronLeft size={18} />
          Back to Packages
        </Link>
        <div className="rounded-lg bg-red-50 p-12 text-center">
          <AlertCircle className="mx-auto text-red-400" size={32} />
          <p className="mt-3 font-semibold text-red-900">Package not found</p>
          <p className="mt-1 text-sm text-red-700">The package you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const statusIndex = statusSteps.indexOf(pkg.status as (typeof statusSteps)[number])
  const isDelivered = pkg.status === 'delivered'
  const isFailed = pkg.status === 'failed'

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Back Button */}
      <Link
        href={'/packages' as Route}
        className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700"
      >
        <ChevronLeft size={18} />
        Back to Packages
      </Link>

      {/* Header */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{pkg.tracking_code}</h1>
            <p className="mt-1 text-slate-600">Package ID: {pkg.id}</p>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              pkg.status === 'delivered'
                ? 'bg-green-100 text-green-800'
                : pkg.status === 'in_transit'
                  ? 'bg-orange-100 text-orange-800'
                  : pkg.status === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
            }`}
          >
            {pkg.status === 'in_transit' && <Truck size={18} />}
            {pkg.status === 'delivered' && <CheckCircle size={18} />}
            {pkg.status === 'failed' && <AlertCircle size={18} />}
            {pkg.status === 'pending' && <Package size={18} />}
            {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1).replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Status Timeline */}
      {!isFailed && (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-bold text-slate-900">Delivery Status</h2>
          <div className="space-y-4">
            {statusSteps.map((step, idx) => {
              const isCompleted = idx < statusIndex || (idx === statusIndex && isDelivered)
              const isCurrent = idx === statusIndex && !isDelivered

              return (
                <div key={step} className="flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        isCompleted
                          ? 'border-green-500 bg-green-500 text-white'
                          : isCurrent
                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                            : 'border-slate-300 bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isCompleted && <CheckCircle size={20} />}
                      {isCurrent && <Truck size={20} />}
                      {!isCompleted && !isCurrent && <Package size={20} />}
                    </div>
                    {idx < statusSteps.length - 1 && (
                      <div
                        className={`mt-2 h-12 w-1 ${
                          isCompleted || isCurrent ? 'bg-orange-500' : 'bg-slate-300'
                        }`}
                      />
                    )}
                  </div>

                  {/* Timeline content */}
                  <div className="pt-1">
                    <p
                      className={`font-semibold capitalize ${isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-500'}`}
                    >
                      {step.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-slate-600">
                      {step === 'pending' && 'Package awaiting pickup'}
                      {step === 'assigned' && 'Assigned to driver'}
                      {step === 'pickup' && 'Driver picking up from warehouse'}
                      {step === 'in_transit' && 'On the way to recipient'}
                      {step === 'delivered' && 'Delivered to recipient'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Sender & Recipient Info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Sender */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <User size={20} className="text-blue-600" />
            Sender Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-600">Name</p>
              <p className="font-semibold text-slate-900">{pkg.sender_name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Address</p>
              <p className="text-slate-900">{pkg.sender_address}</p>
            </div>
          </div>
        </div>

        {/* Recipient */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <MapPin size={20} className="text-orange-600" />
            Recipient Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-600">Name</p>
              <p className="font-semibold text-slate-900">{pkg.recipient_name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Address</p>
              <p className="text-slate-900">{pkg.recipient_address}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Coordinates</p>
              <p className="font-mono text-sm text-slate-900">
                {pkg.recipient_lat.toFixed(4)}, {pkg.recipient_lng.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Package Details</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Weight */}
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="flex items-center gap-2 text-sm text-blue-700">
              <Package size={18} />
              Weight
            </p>
            <p className="mt-2 text-2xl font-bold text-blue-900">{pkg.weight_kg} kg</p>
          </div>

          {/* Volume */}
          <div className="rounded-lg bg-purple-50 p-4">
            <p className="flex items-center gap-2 text-sm text-purple-700">
              <Package size={18} />
              Volume
            </p>
            <p className="mt-2 text-2xl font-bold text-purple-900">{pkg.volume_m3} m³</p>
          </div>

          {/* Priority */}
          <div className="rounded-lg bg-orange-50 p-4">
            <p className="flex items-center gap-2 text-sm text-orange-700">
              <AlertCircle size={18} />
              Priority
            </p>
            <p className="mt-2 text-2xl font-bold text-orange-900 capitalize">
              {pkg.priority.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Dates */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Timeline</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-slate-400" />
              <div>
                <p className="text-sm text-slate-600">Created</p>
                <p className="font-semibold text-slate-900">
                  {new Date(pkg.created_at).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-slate-400" />
              <div>
                <p className="text-sm text-slate-600">Estimated Delivery</p>
                <p className="font-semibold text-slate-900">
                  {new Date(pkg.estimated_delivery!).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          {pkg.actual_delivery && (
            <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600" />
                <div>
                  <p className="text-sm text-green-700">Actual Delivery</p>
                  <p className="font-semibold text-green-900">
                    {new Date(pkg.actual_delivery).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {pkg.failure_reason && (
            <div className="flex items-center justify-between rounded-lg bg-red-50 p-4">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-red-600" />
                <div>
                  <p className="text-sm text-red-700">Failure Reason</p>
                  <p className="font-semibold text-red-900">{pkg.failure_reason}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="flex-1 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-600 active:scale-[0.98]">
          📍 View on Map
        </button>
        <button className="flex-1 rounded-lg bg-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-300 active:scale-[0.98]">
          📋 Print Label
        </button>
        <button className="flex-1 rounded-lg bg-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-300 active:scale-[0.98]">
          💬 Contact Support
        </button>
      </div>
    </div>
  )
}
