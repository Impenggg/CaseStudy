import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { campaignsAPI } from '@/services/api'
import type { Campaign } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

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
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<{ category: string; status: string; sort_by: string; search: string }>({
    category: 'all',
    status: 'all',
    sort_by: 'newest',
    search: '',
  })

  // Inline CRUD state (for organizer/admin)
  const [editing, setEditing] = useState<Campaign | null>(null)
  const [form, setForm] = useState<Partial<Campaign>>({})
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

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

  const canManage = useMemo(() => {
    return Boolean(user && (((user as any).role === 'artisan') || ((user as any).role === 'admin') || ((user as any).role === 'weaver')))
  }, [user])

  // Build status options from existing campaigns plus common defaults
  const statusOptions = useMemo(() => {
    const set = new Set<string>(['active', 'completed'])
    ;(campaigns || []).forEach(c => {
      const v = (c.status || '').trim()
      if (v) set.add(v)
    })
    return Array.from(set)
  }, [campaigns])

  // Resolve image URLs that may be relative from the API
  const API_ORIGIN = (api.defaults.baseURL || '').replace(/\/api\/?$/, '')
  const resolveImage = (image?: string | null) => {
    if (!image) return ''
    if (image.startsWith('http://') || image.startsWith('https://')) return image
    return `${API_ORIGIN}/${String(image).replace(/^\/?/, '')}`
  }

  // Handlers: edit/save/delete campaign (organizer/admin only)
  const onEdit = (c: Campaign) => {
    setEditing(c)
    setForm({ title: c.title, description: c.description, goal_amount: c.goal_amount, status: c.status })
  }

  const onSave = async () => {
    if (!editing) return
    try {
      setSaving(true)
      await campaignsAPI.update(editing.id, {
        title: form.title ?? editing.title,
        description: form.description ?? editing.description,
        goal_amount: form.goal_amount ?? editing.goal_amount,
        status: form.status ?? editing.status,
      })
      // Optimistic update
      setCampaigns(prev => prev.map(c => c.id === editing.id ? {
        ...c,
        title: (form.title ?? editing.title) as any,
        description: (form.description ?? editing.description) as any,
        goal_amount: (form.goal_amount ?? editing.goal_amount) as any,
        status: (form.status ?? editing.status) as any,
      } : c))
      setEditing(null)
      setForm({})
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || 'Failed to update campaign')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (c: Campaign) => {
    if (!confirm(`Delete campaign "${c.title}"? This cannot be undone.`)) return
    try {
      setDeletingId(c.id)
      await campaignsAPI.delete(c.id)
      setCampaigns(prev => prev.filter(x => x.id !== c.id))
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || 'Failed to delete campaign')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-heritage-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-500 mx-auto mb-4"></div>
          <p className="text-heritage-800">Loading campaigns...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-heritage-800">
      {/* Header */}
            {/* Header */}
      <section className="relative py-24 bg-heritage-800 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-6">
            <span className="inline-block bg-heritage-500/20 text-heritage-500 px-4 py-2 text-sm font-medium uppercase tracking-wider mb-4 backdrop-blur-sm">Campaigns</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-light text-heritage-100 mb-8 tracking-wide">Campaigns</h1>
          <p className="text-xl md:text-2xl text-heritage-100/90 max-w-4xl mx-auto font-light leading-relaxed mb-8">Discover and support initiatives that preserve our cultural heritage.</p>
          <div className="flex justify-center items-center space-x-8 text-heritage-100/70">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-heritage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium">Transparency</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-heritage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium">Community Support</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-heritage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Heritage Preservation</span>
            </div>
          </div>
          {(user && (((user as any).role === 'artisan') || ((user as any).role === 'weaver'))) && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/create-campaign"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-heritage-500 text-heritage-800 font-semibold hover:bg-heritage-500/90 shadow-md transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Campaign
              </Link>
              <Link
                to="/my-campaigns"
                className="inline-flex items-center px-6 py-3 rounded-lg border border-heritage-100/40 text-heritage-100 hover:bg-white/10 font-semibold transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                </svg>
                My Campaigns
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-14 bg-heritage-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters removed per request; CTAs moved to hero */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 text-error-dark border border-error/30 rounded">{error}</div>
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
                      <span className="inline-block bg-heritage-800/90 text-heritage-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded">Campaign</span>
                    </div>
                    <CardContent className="pt-4 flex flex-col h-full">
                      <span className="text-heritage-500 text-[11px] font-medium uppercase tracking-wider">{c.category || 'Community'}</span>
                      <h3 className="text-lg font-serif text-heritage-800 mt-1 mb-2 leading-snug group-hover:text-heritage-500 transition-colors duration-300">{c.title}</h3>
                      <p className="text-heritage-800/70 text-[13px] leading-relaxed line-clamp-2 md:line-clamp-3">{c.description}</p>

                      <div className="mt-3 mb-4">
                        <div className="flex justify-between text-heritage-800/80 text-[13px] mb-1.5">
                          <span>{p.toFixed(0)}% funded</span>
                          <span>{currency(c.current_amount as any)}</span>
                        </div>
                        <div className="h-2 bg-brand-sage/30 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-heritage-500 rounded-full transition-all duration-500 ${p <= 0 ? 'opacity-0' : 'opacity-100'}`}
                            style={widthStyle}
                          />
                        </div>
                        <p className="text-[11px] text-heritage-800/60 mt-1">Goal: {currency(c.goal_amount as any)}</p>
                      </div>

                      <div className="mt-auto flex justify-between items-center text-[11px] text-heritage-800/60">
                        <span>Ends {endDisplay}</span>
                        <span>Backers: {c.backers_count || 0}</span>
                      </div>

                      {(user && (((user as any).role === 'admin') || ((user as any).id === (c as any).organizer_id))) && (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={(e) => { e.preventDefault(); onEdit(c) }}
                            className="px-3 py-1 text-xs rounded border border-brand-sage/50 hover:bg-heritage-100"
                          >
                            Edit
                          </button>
                          <button
                            disabled={deletingId === c.id}
                            onClick={(e) => { e.preventDefault(); onDelete(c) }}
                            className="px-3 py-1 text-xs rounded border border-error/30 text-error-dark hover:bg-error/10 disabled:opacity-60"
                          >
                            {deletingId === c.id ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-heritage-800 mb-4">Edit Campaign</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={form.title ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  rows={6}
                  value={form.description ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Goal Amount</label>
                <input
                  type="number"
                  value={form.goal_amount ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, goal_amount: Number(e.target.value) }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={form.status ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value || undefined }))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select status</option>
                  {statusOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => { setEditing(null); setForm({}) }} className="px-4 py-2 rounded border">Cancel</button>
              <button disabled={saving} onClick={onSave} className="px-4 py-2 rounded bg-heritage-500 text-heritage-800 font-semibold disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CampaignsPage

