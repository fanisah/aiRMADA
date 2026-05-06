'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Periksa apakah user memiliki session valid
    const checkAuth = () => {
      const userSession = sessionStorage.getItem('user_session')
      const isLoginPage = pathname === '/login'
      const isPublicPage = pathname === '/'

      // Jika tidak ada session dan bukan di halaman publik/login, redirect ke login
      if (!userSession && !isLoginPage && !isPublicPage) {
        // Redirect segera tanpa delay
        router.replace('/login')
        setIsAuthenticated(false)
      } else if (userSession && isLoginPage) {
        // Jika sudah login tapi di halaman login, redirect ke dashboard
        router.replace('/overview')
        setIsAuthenticated(true)
      } else if (userSession) {
        // User terautentikasi
        setIsAuthenticated(true)
      } else {
        // User tidak terautentikasi di halaman publik
        setIsAuthenticated(false)
      }

      setIsLoading(false)
    }

    // Check immediately without delay
    checkAuth()
  }, [pathname, router])

  const logout = async () => {
    try {
      // Call logout API endpoint
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Hapus semua auth-related data dari client
      sessionStorage.removeItem('user_session')
      sessionStorage.removeItem('remembered_email')

      // Redirect ke login dengan replace untuk menghindari browser back
      router.replace('/login')
      setIsAuthenticated(false)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
