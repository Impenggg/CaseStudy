import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api, { ordersAPI, productsAPI, storiesAPI, campaignsAPI, donationsAPI } from '@/services/api'

type Purchase = any
type Donation = any
type MyProduct = any
type MyStory = any
type MyCampaign = any

const AccountPage: React.FC = () => {
  const { user, requireAuth } = useAuth()

  // Resolve API origin for image URLs
  const API_ORIGIN = useMemo(() => (api.defaults.baseURL || '').replace(/\/api\/?$/, ''), [])
  const resolveUrl = (u?: string | null) => {
    if (!u) return ''
    if (u.startsWith('http://') || u.startsWith('https://')) return u
    return `${API_ORIGIN}/${u.replace(/^\/?/, '')}`
  }
  const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="9" fill="#6b7280">No Image</text></svg>`
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [myProducts, setMyProducts] = useState<MyProduct[]>([])
  const [myStories, setMyStories] = useState<MyStory[]>([])
  const [myCampaigns, setMyCampaigns] = useState<MyCampaign[]>([])
  const pollRef = useRef<number | null>(null)
  const [storiesViewed, setStoriesViewed] = useState<number>(() => {
    const v = Number(localStorage.getItem('stories_viewed_count') || '0')
    return Number.isFinite(v) ? v : 0
  })

  const normalizeList = (res: any): any[] => {
    if (Array.isArray(res)) return res
    if (Array.isArray(res?.data)) return res.data
    if (Array.isArray(res?.data?.data)) return res.data.data
    return []
  }

  const fetchData = async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      if (user.role === 'artisan' || user.role === 'admin') {
        const [prods, stories, camps] = await Promise.all([
          productsAPI.getMyProducts(),
          storiesAPI.getMyStories(),
          campaignsAPI.getMyCampaigns(),
        ])
        setMyProducts(normalizeList(prods))
        setMyStories(normalizeList(stories))
        setMyCampaigns(normalizeList(camps))
      } else {
        const [ords, dons] = await Promise.all([
          ordersAPI.getMyOrders(),
          donationsAPI.getMyDonations(),
        ])
        setPurchases(normalizeList(ords))
        setDonations(normalizeList(dons))
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load activity')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    requireAuth()
  }, [])

  useEffect(() => {
    fetchData()
    // Poll every 5s for near real-time updates
    if (pollRef.current) window.clearInterval(pollRef.current)
    pollRef.current = window.setInterval(fetchData, 5000)
    // Listen to localStorage changes for cross-tab updates and a same-tab custom event
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'stories_viewed_count') {
        const v = Number(e.newValue || '0')
        setStoriesViewed(Number.isFinite(v) ? v : 0)
      }
      if (e.key === 'account_refresh') {
        // Trigger immediate refetch for realtime counters like donations
        fetchData()
      }
    }
    const onCustom = () => { fetchData() }
    window.addEventListener('storage', onStorage)
    window.addEventListener('account_refresh', onCustom as any)
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('account_refresh', onCustom as any)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.role])

  return (
    <div className="min-h-[60vh] px-4 py-10 max-w-5xl mx-auto text-cordillera-cream">
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

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-cordillera-cream/5 border border-cordillera-gold/20">
              <div className="text-cordillera-cream/70 text-sm">Role</div>
              <div className="text-cordillera-cream">{user.role || 'member'}</div>
            </div>
            <div className="p-4 bg-cordillera-cream/5 border border-cordillera-gold/20">
              <div className="text-cordillera-cream/70 text-sm">User ID</div>
              <div className="text-cordillera-cream">{user.id}</div>
            </div>
          </div>

          {loading && (
            <div className="text-cordillera-cream/70">Refreshing recent activity…</div>
          )}
          {error && (
            <div className="text-red-300">{error}</div>
          )}

          {/* Community Impact (Realtime) */}
          {user.role === 'artisan' || user.role === 'admin' ? (
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-cordillera-olive/60 border border-cordillera-cream/10">
                <div className="text-cordillera-cream/80">Products</div>
                <div className="text-2xl font-serif">{myProducts.length}</div>
              </div>
              <div className="p-4 bg-cordillera-olive/60 border border-cordillera-cream/10">
                <div className="text-cordillera-cream/80">Stories</div>
                <div className="text-2xl font-serif">{myStories.length}</div>
              </div>
              <div className="p-4 bg-cordillera-olive/60 border border-cordillera-cream/10">
                <div className="text-cordillera-cream/80">Active Campaigns</div>
                <div className="text-2xl font-serif">{myCampaigns.filter((c: any) => (c.status || '').toLowerCase() !== 'completed').length}</div>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-cordillera-olive/60 border border-cordillera-cream/10">
                <div className="text-cordillera-cream/80">Pending Orders</div>
                <div className="text-2xl font-serif">{purchases.filter((o: any) => (o.status || '').toLowerCase() === 'pending').length}</div>
              </div>
              <div className="p-4 bg-cordillera-olive/60 border border-cordillera-cream/10">
                <div className="text-cordillera-cream/80">Stories Viewed</div>
                <div className="text-2xl font-serif">{storiesViewed}</div>
              </div>
              <div className="p-4 bg-cordillera-olive/60 border border-cordillera-cream/10">
                <div className="text-cordillera-cream/80">Total Campaigns Supported</div>
                <div className="text-2xl font-serif">{donations.length}</div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {user.role === 'artisan' || user.role === 'admin' ? (
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-serif mb-3">Recently Added Products</h2>
                <div className="space-y-3">
                  {myProducts.slice(0, 5).map((p: any) => {
                    const raw = p.image_url || p.image || p.thumbnail
                    const src = resolveUrl(raw) || PLACEHOLDER_IMG
                    return (
                      <div key={p.id} className="flex items-center gap-3 bg-cordillera-olive/30 p-3 border border-cordillera-cream/10">
                        <img src={src} alt={p.name} className="w-10 h-10 object-cover rounded" onError={(e) => { const t=e.currentTarget; if (t.src!==PLACEHOLDER_IMG) t.src=PLACEHOLDER_IMG }} />
                        <div className="flex-1">
                          <div className="font-medium">{p.name}</div>
                          <div className="text-sm text-cordillera-cream/70">₱{Number(p.price ?? 0).toLocaleString()}</div>
                        </div>
                        {p.created_at && (
                          <div className="text-xs text-cordillera-cream/60">{new Date(p.created_at).toLocaleString()}</div>
                        )}
                      </div>
                    )
                  })}
                  {myProducts.length === 0 && (
                    <div className="text-cordillera-cream/60">No products yet.</div>
                  )}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-serif mb-3">Recent Stories</h2>
                <div className="space-y-3">
                  {myStories.slice(0, 5).map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between bg-cordillera-olive/30 p-3 border border-cordillera-cream/10">
                      <div className="font-medium">{s.title}</div>
                      {s.created_at && <div className="text-xs text-cordillera-cream/60">{new Date(s.created_at).toLocaleString()}</div>}
                    </div>
                  ))}
                  {myStories.length === 0 && (
                    <div className="text-cordillera-cream/60">No stories yet.</div>
                  )}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-serif mb-3">Recent Campaigns</h2>
                <div className="space-y-3">
                  {myCampaigns.slice(0, 5).map((c: any) => {
                    const raw = c.image_url || c.image
                    const src = resolveUrl(raw) || PLACEHOLDER_IMG
                    return (
                      <div key={c.id} className="flex items-center gap-3 bg-cordillera-olive/30 p-3 border border-cordillera-cream/10">
                        <img src={src} alt={c.title} className="w-10 h-10 object-cover rounded" onError={(e) => { const t=e.currentTarget; if (t.src!==PLACEHOLDER_IMG) t.src=PLACEHOLDER_IMG }} />
                        <div className="flex-1">
                          <div className="font-medium">{c.title}</div>
                          <div className="text-sm text-cordillera-cream/70">Goal ₱{Number(c.goal_amount ?? 0).toLocaleString()}</div>
                        </div>
                        {c.created_at && (
                          <div className="text-xs text-cordillera-cream/60">{new Date(c.created_at).toLocaleString()}</div>
                        )}
                      </div>
                    )
                  })}
                  {myCampaigns.length === 0 && (
                    <div className="text-cordillera-cream/60">No campaigns yet.</div>
                  )}
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-serif mb-3">Recent Purchases</h2>
                <div className="space-y-3">
                  {purchases.slice(0, 5).map((o: any) => {
                    const p = o.product || {}
                    const raw = p.image_url || p.image
                    const src = resolveUrl(raw) || PLACEHOLDER_IMG
                    return (
                      <div key={o.id} className="flex items-center gap-3 bg-cordillera-olive/30 p-3 border border-cordillera-cream/10">
                        <img src={src} alt={p.name || `#${o.product_id}`} className="w-10 h-10 object-cover rounded" onError={(e) => { const t=e.currentTarget; if (t.src!==PLACEHOLDER_IMG) t.src=PLACEHOLDER_IMG }} />
                        <div className="flex-1">
                          <div className="font-medium">{p.name || `Product #${o.product_id}`}</div>
                          <div className="text-sm text-cordillera-cream/70">Qty {o.quantity}</div>
                        </div>
                        {o.created_at && (
                          <div className="text-xs text-cordillera-cream/60">{new Date(o.created_at).toLocaleString()}</div>
                        )}
                      </div>
                    )
                  })}
                  {purchases.length === 0 && (
                    <div className="text-cordillera-cream/60">No purchases yet.</div>
                  )}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-serif mb-3">Supported Campaigns</h2>
                <div className="space-y-3">
                  {donations.slice(0, 5).map((d: any) => (
                    <div key={d.id} className="flex items-center justify-between bg-cordillera-olive/30 p-3 border border-cordillera-cream/10">
                      <div className="font-medium">{d.campaign?.title || `Campaign #${d.campaign_id}`}</div>
                      <div className="text-sm text-cordillera-cream/70">₱{Number(d.amount ?? 0).toLocaleString()}</div>
                      {d.created_at && <div className="text-xs text-cordillera-cream/60">{new Date(d.created_at).toLocaleString()}</div>}
                    </div>
                  ))}
                  {donations.length === 0 && (
                    <div className="text-cordillera-cream/60">No supported campaigns yet.</div>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default AccountPage
