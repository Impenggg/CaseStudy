import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { campaignsAPI } from '@/services/api'
import type { Campaign } from '@/types'
import { Card, CardContent } from '@/components/ui/card'

const currency = (v: number | string | undefined) => {
  const n = Number(v || 0)
  return `₱${n.toLocaleString()}`
}

function pct(current?: number, goal?: number) {
  const c = Number(current || 0)
  const g = Number(goal || 0)
  if (!g) return 0
  return Math.min(100, (c / g) * 100)
}

const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<{ category: string; status: string; sort_by: string; search: string }>({
    category: 'all',
    status: 'all',
    sort_by: 'newest',
    search: '',
  })

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await campaignsAPI.getAll({ per_page: 'all' })
        const list: any[] = Array.isArray((res as any)?.data) ? (res as any).data : (Array.isArray(res) ? res : (res as any)?.data?.data || [])
        const mapped: Campaign[] = list.map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          goal_amount: Number(c.goal_amount ?? 0),
          current_amount: Number(c.current_amount ?? 0),
          backers_count: Number(c.backers_count ?? 0),
          status: c.status,
          end_date: c.end_date,
          organizer_id: c.organizer?.id,
          organizer: c.organizer,
          image: c.image,
          category: c.category,
          created_at: c.created_at,
          updated_at: c.updated_at,
        }))
        if (mounted) setCampaigns(mapped)
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load campaigns')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const categories = useMemo(() => ['all', ...Array.from(new Set((campaigns || []).map(c => c.category || '')))], [campaigns])

  const filtered = useMemo(() => {
    let list = [...campaigns]
    if (filters.category !== 'all') list = list.filter(c => (c.category || '') === filters.category)
    if (filters.status !== 'all') list = list.filter(c => (c.status || '') === filters.status)
    const s = filters.search.trim().toLowerCase()
    if (s) list = list.filter(c => (c.title || '').toLowerCase().includes(s) || (c.description || '').toLowerCase().includes(s))
    switch (filters.sort_by) {
      case 'ending_soon':
        list.sort((a, b) => new Date(a.end_date || '').getTime() - new Date(b.end_date || '').getTime())
        break
      case 'most_funded':
        list.sort((a, b) => Number(b.current_amount || 0) - Number(a.current_amount || 0))
        break
      default:
        list.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    }
    return list
  }, [campaigns, filters])

  // Resolve image URLs that may be relative from the API
  const API_ORIGIN = (api.defaults.baseURL || '').replace(/\/api\/?$/, '')
  const resolveImage = (image?: string | null) => {
    if (!image) return ''
    if (image.startsWith('http://') || image.startsWith('https://')) return image
    return `${API_ORIGIN}/${String(image).replace(/^\/?/, '')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cordillera-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cordillera-gold mx-auto mb-4"></div>
          <p className="text-cordillera-olive">Loading campaigns...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cordillera-olive">
      {/* Header */}
            {/* Header */}
      <section className="relative py-24 bg-cordillera-olive overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-6">
            <span className="inline-block bg-cordillera-gold/20 text-cordillera-gold px-4 py-2 text-sm font-medium uppercase tracking-wider mb-4 backdrop-blur-sm">Campaigns</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-light text-cordillera-cream mb-8 tracking-wide">Campaigns</h1>
          <p className="text-xl md:text-2xl text-cordillera-cream/90 max-w-4xl mx-auto font-light leading-relaxed mb-8">Discover and support initiatives that preserve our cultural heritage.</p>
          <div className="flex justify-center items-center space-x-8 text-cordillera-cream/70">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium">Transparency</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium">Community Support</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Heritage Preservation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-14 bg-cordillera-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="md:col-span-2 px-4 py-2 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
            />
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2 border border-cordillera-olive/20 rounded-lg"
            >
              {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
            </select>
            <select
              value={filters.sort_by}
              onChange={(e) => setFilters(prev => ({ ...prev, sort_by: e.target.value }))}
              className="px-4 py-2 border border-cordillera-olive/20 rounded-lg"
            >
              <option value="newest">Newest</option>
              <option value="ending_soon">Ending Soon</option>
              <option value="most_funded">Most Funded</option>
            </select>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filtered.map((c) => {
              const p = pct(c.current_amount as any, c.goal_amount as any)
              const widthStyle: React.CSSProperties = p <= 0
                ? { width: '0%' }
                : (p < 3 ? { width: '12px' } : { width: `${p}%` })
              const endDisplay = (() => {
                try {
                  const d = c.end_date ? new Date(c.end_date) : null
                  return d && !isNaN(d.getTime()) ? d.toLocaleDateString() : '—'
                } catch { return '—' }
              })()
              return (
                <Card key={c.id} className="group block overflow-hidden h-full">
                  <Link to={`/campaigns/${c.id}`} className="block h-full">
                    <div className="px-6 pt-6">
                      <span className="inline-block bg-cordillera-olive/90 text-cordillera-cream px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded">Campaign</span>
                    </div>
                    <CardContent className="pt-4 flex flex-col h-full">
                      <span className="text-cordillera-gold text-[11px] font-medium uppercase tracking-wider">{c.category || 'Community'}</span>
                      <h3 className="text-lg font-serif text-cordillera-olive mt-1 mb-2 leading-snug group-hover:text-cordillera-gold transition-colors duration-300">{c.title}</h3>
                      <p className="text-cordillera-olive/70 text-[13px] leading-relaxed line-clamp-2 md:line-clamp-3">{c.description}</p>

                      <div className="mt-3 mb-4">
                        <div className="flex justify-between text-cordillera-olive/80 text-[13px] mb-1.5">
                          <span>{p.toFixed(0)}% funded</span>
                          <span>{currency(c.current_amount as any)}</span>
                        </div>
                        <div className="h-2 bg-cordillera-sage/30 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-cordillera-gold rounded-full transition-all duration-500 ${p <= 0 ? 'opacity-0' : 'opacity-100'}`}
                            style={widthStyle}
                          />
                        </div>
                        <p className="text-[11px] text-cordillera-olive/60 mt-1">Goal: {currency(c.goal_amount as any)}</p>
                      </div>

                      <div className="mt-auto flex justify-between items-center text-[11px] text-cordillera-olive/60">
                        <span>Ends {endDisplay}</span>
                        <span>Backers: {c.backers_count || 0}</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default CampaignsPage

