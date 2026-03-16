export type VehicleType = 'motor' | 'pickup' | 'van' | 'truck'
export type VehicleStatus = 'idle' | 'active' | 'maintenance' | 'offline'

export interface Vehicle {
  id: string
  plate_number: string
  type: VehicleType
  capacity_kg: number
  capacity_volume_m3: number
  status: VehicleStatus
  fuel_type: string
  year: number
  notes?: string
  created_at: string
  updated_at: string
}