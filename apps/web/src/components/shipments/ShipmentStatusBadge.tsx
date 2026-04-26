/**
 * Badge warna untuk setiap ShipmentStatus.
 *
 * @location apps/web/src/components/shipments/ShipmentStatusBadge.tsx
 * TODO: Map status → warna: pending=gray, in_transit=blue, delivered=green, failed=red
 */
import type { ShipmentStatus } from '@airmada/types'

type Props = { status: ShipmentStatus }

const COLOR: Record<ShipmentStatus, string> = {
  pending: 'bg-gray-100 text-gray-600',
  assigned: 'bg-yellow-100 text-yellow-700',
  pickup: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  returned: 'bg-purple-100 text-purple-700',
}

export function ShipmentStatusBadge({ status }: Props) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${COLOR[status]}`}>
      {status}
    </span>
  )
}
