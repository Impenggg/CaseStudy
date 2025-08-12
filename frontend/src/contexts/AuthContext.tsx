import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<boolean>
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

  useEffect(() => {
    // Check for existing session on app load
    const checkSession = () => {
      try {
        const authStatus = localStorage.getItem('cordillera_auth')
        const userString = localStorage.getItem('cordillera_user')
        
        if (authStatus === 'true' && userString) {
          const userData = JSON.parse(userString)
          setUser(userData)
        }
      } catch (error) {
        console.error('Session check failed:', error)
        // Clear corrupted session data
        localStorage.removeItem('cordillera_auth')
        localStorage.removeItem('cordillera_user')
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Basic validation
      if (!email || !password) {
        throw new Error('Please fill in all fields')
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address')
      }

      // Call login API
      const response = await fetch('http://localhost/CaseStudy/backend/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Store session
      localStorage.setItem('cordillera_user', JSON.stringify(data.user))
      localStorage.setItem('cordillera_auth', 'true')
      
      setUser(data.user)
      return true
      
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Basic validation
      if (!email || !password || !name) {
        throw new Error('Please fill in all fields')
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address')
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters')
      }

      // Call register API
      const response = await fetch('http://localhost/CaseStudy/backend/api/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      // Store session
      localStorage.setItem('cordillera_user', JSON.stringify(data.user))
      localStorage.setItem('cordillera_auth', 'true')
      
      setUser(data.user)
      return true
      
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('cordillera_user')
    localStorage.removeItem('cordillera_auth')
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}