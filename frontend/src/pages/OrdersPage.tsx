import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const OrdersPage: React.FC = () => {
  const { requireAuth } = useAuth()

  useEffect(() => {
    requireAuth()
  }, [])

  return (
    <div className="min-h-[60vh] px-4 py-10 max-w-5xl mx-auto text-cordillera-cream">
      <h1 className="text-3xl font-serif mb-6">Orders & Purchase History</h1>
      <div className="rounded-lg border border-cordillera-gold/30 bg-cordillera-olive/40 p-6">
        <p className="text-cordillera-cream/80">
          Your past orders will appear here. This is a placeholder; connect to your backend orders endpoint to list recent purchases, statuses, and details.
        </p>
      </div>
    </div>
  )
}

export default OrdersPage
