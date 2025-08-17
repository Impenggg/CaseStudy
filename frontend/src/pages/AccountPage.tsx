import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const AccountPage: React.FC = () => {
  const { user, requireAuth } = useAuth()

  useEffect(() => {
    requireAuth()
  }, [])

  return (
    <div className="min-h-[60vh] px-4 py-10 max-w-4xl mx-auto text-cordillera-cream">
      <h1 className="text-3xl font-serif mb-6">Account Information</h1>
      {user ? (
        <div className="rounded-lg border border-cordillera-gold/30 bg-cordillera-olive/40 p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-cordillera-gold text-cordillera-olive flex items-center justify-center font-bold text-lg">
              {(user.name || user.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-lg">{user.name || 'Unnamed User'}</div>
              <div className="text-cordillera-cream/70 text-sm">{user.email}</div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-cordillera-cream/5 border border-cordillera-gold/20">
              <div className="text-cordillera-cream/70 text-sm">Role</div>
              <div className="text-cordillera-cream">{user.role || 'member'}</div>
            </div>
            <div className="p-4 bg-cordillera-cream/5 border border-cordillera-gold/20">
              <div className="text-cordillera-cream/70 text-sm">User ID</div>
              <div className="text-cordillera-cream">{user.id}</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AccountPage
