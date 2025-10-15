import React, { useEffect, useRef, useState } from 'react';
import { mediaAPI } from '@/services/api';
import type { MediaPost } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const MediaFeedPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const { user } = useAuth();
  const isAdmin = Boolean(user && (user as any).role === 'admin');

  // Right column: global feed
  const [feed, setFeed] = useState<MediaPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Left column: current user's posts (simple first-page grid)
  const [myPosts, setMyPosts] = useState<MediaPost[]>([]);
  const [loadingMyPosts, setLoadingMyPosts] = useState(false);
  const [myError, setMyError] = useState<string | null>(null);

  const loadFeed = async (targetPage = 1) => {
    try {
      if (loadingFeed) return;
      setLoadingFeed(true);
      setFeedError(null);
      const res = await mediaAPI.list({ page: targetPage, per_page: 10 });
      const items = res.data;
      if (targetPage === 1) setFeed(items);
      else setFeed((prev) => [...prev, ...items]);
      setPage(res.current_page);
      setHasMore(res.current_page < res.last_page);
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message || 'Failed to load feed';
      setFeedError(`${status ? status + ' - ' : ''}${msg}`);
      // keep hasMore as-is
    } finally {
      setLoadingFeed(false);
    }
  };

  useEffect(() => {
    loadFeed(1);
  }, []);

  // Close modal with Escape
  useEffect(() => {
    if (!isComposerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsComposerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isComposerOpen]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (isComposerOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isComposerOpen]);

  // Load current user's posts
  useEffect(() => {
    const loadMine = async () => {
      if (!user?.id) return;
      try {
        setLoadingMyPosts(true);
        setMyError(null);
        const res = await mediaAPI.userPosts(user.id, { page: 1, per_page: 12 });
        setMyPosts(res.data);
      } catch (err: any) {
        const status = err?.response?.status;
        const msg = err?.response?.data?.message || err?.message || 'Failed to load your posts';
        setMyError(`${status ? status + ' - ' : ''}${msg}`);
      } finally {
        setLoadingMyPosts(false);
      }
    };
    loadMine();
  }, [user?.id]);

  // Infinite scroll: observe sentinel and load next page when visible
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loadingFeed) {
          loadFeed(page + 1);
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [hasMore, loadingFeed, page]);

  const handleCreatePost = async () => {
    if (!file) return;
    try {
      setPosting(true);
      setPostError(null);
      const res = await mediaAPI.create({ file, caption: caption.trim() || undefined });
      // API returns the created MediaPost directly
      const newPost: MediaPost | undefined = res;
      if (newPost) setFeed((prev) => [newPost, ...prev]);
      // Reset composer
      setFile(null);
      setCaption('');
      if (fileRef.current) fileRef.current.value = '';
      // Optimistically add to my grid
      if (newPost) setMyPosts((prev) => [newPost, ...prev]);
      // Close modal on success
      setIsComposerOpen(false);
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message || 'Failed to post';
      setPostError(`${status ? status + ' - ' : ''}${msg}`);
    } finally {
      setPosting(false);
    }
  };

  const toggleLike = async (postId: number, index: number) => {
    try {
      const res = await mediaAPI.react(postId);
      setFeed((prev) => {
        const next = [...prev];
        const p = { ...next[index] };
        p.reactions_count = res.counts.reactions_count;
        next[index] = p;
        return next;
      });
    } catch (err) {
      console.error('React error', err);
    }
  };

  const addComment = async (postId: number, index: number, body: string) => {
    if (!body.trim()) return;
    try {
      const res = await mediaAPI.comment(postId, body.trim());
      setFeed((prev) => {
        const next = [...prev];
        const p = { ...next[index] };
        const comment = res; // API returns the comment object directly
        p.comments = [comment, ...(p.comments || [])];
        p.comments_count = (p.comments_count || 0) + 1;
        next[index] = p;
        return next;
      });
    } catch (err) {
      console.error('Comment error', err);
    }
  };

  // Delete one of my posts (from the "Your images" section)
  const deleteMyPost = async (postId: number) => {
    if (isAdmin) return; // admins don't post/delete here
    const ok = window.confirm('Delete this post? This cannot be undone.');
    if (!ok) return;
    try {
      await mediaAPI.delete(postId);
      setMyPosts((prev) => prev.filter((p) => p.id !== postId));
      setFeed((prev) => prev.filter((p) => p.id !== postId));
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete';
      alert(`${status ? status + ' - ' : ''}${msg}`);
    }
  };

  return (
    <div className="min-h-screen bg-heritage-100">
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-heritage-100/90 backdrop-blur supports-[backdrop-filter]:bg-heritage-100/70 border-b border-brand-sage/30">
          <h1 className="text-2xl font-serif text-heritage-800">Media Creation</h1>
        </div>
        <div className="h-4" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: 1/3 column */}
          <div className="space-y-6">
            {/* Composer trigger */}
            {!isAdmin && (
              <button
                type="button"
                onClick={() => setIsComposerOpen(true)}
                className="w-full text-left card-surface rounded-md p-4"
              >
                <div className="text-heritage-800/70">Share something…</div>
              </button>
            )}

            {/* User's images grid (sticky) */}
            <div className="sticky top-20 self-start">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-medium text-heritage-800">Your images</h2>
                {loadingMyPosts && <span className="text-sm text-heritage-800/60">Loading…</span>}
              </div>
              {myError && <div className="text-sm text-error-dark mb-2">{myError}</div>}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {myPosts.map((p) => {
                  const isApproved = (p as any).moderation_status === 'approved' || !(p as any).moderation_status;
                  const isPending = (p as any).moderation_status === 'pending';
                  const isRejected = (p as any).moderation_status === 'rejected';
                  
                  return (
                    <div key={p.id} className={`group relative card-surface rounded-md overflow-hidden ${!isApproved ? 'opacity-70' : ''}`}>
                      <img
                        src={p.image_url}
                        alt={p.caption || `my-${p.id}`}
                        className="w-full h-32 object-cover transform transition-transform duration-300 group-hover:scale-[1.03]"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          const fallback = `/api/placeholder/400/300`;
                          if (target.src !== fallback) target.src = fallback;
                        }}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-heritage-800/0 group-hover:bg-heritage-800/5 transition-colors" />
                      {/* Delete button (visible for customers/artisans) */}
                      {!isAdmin && (
                        <button
                          type="button"
                          onClick={() => deleteMyPost(p.id)}
                          className="absolute top-2 left-2 z-10 inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/90 text-error shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30"
                          title="Delete post"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0h8a1 1 0 001-1V5a1 1 0 00-1-1h-3.5l-.724-.724A1 1 0 0011.586 3h-.172a1 1 0 00-.707.293L10 4H6a1 1 0 00-1 1v1z" />
                          </svg>
                        </button>
                      )}
                      
                      {/* Moderation Status Badge */}
                      {!isApproved && (
                        <div className="absolute top-2 right-2 z-10">
                          <div className={`px-2 py-1 text-xs rounded-full font-medium ${
                            isPending ? 'bg-yellow-500 text-white' : 'bg-error text-white'
                          }`}>
                            {isPending ? 'Pending' : 'Rejected'}
                          </div>
                        </div>
                      )}
                      
                      {/* Lock Overlay for Non-Approved Posts */}
                      {!isApproved && (
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                          <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-9a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
                {!loadingMyPosts && myPosts.length === 0 && !myError && (
                  <div className="col-span-2 sm:col-span-3 text-center text-heritage-800/70 text-sm card-surface rounded-md p-6">
                    No images yet. Share your first one using the composer above.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: 2/3 column (feed) */}
          <div className="lg:col-span-2">
            {feedError && <div className="text-sm text-error-dark mb-3">{feedError}</div>}

            {/* Loading placeholder (initial) */}
            {loadingFeed && feed.length === 0 && (
              <div className="space-y-4" aria-busy="true" aria-live="polite">
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
              </div>
            )}

            {/* Empty state */}
            {!loadingFeed && feed.length === 0 && !feedError && (
              <div className="card-surface rounded-md p-8 text-center text-heritage-800/70">
                <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-heritage-500/15 flex items-center justify-center">
                  <svg className="w-6 h-6 text-heritage-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-heritage-800 mb-1">No posts yet</h3>
                <p>Be the first to share an image with a caption using the composer.</p>
              </div>
            )}

            {/* Feed posts */}
            <div className="space-y-5">
              {feed.map((post, i) => {
                const isApproved = (post as any).moderation_status === 'approved' || !(post as any).moderation_status;
                const isPending = (post as any).moderation_status === 'pending';
                const isRejected = (post as any).moderation_status === 'rejected';
                const isOwner = user && post.user_id === user.id;
                
                return (
                  <div key={post.id} className={`card-surface rounded-lg relative ${!isApproved ? 'opacity-50' : ''}`}>
                    {/* Moderation Status Overlay */}
                    {!isApproved && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] rounded-lg z-10 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-heritage-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-9a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium text-heritage-700">
                              {isPending ? 'Pending Review' : isRejected ? 'Rejected' : 'Under Review'}
                            </span>
                          </div>
                          {isOwner && (
                            <p className="text-xs text-heritage-700 mt-1">
                              {isPending ? 'Your post is awaiting admin approval' : 'Your post was rejected by admin'}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-3 border-b border-brand-sage/20 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-heritage-800">{post.user?.name || 'User'}</div>
                        <div className="text-xs text-heritage-800/60">{new Date(post.created_at).toLocaleString()}</div>
                      </div>
                      {/* Status Badge for Owner */}
                      {isOwner && !isApproved && (
                        <div className={`px-2 py-1 text-xs rounded-full ${
                          isPending ? 'bg-yellow-100 text-yellow-800' : 'bg-error/10 text-red-800'
                        }`}>
                          {isPending ? 'Pending' : 'Rejected'}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      {post.caption && <p className="mb-2 text-heritage-800">{post.caption}</p>}
                      <div className="relative overflow-hidden rounded-md group">
                        <img
                          src={post.image_url}
                          alt={post.caption || `post-${post.id}`}
                          className="w-full object-cover transform transition-transform duration-500 group-hover:scale-[1.02]"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            const fallback = `/api/placeholder/800/600`;
                            if (target.src !== fallback) target.src = fallback;
                          }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="px-3 pb-3 flex items-center gap-4 text-sm text-heritage-800/80">
                      <button
                        className="hover:text-heritage-800 transition-colors"
                        onClick={() => toggleLike(post.id, i)}
                      >
                        👍 Like {post.reactions_count ? `(${post.reactions_count})` : ''}
                      </button>
                      <div>💬 {post.comments_count || 0}</div>
                    </div>

                  {/* Comments */}
                  <div className="px-3 pb-3">
                    <CommentBox onSubmit={(body) => addComment(post.id, i, body)} />
                    {(post.comments || []).slice(0, 3).map((c) => {
                      const commentApproved = (c as any).moderation_status === 'approved' || !(c as any).moderation_status;
                      const commentPending = (c as any).moderation_status === 'pending';
                      const commentRejected = (c as any).moderation_status === 'rejected';
                      const isCommentOwner = user && (c as any).user_id === user.id;
                      
                      return (
                        <div key={c.id} className={`mt-2 text-sm relative ${!commentApproved ? 'opacity-60' : ''}`}>
                          {/* Comment Moderation Overlay */}
                          {!commentApproved && (
                            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] rounded flex items-center justify-center z-10">
                              <div className="bg-white/90 px-2 py-1 rounded text-xs">
                                <span className="text-heritage-700">
                                  {commentPending ? 'Pending' : commentRejected ? 'Rejected' : 'Under Review'}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <span className="font-medium text-heritage-800">{c.user?.name || 'User'}</span>{' '}
                              <span className="text-heritage-800/80">{c.body}</span>
                            </div>
                            {/* Status Badge for Comment Owner */}
                            {isCommentOwner && !commentApproved && (
                              <div className={`px-1 py-0.5 text-xs rounded ${
                                commentPending ? 'bg-yellow-100 text-yellow-700' : 'bg-error/10 text-error-dark'
                              }`}>
                                {commentPending ? 'P' : 'R'}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                );
              })}
            </div>

            {/* Infinite scroll sentinel + fallback button */}
            <div ref={sentinelRef} className="h-1" />
            <div className="mt-8 text-center">
              {loadingFeed && <div className="text-heritage-800/60 text-sm">Loading…</div>}
              {hasMore && !loadingFeed && (
                <button
                  onClick={() => loadFeed(page + 1)}
                  className={`border border-heritage-500 text-heritage-800 px-4 py-2 rounded-md hover:bg-heritage-500/10 shadow-sm hover:shadow-md transition-shadow`}
                >
                  Load more
                </button>
              )}
              {!hasMore && <div className="text-heritage-800/60 text-sm">No more posts</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Uploader */}
      {isComposerOpen && !isAdmin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsComposerOpen(false)}
          />
          {/* Dialog */}
          <div
            className="relative w-full max-w-lg mx-4 rounded-lg shadow-xl border border-heritage-800/15 bg-heritage-100 text-heritage-800 dark:bg-heritage-800/90 dark:text-heritage-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-brand-sage/20 flex items-center justify-between">
              <h3 className="text-lg font-medium text-heritage-800">Create post</h3>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="text-heritage-800/70 hover:text-heritage-800"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Say something about your image…"
                className="w-full border border-brand-sage/30 rounded-md p-2 mb-3 focus:outline-none focus:ring-1 focus:ring-heritage-500"
                rows={3}
              />

              {/* Hidden input */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  if (f && !f.type.startsWith('image/')) return;
                  if (f && f.size > 10 * 1024 * 1024) return; // 10MB
                  setFile(f);
                }}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm min-w-0">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 border border-heritage-500 text-heritage-800 px-3 py-1.5 rounded-md hover:bg-heritage-500/10 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Attach image
                  </button>

                  {file && (
                    <>
                      <span className="text-heritage-800/70 truncate max-w-[10rem] sm:max-w-[14rem]" title={file.name}>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                        className="inline-flex items-center gap-1 text-heritage-800/80 hover:text-heritage-800 px-2 py-1 rounded-md hover:bg-brand-sage/20 whitespace-nowrap"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear
                      </button>
                    </>
                  )}
                </div>

                <div className="ms-auto flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsComposerOpen(false)}
                    className="px-4 py-2 rounded-md border border-brand-sage/40 text-heritage-800 hover:bg-brand-sage/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={posting || !file}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-md shadow-sm transition-colors whitespace-nowrap ${
                      posting || !file
                        ? 'bg-heritage-800/30 text-white cursor-not-allowed'
                        : 'bg-heritage-500 text-heritage-800 hover:bg-heritage-500/90'
                    }`}
                  >
                    {posting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeWidth="2" d="M12 3v3m0 12v3m9-9h-3M6 12H3m13.364 6.364l-2.121-2.121M8.757 8.757L6.636 6.636m10.728 0l-2.121 2.121M8.757 15.243l-2.121 2.121" />
                        </svg>
                        Posting…
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Post
                      </>
                    )}
                  </button>
                </div>
              </div>

              {postError && <p className="text-sm text-error-dark mt-3">{postError}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CommentBox: React.FC<{ onSubmit: (body: string) => void }> = ({ onSubmit }) => {
  const [body, setBody] = useState('');
  const { user } = useAuth();
  const isAdmin = Boolean(user && (user as any).role === 'admin');
  return (
    <div className="flex items-center gap-2">
      <input
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a comment…"
        className="flex-1 border border-brand-sage/30 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-heritage-500"
      />
      <button
        onClick={() => {
          const v = body.trim();
          if (!v) return;
          onSubmit(v);
          setBody('');
        }}
        disabled={isAdmin}
        title={isAdmin ? 'Admin accounts cannot post comments.' : undefined}
        className={`text-sm px-3 py-1 rounded-md ${isAdmin ? 'bg-heritage-200 text-heritage-600 cursor-not-allowed' : 'bg-heritage-500 text-heritage-800 hover:bg-heritage-500/90'}`}
      >
        Send
      </button>
    </div>
  );
};

// Lightweight loading skeleton for feed posts
const SkeletonPost: React.FC = () => {
  return (
    <div className="bg-white rounded-md shadow-sm border border-brand-sage/30 p-3 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 bg-brand-sage/30 rounded w-32" />
        <div className="h-3 bg-brand-sage/20 rounded w-24" />
      </div>
      <div className="h-3 bg-brand-sage/30 rounded w-3/4 mb-2" />
      <div className="h-64 bg-brand-sage/20 rounded" />
      <div className="flex gap-4 mt-3">
        <div className="h-4 bg-brand-sage/30 rounded w-16" />
        <div className="h-4 bg-brand-sage/20 rounded w-12" />
      </div>
    </div>
  );
};

export default MediaFeedPage;
