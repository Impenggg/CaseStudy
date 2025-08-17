import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string, role?: string) => Promise<boolean>
  checkAuth: () => Promise<void>
  requireAuth: (redirectPath?: string) => boolean
}

// Configure axios defaults
const API_BASE_URL = 'http://localhost:8000/api'
axios.defaults.baseURL = API_BASE_URL
// We use bearer tokens, not cookies. Avoid cross-site cookies to match CORS (supports_credentials=false)
axios.defaults.withCredentials = false

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

  // Attach bearer token if present
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
    return () => axios.interceptors.request.eject(interceptor)
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          // Always verify token and refresh user on init
          const { data } = await axios.get('/user')
          setUser(data.data)
          localStorage.setItem('user', JSON.stringify(data.data))
        }
      } catch (e) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const { data } = await axios.post('/login', { email, password })
      if (data.status === 'success') {
        const { user, token } = data.data
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
        return true
      }
      return false
      
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, role: string = 'buyer'): Promise<boolean> => {
    try {
      setIsLoading(true)
      const { data } = await axios.post('/register', { email, password, name, role })
      if (data.status === 'success') {
        const { user, token } = data.data
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
        return true
      }
      return false
      
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await axios.post('/logout')
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
      const { data } = await axios.get('/user')
      setUser(data.data)
      localStorage.setItem('user', JSON.stringify(data.data))
    } catch (e) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      setUser(null)
      throw e
    }
  }

  const requireAuth = (redirectPath: string = '/login'): boolean => {
    if (!user) {
      sessionStorage.setItem('intended_path', window.location.pathname + window.location.search)
      window.location.href = redirectPath
      return false
    }
    return true
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    checkAuth,
    requireAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}