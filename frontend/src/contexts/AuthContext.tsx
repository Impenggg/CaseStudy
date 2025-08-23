import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '@/types'
import LoadingOverlay from '@/components/LoadingOverlay'
import api from '@/services/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  loadingMessage?: string
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string, role?: string) => Promise<boolean>
  checkAuth: () => Promise<void>
  requireAuth: (redirectPath?: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>('Checking session...')

  // Normalize backend roles to frontend: 'weaver' -> 'artisan', 'customer' -> 'customer', legacy 'buyer' -> 'customer'
  const normalizeRole = (role?: string): string | undefined => {
    if (!role) return role
    const r = role.toLowerCase()
    if (r === 'weaver') return 'artisan'
    if (r === 'buyer') return 'customer'
    if (r === 'customer') return 'customer'
    return r
  }

  const normalizeUser = (u: any): User => ({ ...u, role: normalizeRole(u?.role) as any })

  useEffect(() => {
    const init = async () => {
      try {
        setLoadingMessage('Checking session...')
        const token = localStorage.getItem('auth_token')
        if (token) {
          // Always verify token and refresh user on init
          const { data } = await api.get('/user')
          const u = normalizeUser(data.data)
          setUser(u)
          localStorage.setItem('user', JSON.stringify(u))
        }
      } catch (e) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        setUser(null)
      } finally {
        setIsLoading(false)
        setLoadingMessage(undefined)
      }
    }
    init()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setLoadingMessage('Signing you in...')
      const { data } = await api.post('/login', { email, password })
      if (data.status === 'success') {
        const { user, token } = data.data
        const u = normalizeUser(user)
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(u))
        setUser(u)
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
      setLoadingMessage(undefined)
    }
  }

  const register = async (email: string, password: string, name: string, role: string = 'customer'): Promise<boolean> => {
    try {
      setIsLoading(true)
      setLoadingMessage('Creating your account...')
      // Map frontend 'artisan' to backend 'weaver'. Customers rely on backend default.
      const backendRole = role?.toLowerCase() === 'artisan' ? 'weaver' : (role?.toLowerCase() || 'customer')
      const normalizedEmail = email.trim().toLowerCase().replace(/\s+/g, '').normalize('NFKC')
      const normalizedName = name.trim().normalize('NFKC')
      const payload: any = { email: normalizedEmail, password, name: normalizedName }
      // Only include role if artisan (weaver). Buyers can rely on backend default
      if (backendRole === 'weaver') payload.role = backendRole
      if (import.meta.env.DEV) {
        // Debug payload in development only (no password value)
        const debugPayload = { ...payload, password: '***' }
        console.debug('Register payload:', debugPayload)
      }
      const { data } = await api.post('/register', payload)
      if (data.status === 'success') {
        const { user, token } = data.data
        const u = normalizeUser(user)
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(u))
        setUser(u)
        return true
      }
      return false
    } catch (error: any) {
      // Surface helpful server validation or error messages
      const resp = error?.response
      const backendErrors = resp?.data?.errors
      let message = resp?.data?.message || 'Registration failed. Please try again.'
      if (backendErrors && typeof backendErrors === 'object') {
        try {
          const list = Object.values(backendErrors).flat() as string[]
          if (list.length) message = list.join(' ')
        } catch {}
      }
      console.error('Registration failed:', resp?.data || error)
      throw new Error(message)
    } finally {
      setIsLoading(false)
      setLoadingMessage(undefined)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await api.post('/logout')
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      setUser(null)
    }
  }

  const checkAuth = async (): Promise<void> => {
    const token = localStorage.getItem('auth_token')
    if (!token) return
    try {
      const { data } = await api.get('/user')
      const u = normalizeUser(data.data)
      setUser(u)
      localStorage.setItem('user', JSON.stringify(u))
    } catch (e) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      setUser(null)
      throw e
    }
  }

  const requireAuth = (redirectPath: string = '/login'): boolean => {
    if (!user) {
      const intended = window.location.pathname + window.location.search + window.location.hash
      sessionStorage.setItem('intended_path', intended)
      window.location.href = redirectPath
      return false
    }
    return true
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    loadingMessage,
    login,
    logout,
    register,
    checkAuth,
    requireAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoadingOverlay show={isLoading} message={loadingMessage} />
    </AuthContext.Provider>
  )
}