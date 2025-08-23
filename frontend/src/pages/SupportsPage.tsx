import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { donationsAPI } from '@/services/api'
import type { Donation } from '@/types'

const SupportsPage: React.FC = () => {
  const { requireAuth } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])

  useEffect(() => {
    requireAuth()
    const fetchDonations = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await donationsAPI.getMyDonations()
        // Normalize possible shapes: { data: [...] } or [...]
        const items = Array.isArray(res) ? res : (res?.data ?? [])
        setDonations(items as Donation[])
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load support history')
      } finally {
        setIsLoading(false)
      }
    }
    fetchDonations()
  }, [])

  return (
    <div className="min-h-[60vh] px-4 py-10 max-w-5xl mx-auto text-cordillera-cream">
      <div className="mb-4">
        <Link to="/" className="inline-block bg-cordillera-gold text-cordillera-olive px-4 py-1.5 rounded hover:bg-cordillera-gold/90 transition-colors">← Back to Home</Link>
      </div>
      <h1 className="text-3xl font-serif mb-6">Support & Fundraising History</h1>
      <div className="rounded-lg border border-cordillera-gold/30 bg-cordillera-olive/40 p-6">
        {isLoading && (
          <p className="text-cordillera-cream/80">Loading your support history...</p>
        )}
        {!isLoading && error && (
          <p className="text-red-200">{error}</p>
        )}
        {!isLoading && !error && donations.length === 0 && (
          <p className="text-cordillera-cream/80">No support contributions yet.</p>
        )}
        {!isLoading && !error && donations.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-cordillera-cream/70">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Campaign</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2">Message</th>
                </tr>
              </thead>
              <tbody className="text-cordillera-cream/90">
                {donations.map((d) => (
                  <tr key={d.id} className="border-t border-cordillera-gold/20">
                    <td className="py-3 pr-4">{d.created_at ? new Date(d.created_at).toLocaleDateString() : '-'}</td>
                    <td className="py-3 pr-4">{d.campaign?.title ?? `#${d.campaign_id}`}</td>
                    <td className="py-3 pr-4">₱{Number(d.amount).toLocaleString()}</td>
                    <td className="py-3">{d.message || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default SupportsPage
