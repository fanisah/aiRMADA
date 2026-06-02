import { z } from 'zod'

export const CreateVehicleSchema = z.object({
  plate_number: z.string().regex(/^[A-Z]{1,2}\s\d{1,4}\s[A-Z]{1,3}$/, 'Format plat tidak valid'),
  type: z.enum(['MOTOR', 'PICKUP', 'VAN', 'TRUCK']),
  capacity_kg: z.number().positive(),
  capacity_m3: z.number().positive(),
  fuel_type: z.enum(['GAS', 'DIESEL', 'ELECTRIC', 'HYBRID']),
  year: z.number().int().min(2000).max(new Date().getFullYear()),
  notes: z.string().optional(),
})

export type CreateVehicleInput = z.infer<typeof CreateVehicleSchema>
