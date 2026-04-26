export type UserRole = 'MANAGER' | 'DISPATCHER' | 'DRIVER';

export interface User {
  id: string
  full_name: string
  short_name: string
  role: UserRole
  cell_phone: string
}