import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { storiesAPI } from '@/services/api'
import type { Story } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import BackLink from '@/components/BackLink'

const MyStoriesPage: React.FC = () => {
  const { user, requireAuth } = useAuth()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Story[]>([])
  const [error, setError] = useState<string | null>(null)

  const [editing, setEditing] = useState<Story | null>(null)
  const [form, setForm] = useState<Partial<Story>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    requireAuth()
  }, [])

  const canManage = useMemo(() => !!user && (user.role === 'artisan' || user.role === 'admin' || user.role === 'weaver'), [user])

  const load = async () => {
    try {
      setLoading(true)
      const res = await storiesAPI.getMyStories()
      // Expecting { data: Story[] }
      setItems(res.data || [])
    } catch (e: any) {
      setError(e?.message || 'Failed to load your stories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onEdit = (story: Story) => {
    setEditing(story)
    setForm({ title: story.title, body: story.body ?? story.content ?? '' })
  }

  const onSave = async () => {
    if (!editing) return
    try {
      setSaving(true)
      await storiesAPI.update(editing.id, {
        title: form.title ?? editing.title,
        body: form.body ?? editing.body,
      })
      setEditing(null)
      setForm({})
      await load()
    } catch (e: any) {
      alert(e?.message || 'Failed to update story')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (story: Story) => {
    const ok = confirm(`Delete story "${story.title}"? This cannot be undone.`)
    if (!ok) return
    try {
      await storiesAPI.delete(story.id)
      await load()
    } catch (e: any) {
      alert(e?.message || 'Failed to delete story')
    }
  }

  return (
    <div className="min-h-screen bg-cordillera-olive">
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <BackLink to="/stories" variant="light" className="mb-4">Back to Stories</BackLink>
      </div>
      <div className="px-4 pb-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-serif text-cordillera-cream">My Stories</h1>
          {canManage && (
            <Link
              to="/submit-story"
              className="bg-cordillera-gold text-cordillera-olive px-4 py-2 rounded hover:bg-cordillera-gold/90"
            >
              Submit Story
            </Link>
          )}
        </div>
      </div>

      <div className="px-4 pb-10 max-w-6xl mx-auto">
        {loading ? (
          <div className="text-cordillera-cream/80">Loading…</div>
        ) : error ? (
          <div className="text-red-300">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-cordillera-cream/80">You haven't posted any stories yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((s) => (
              <div key={s.id} className="bg-white rounded-lg shadow border border-cordillera-sage/30 overflow-hidden">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-cordillera-olive line-clamp-2">{s.title}</h3>
                  <div className="mt-2 text-sm text-cordillera-olive/70 line-clamp-3">{(s.excerpt || s.body || s.content || '').toString()}</div>
                  {(s as any).moderation_status && (
                    <div className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                      (s as any).moderation_status === 'approved' ? 'bg-green-100 text-green-800' :
                      (s as any).moderation_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {(s as any).moderation_status === 'approved' ? 'Approved' :
                       (s as any).moderation_status === 'pending' ? 'Pending Review' :
                       'Rejected'}
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    {canManage && (
                      <>
                        <button onClick={() => onEdit(s)} className="px-3 py-1 text-sm rounded bg-cordillera-gold text-cordillera-olive hover:bg-cordillera-gold/90">Edit</button>
                        <button onClick={() => onDelete(s)} className="px-3 py-1 text-sm rounded border border-red-200 text-red-700 hover:bg-red-50">Delete</button>
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
            <h2 className="text-xl font-semibold text-cordillera-olive mb-4">Edit Story</h2>
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
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  rows={6}
                  value={form.body ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
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

export default MyStoriesPage
