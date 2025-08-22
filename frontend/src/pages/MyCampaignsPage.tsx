import React, { useEffect, useMemo, useState } from 'react'
import { campaignsAPI } from '@/services/api'
import type { Campaign } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import BackLink from '@/components/BackLink'

const MyCampaignsPage: React.FC = () => {
  const { user, requireAuth } = useAuth()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Campaign[]>([])
  const [error, setError] = useState<string | null>(null)

  const [editing, setEditing] = useState<Campaign | null>(null)
  const [form, setForm] = useState<Partial<Campaign>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    requireAuth()
  }, [])

  const canManage = useMemo(() => !!user && (user.role === 'artisan' || user.role === 'admin' || user.role === 'weaver'), [user])

  const load = async () => {
    try {
      setLoading(true)
      const res = await campaignsAPI.getMyCampaigns()
      setItems(res.data || [])
    } catch (e: any) {
      setError(e?.message || 'Failed to load your campaigns')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onEdit = (c: Campaign) => {
    setEditing(c)
    setForm({ title: c.title, description: c.description, goal_amount: c.goal_amount })
  }

  const onSave = async () => {
    if (!editing) return
    try {
      setSaving(true)
      await campaignsAPI.update(editing.id, {
        title: form.title ?? editing.title,
        description: form.description ?? editing.description,
        goal_amount: form.goal_amount ?? editing.goal_amount,
      })
      setEditing(null)
      setForm({})
      await load()
    } catch (e: any) {
      alert(e?.message || 'Failed to update campaign')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (c: Campaign) => {
    const ok = confirm(`Delete campaign "${c.title}"? This cannot be undone.`)
    if (!ok) return
    try {
      await campaignsAPI.delete(c.id)
      await load()
    } catch (e: any) {
      alert(e?.message || 'Failed to delete campaign')
    }
  }

  return (
    <div className="min-h-screen bg-cordillera-olive">
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <BackLink to="/stories" variant="light" className="mb-4">Back to Stories & Campaigns</BackLink>
      </div>
      <div className="px-4 pb-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-serif text-cordillera-cream">My Campaigns</h1>
      </div>

      <div className="px-4 pb-10 max-w-6xl mx-auto">
        {loading ? (
          <div className="text-cordillera-cream/80">Loading…</div>
        ) : error ? (
          <div className="text-red-300">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-cordillera-cream/80">You haven't created any campaigns yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((c) => (
              <div key={c.id} className="bg-white rounded-lg shadow border border-cordillera-sage/30 overflow-hidden">
                {c.image ? (
                  <img src={c.image} alt={c.title} className="w-full h-40 object-cover" />
                ) : null}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-cordillera-olive line-clamp-2">{c.title}</h3>
                  <div className="mt-2 text-sm text-cordillera-olive/70 line-clamp-3">{c.description}</div>
                  <div className="mt-3 text-sm text-cordillera-olive/70">
                    Goal: {c.goal_amount ? `₱${Number(c.goal_amount).toLocaleString()}` : '—'}
                  </div>
                  <div className="mt-4 flex gap-2">
                    {canManage && (
                      <>
                        <button onClick={() => onEdit(c)} className="px-3 py-1 text-sm rounded bg-cordillera-gold text-cordillera-olive hover:bg-cordillera-gold/90">Edit</button>
                        <button onClick={() => onDelete(c)} className="px-3 py-1 text-sm rounded border border-red-200 text-red-700 hover:bg-red-50">Delete</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-cordillera-olive mb-4">Edit Campaign</h2>
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
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => { setEditing(null); setForm({}) }} className="px-4 py-2 rounded border">Cancel</button>
              <button disabled={saving} onClick={onSave} className="px-4 py-2 rounded bg-cordillera-gold text-cordillera-olive font-semibold disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyCampaignsPage
