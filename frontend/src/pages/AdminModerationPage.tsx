import React, { useEffect, useMemo, useState } from 'react'
import { adminModerationAPI } from '@/services/api'

type ContentType = 'products' | 'stories' | 'campaigns' | 'media-posts' | 'media-comments'

type Status = 'pending' | 'approved' | 'rejected'

const typeLabels: Record<ContentType, string> = {
  'products': 'Products',
  'stories': 'Stories',
  'campaigns': 'Campaigns',
  'media-posts': 'Media Posts',
  'media-comments': 'Media Comments',
}

const AdminModerationPage: React.FC = () => {
  const [type, setType] = useState<ContentType>('products')
  const [status, setStatus] = useState<Status>('pending')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [pagination, setPagination] = useState<{ current_page: number; total_pages: number; per_page: number; total_count: number } | null>(null)

  const title = useMemo(() => `Admin Moderation – ${typeLabels[type]}`, [type])

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminModerationAPI.list(type, { status, page, per_page: perPage })
      setItems(res.data || [])
      setPagination(res.pagination)
    } catch (e: any) {
      console.error(e)
      setError(e?.response?.data?.message || 'Failed to load moderation queue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, status, page, perPage])

  const approve = async (id: number) => {
    try {
      await adminModerationAPI.approve(type, id)
      await fetchItems()
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Approve failed')
    }
  }
  const reject = async (id: number) => {
    const reason = window.prompt('Rejection reason (optional):') || undefined
    try {
      await adminModerationAPI.reject(type, id, reason)
      await fetchItems()
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Reject failed')
    }
  }

  const Toolbar = (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <select value={type} onChange={(e) => { setPage(1); setType(e.target.value as ContentType) }} className="border px-3 py-2 bg-white">
        <option value="products">Products</option>
        <option value="stories">Stories</option>
        <option value="campaigns">Campaigns</option>
        <option value="media-posts">Media Posts</option>
        <option value="media-comments">Media Comments</option>
      </select>
      <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value as Status) }} className="border px-3 py-2 bg-white">
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
      <select value={perPage} onChange={(e) => { setPage(1); setPerPage(Number(e.target.value)) }} className="border px-3 py-2 bg-white">
        {[10,20,50].map(n => <option key={n} value={n}>{n}/page</option>)}
      </select>
    </div>
  )

  return (
    <div className="min-h-screen bg-cordillera-olive/10 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-serif text-cordillera-olive mb-2">{title}</h1>
        <p className="text-cordillera-olive/70 mb-6">Approve or reject submitted content. Only approved items appear on customer/artisan UIs.</p>
        {Toolbar}

        {loading && (
          <div className="p-6 bg-white border">Loading...</div>
        )}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 border border-red-300 mb-4">{error}</div>
        )}

        {!loading && !error && (
          <div className="bg-white border divide-y">
            <div className="grid grid-cols-12 gap-2 px-4 py-2 font-medium text-sm bg-gray-50">
              <div className="col-span-6">Item</div>
              <div className="col-span-2">User</div>
              <div className="col-span-2">Submitted</div>
              <div className="col-span-2">Actions</div>
            </div>
            {items.length === 0 && (
              <div className="px-4 py-6 text-gray-600">No items.</div>
            )}
            {items.map((it: any) => (
              <div key={it.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center">
                <div className="col-span-6 text-sm">
                  {type === 'products' && (
                    <div>
                      <div className="font-semibold">{it.name}</div>
                      <div className="text-gray-600 line-clamp-1">{it.description}</div>
                    </div>
                  )}
                  {type === 'stories' && (
                    <div>
                      <div className="font-semibold">{it.title}</div>
                      <div className="text-gray-600 line-clamp-1">{it.excerpt}</div>
                    </div>
                  )}
                  {type === 'campaigns' && (
                    <div>
                      <div className="font-semibold">{it.title}</div>
                      <div className="text-gray-600">Goal: {it.goal_amount}</div>
                    </div>
                  )}
                  {type === 'media-posts' && (
                    <div className="flex items-center gap-3">
                      {it.image_url && <img src={it.image_url} className="w-12 h-12 object-cover" alt=""/>}
                      <div className="text-gray-700 line-clamp-1">{it.caption || 'No caption'}</div>
                    </div>
                  )}
                  {type === 'media-comments' && (
                    <div className="text-gray-700 line-clamp-2">{it.body}</div>
                  )}
                </div>
                <div className="col-span-2 text-sm text-gray-700">{(it.user?.name) || (it.author?.name) || (it.organizer?.name) || '-'}</div>
                <div className="col-span-2 text-sm text-gray-600">{new Date(it.created_at).toLocaleString()}</div>
                <div className="col-span-2 flex gap-2">
                  {status !== 'approved' && (
                    <button onClick={() => approve(it.id)} className="px-3 py-1 bg-green-600 text-white text-sm hover:bg-green-700">Approve</button>
                  )}
                  {status !== 'rejected' && (
                    <button onClick={() => reject(it.id)} className="px-3 py-1 bg-red-600 text-white text-sm hover:bg-red-700">Reject</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            {pagination && (
              <span>Page {pagination.current_page} of {pagination.total_pages} • {pagination.total_count} items</span>
            )}
          </div>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 border bg-white disabled:opacity-50">Prev</button>
            <button disabled={!pagination || page >= (pagination.total_pages || 1)} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border bg-white disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminModerationPage
