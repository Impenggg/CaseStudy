import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api, { ordersAPI } from '../services/api'

type OrderListItem = {
  id: number
  product_id: number
  quantity: number
  total_amount?: number
  total_price?: number
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at?: string
  product?: { id: number; name?: string; image?: string | null; price?: number }
}

const OrdersPage: React.FC = () => {
  const { requireAuth } = useAuth()
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Derive API origin (e.g., http://localhost:8000) from axios baseURL (e.g., http://localhost:8000/api)
  const API_ORIGIN = useMemo(() => (api.defaults.baseURL || '').replace(/\/api\/?$/, ''), [])
  const resolveUrl = (u?: string | null) => {
    if (!u) return ''
    if (u.startsWith('http://') || u.startsWith('https://')) return u
    return `${API_ORIGIN}/${u.replace(/^\/?/, '')}`
  }
  const PLACEHOLDER_IMG = 'https://via.placeholder.com/64?text=%20'

  useEffect(() => {
    requireAuth()
  }, [])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await ordersAPI.getMyOrders()
        const list: OrderListItem[] = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])
        if (!mounted) return
        setOrders(list)
      } catch (e: any) {
        if (!mounted) return
        setError(e?.response?.data?.message || e?.message || 'Failed to load orders')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const statusBadge = (status?: string) => {
    const base = 'px-2 py-0.5 rounded-full text-[11px] font-medium'
    switch (status) {
      case 'pending': return `${base} bg-yellow-100 text-yellow-800`
      case 'processing': return `${base} bg-blue-100 text-blue-800`
      case 'shipped': return `${base} bg-indigo-100 text-indigo-800`
      case 'delivered': return `${base} bg-green-100 text-green-800`
      case 'cancelled': return `${base} bg-red-100 text-red-800`
      default: return `${base} bg-gray-100 text-gray-700`
    }
  }

  return (
    <div className="min-h-[60vh] px-4 py-10 max-w-5xl mx-auto text-cordillera-cream">
      <div className="mb-4">
        <Link to="/" className="inline-block bg-cordillera-gold text-cordillera-olive px-4 py-1.5 rounded hover:bg-cordillera-gold/90 transition-colors">← Back to Home</Link>
      </div>
      <h1 className="text-3xl font-serif mb-6">Orders & Purchase History</h1>

      {loading && (
        <div className="rounded-lg border border-cordillera-gold/30 bg-cordillera-olive/40 p-6">Loading orders…</div>
      )}

      {error && (
        <div className="rounded-lg border border-red-400/40 bg-red-900/30 p-6 text-red-100">{error}</div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="rounded-lg border border-cordillera-gold/30 bg-cordillera-olive/40 p-6">
          <p className="text-cordillera-cream/80">You have no orders yet.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((o) => {
            const total = typeof o.total_amount === 'number' ? o.total_amount : (typeof o.total_price === 'number' ? o.total_price : 0)
            return (
              <Link
                key={o.id}
                to={`/orders/${o.id}`}
                className="block bg-cordillera-olive/40 hover:bg-cordillera-olive/50 transition-colors rounded-lg border border-cordillera-gold/30 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-cordillera-sage/20 rounded overflow-hidden flex items-center justify-center">
                    {(() => {
                      const raw = (o.product as any)?.image_url || (o.product as any)?.image || null
                      const src = resolveUrl(raw)
                      const finalSrc = src || PLACEHOLDER_IMG
                      return (
                        <img
                          src={finalSrc}
                          alt={o.product?.name || `Product #${o.product_id}`}
                          className="w-full h-full object-cover"
                          title={finalSrc}
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement
                            if (target.src !== PLACEHOLDER_IMG) target.src = PLACEHOLDER_IMG
                          }}
                        />
                      )
                    })()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{o.product?.name || `Order`}</div>
                      <div className="text-cordillera-gold">₱{Number(total).toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-cordillera-cream/70 mt-1 flex items-center gap-2">
                      <span>Qty: {o.quantity}</span>
                      {o.status && <span className={statusBadge(o.status)}>{o.status}</span>}
                      {o.created_at && <span className="ml-auto">{new Date(o.created_at).toLocaleString()}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OrdersPage
