import { useState, useEffect } from 'react'

export type UserRole = 'MANAGER' | 'DRIVER' | 'DISPATCHER'

interface UserSession {
  user: {
    id: string
    full_name: string
    short_name: string
    role: UserRole
    cell_phone: string
  }
  email: string
  loginTime: string
}

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionData = sessionStorage.getItem('user_session')
    if (sessionData) {
      try {
        const session: UserSession = JSON.parse(sessionData)
        setRole(session.user.role)
      } catch (error) {
        console.error('Failed to parse user session:', error)
      }
    }
    setLoading(false)
  }, [])

  return { role, loading }
}
