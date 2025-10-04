import React, { useState, useEffect, useMemo } from 'react'
import api, { adminModerationAPI } from '@/services/api'

// Helper: resolve image URLs using API base URL origin
const API_ORIGIN = (api.defaults.baseURL || '').replace(/\/api\/?$/, '')
const resolveImageUrl = (image?: string) => {
  if (!image) return ''
  if (image.startsWith('http://') || image.startsWith('https://')) return image
  if (image.startsWith('/')) return `${API_ORIGIN}${image}`
  return `${API_ORIGIN}/${image}`
}

// Placeholder image for broken/missing images
const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#6b7280">No Image</text>
    </svg>`
  );

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
  const [pagination, setPagination] = useState<any>(null)
  const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; item: any | null }>({ isOpen: false, item: null })

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

  const openReviewModal = (item: any) => {
    setReviewModal({ isOpen: true, item })
  }

  const closeReviewModal = () => {
    setReviewModal({ isOpen: false, item: null })
  }

  const approve = async (id: number) => {
    try {
      await adminModerationAPI.approve(type, id)
      fetchItems()
      closeReviewModal()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to approve item')
    }
  }

  const reject = async (id: number) => {
    const reason = prompt('Rejection reason (optional):')
    try {
      await adminModerationAPI.reject(type, id, reason || undefined)
      fetchItems()
      closeReviewModal()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to reject item')
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
                <div className="col-span-2 text-sm text-gray-700">{(it.user?.name) || (it.author?.name) || (it.organizer?.name) || (it.seller?.name) || '-'}</div>
                <div className="col-span-2 text-sm text-gray-600">{new Date(it.created_at).toLocaleString()}</div>
                <div className="col-span-2 flex gap-2">
                  <button onClick={() => openReviewModal(it)} className="px-3 py-1 bg-blue-600 text-white text-sm hover:bg-blue-700">Review</button>
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

      {/* Review Modal */}
      {reviewModal.isOpen && reviewModal.item && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg w-full h-full sm:max-w-6xl sm:max-h-[95vh] sm:h-auto overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Review {typeLabels[type].slice(0, -1)}</h2>
                <button onClick={closeReviewModal} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Creator Info */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Creator Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Creator Name</span>
                      <p className="text-gray-900">{(reviewModal.item.user?.name) || (reviewModal.item.author?.name) || (reviewModal.item.organizer?.name) || (reviewModal.item.seller?.name) || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Created Date</span>
                      <p className="text-gray-900">{new Date(reviewModal.item.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <div className="mt-1">
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          reviewModal.item.moderation_status === 'approved' ? 'bg-green-100 text-green-800' :
                          reviewModal.item.moderation_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {reviewModal.item.moderation_status || 'pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-3">Content Details</h3>
                  
                  {type === 'products' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="flex justify-center">
                          <img 
                            src={resolveImageUrl(reviewModal.item.image_url || reviewModal.item.image) || PLACEHOLDER_IMG} 
                            alt={reviewModal.item.name} 
                            className="w-full max-w-sm h-64 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              if (target.src !== PLACEHOLDER_IMG) {
                                target.src = PLACEHOLDER_IMG;
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-2">{reviewModal.item.name}</h4>
                            <p className="text-3xl font-bold text-green-600">₱{Number(reviewModal.item.price).toFixed(2)}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Category</span>
                              <p className="text-gray-900">{reviewModal.item.category}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Stock</span>
                              <p className="text-gray-900">{reviewModal.item.stock_quantity}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700">{reviewModal.item.description}</p>
                          </div>
                        </div>
                        {reviewModal.item.cultural_background && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Cultural Background</h5>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-gray-700">{reviewModal.item.cultural_background}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {(reviewModal.item.materials && reviewModal.item.materials.length > 0) || reviewModal.item.care_instructions ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {reviewModal.item.materials && reviewModal.item.materials.length > 0 && (
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Materials</h5>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700">{reviewModal.item.materials.join(', ')}</p>
                              </div>
                            </div>
                          )}
                          {reviewModal.item.care_instructions && (
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Care Instructions</h5>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700">{reviewModal.item.care_instructions}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {type === 'stories' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {reviewModal.item.media_url && (
                          <div className="flex justify-center">
                            <img 
                              src={resolveImageUrl(reviewModal.item.media_url)} 
                              alt={reviewModal.item.title} 
                              className="w-full h-64 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.src = PLACEHOLDER_IMG;
                              }}
                            />
                          </div>
                        )}
                        <div className={`space-y-4 ${reviewModal.item.media_url ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                          <div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-2">{reviewModal.item.title}</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Category</span>
                              <p className="text-gray-900">{reviewModal.item.category}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Reading Time</span>
                              <p className="text-gray-900">{reviewModal.item.reading_time} min</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {reviewModal.item.excerpt && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Excerpt</h5>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700">{reviewModal.item.excerpt}</p>
                          </div>
                        </div>
                      )}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Content</h5>
                        <div className="bg-gray-50 p-6 rounded-lg max-h-80 overflow-y-auto">
                          <div className="text-gray-700 whitespace-pre-wrap">{reviewModal.item.content}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {type === 'campaigns' && (
                    <div className="space-y-3">
                      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
                        {reviewModal.item.image && (
                          <img 
                            src={resolveImageUrl(reviewModal.item.image)} 
                            alt={reviewModal.item.title} 
                            className="w-48 h-48 object-cover rounded-lg mx-auto md:mx-0"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.src = PLACEHOLDER_IMG;
                            }}
                          />
                        )}
                        <div className="flex-1 text-center md:text-left">
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">{reviewModal.item.title}</h4>
                          <p className="text-2xl font-bold text-blue-600 mb-2">Goal: ₱{Number(reviewModal.item.goal_amount).toLocaleString()}</p>
                          <p className="text-sm text-gray-600 mb-1">Category: {reviewModal.item.category}</p>
                          <p className="text-sm text-gray-600">End Date: {new Date(reviewModal.item.end_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">Description</h5>
                        <div className="text-gray-700 mt-1 max-h-64 overflow-y-auto whitespace-pre-wrap">{reviewModal.item.description}</div>
                      </div>
                    </div>
                  )}

                  {type === 'media-posts' && (
                    <div className="space-y-4 text-center">
                      {reviewModal.item.image_url && (
                        <img 
                          src={resolveImageUrl(reviewModal.item.image_url)} 
                          alt="Media post" 
                          className="w-full max-w-lg mx-auto rounded-lg"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = PLACEHOLDER_IMG;
                          }}
                        />
                      )}
                      {reviewModal.item.caption && (
                        <div className="text-center">
                          <h5 className="font-medium text-gray-900 mb-2">Caption</h5>
                          <p className="text-gray-700">{reviewModal.item.caption}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {type === 'media-comments' && (
                    <div className="space-y-3 text-center">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Comment</h5>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg inline-block max-w-2xl">{reviewModal.item.body}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rejection Reason (if rejected) */}
                {reviewModal.item.moderation_status === 'rejected' && reviewModal.item.rejection_reason && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-medium text-red-900 mb-2">Rejection Reason</h3>
                    <p className="text-sm text-red-700">{reviewModal.item.rejection_reason}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button onClick={closeReviewModal} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded">
                  Close
                </button>
                {status !== 'approved' && (
                  <button onClick={() => approve(reviewModal.item.id)} className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded">
                    Approve
                  </button>
                )}
                {status !== 'rejected' && (
                  <button onClick={() => reject(reviewModal.item.id)} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded">
                    Reject
                  </button>
                )}
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminModerationPage
