import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const SupportsPage: React.FC = () => {
  const { requireAuth } = useAuth()

  useEffect(() => {
    requireAuth()
  }, [])

  return (
    <div className="min-h-[60vh] px-4 py-10 max-w-5xl mx-auto text-cordillera-cream">
      <h1 className="text-3xl font-serif mb-6">Support & Fundraising History</h1>
      <div className="rounded-lg border border-cordillera-gold/30 bg-cordillera-olive/40 p-6">
        <p className="text-cordillera-cream/80">
          Your campaign support contributions will appear here. This is a placeholder; connect to your backend to show supported campaigns, dates, and amounts.
        </p>
      </div>
    </div>
  )
}

export default SupportsPage
