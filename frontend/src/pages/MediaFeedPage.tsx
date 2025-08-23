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
      // Prepend new post into feed for responsiveness
      const newPost: MediaPost | undefined = res?.data;
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
        const comment = res?.data;
        p.comments = [comment, ...(p.comments || [])];
        p.comments_count = (p.comments_count || 0) + 1;
        next[index] = p;
        return next;
      });
    } catch (err) {
      console.error('Comment error', err);
    }
  };

  return (
    <div className="min-h-screen bg-cordillera-cream">
      <div className="max-w-6xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-serif text-cordillera-olive mb-4">Media</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: 1/3 column */}
          <div className="space-y-6">
            {/* Composer trigger */}
            <button
              type="button"
              onClick={() => setIsComposerOpen(true)}
              className="w-full text-left bg-white rounded-md shadow-sm border border-cordillera-sage/30 p-4 hover:bg-cordillera-gold/5 transition-colors"
            >
              <div className="text-cordillera-olive/70">Share something…</div>
            </button>

            {/* User's images grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-medium text-cordillera-olive">Your images</h2>
                {loadingMyPosts && <span className="text-sm text-cordillera-olive/60">Loading…</span>}
              </div>
              {myError && <div className="text-sm text-red-700 mb-2">{myError}</div>}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {myPosts.map((p) => (
                  <div key={p.id} className="relative bg-white rounded-md overflow-hidden border border-cordillera-sage/30">
                    <img src={p.image_url} alt={p.caption || `my-${p.id}`} className="w-full h-32 object-cover" />
                  </div>
                ))}
                {!loadingMyPosts && myPosts.length === 0 && !myError && (
                  <div className="col-span-2 sm:col-span-3 text-center text-cordillera-olive/70 text-sm bg-white rounded-md border border-cordillera-sage/30 p-6">
                    No images yet. Share your first one using the composer above.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: 2/3 column (feed) */}
          <div className="lg:col-span-2">
            {feedError && <div className="text-sm text-red-700 mb-3">{feedError}</div>}

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
              <div className="bg-white rounded-md border border-cordillera-sage/30 p-8 text-center text-cordillera-olive/70">
                <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-cordillera-gold/15 flex items-center justify-center">
                  <svg className="w-6 h-6 text-cordillera-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-cordillera-olive mb-1">No posts yet</h3>
                <p>Be the first to share an image with a caption using the composer.</p>
              </div>
            )}

            <div className="space-y-4">
              {feed.map((post, i) => (
                <div key={post.id} className="bg-white rounded-md shadow-sm border border-cordillera-sage/30">
                  <div className="p-3 border-b border-cordillera-sage/20 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-cordillera-olive">{post.user?.name || 'User'}</div>
                      <div className="text-xs text-cordillera-olive/60">{new Date(post.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="p-3">
                    {post.caption && <p className="mb-2 text-cordillera-olive">{post.caption}</p>}
                    <img src={post.image_url} alt={post.caption || `post-${post.id}`} className="w-full rounded-md object-cover" />
                  </div>
                  <div className="px-3 pb-3 flex items-center gap-4 text-sm text-cordillera-olive/80">
                    <button
                      className="hover:text-cordillera-olive"
                      onClick={() => toggleLike(post.id, i)}
                    >
                      👍 Like {post.reactions_count ? `(${post.reactions_count})` : ''}
                    </button>
                    <div>💬 {post.comments_count || 0}</div>
                  </div>

                  {/* Comments */}
                  <div className="px-3 pb-3">
                    <CommentBox onSubmit={(body) => addComment(post.id, i, body)} />
                    {(post.comments || []).slice(0, 3).map((c) => (
                      <div key={c.id} className="mt-2 text-sm">
                        <span className="font-medium text-cordillera-olive">{c.user?.name || 'User'}</span>{' '}
                        <span className="text-cordillera-olive/80">{c.body}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Infinite scroll sentinel + fallback button */}
            <div ref={sentinelRef} className="h-1" />
            <div className="mt-6 text-center">
              {loadingFeed && <div className="text-cordillera-olive/60 text-sm">Loading…</div>}
              {hasMore && !loadingFeed && (
                <button
                  onClick={() => loadFeed(page + 1)}
                  className={`border border-cordillera-gold text-cordillera-olive px-4 py-2 rounded-md hover:bg-cordillera-gold/10`}
                >
                  Load more
                </button>
              )}
              {!hasMore && <div className="text-cordillera-olive/60 text-sm">No more posts</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Uploader */}
      {isComposerOpen && (
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
            className="relative bg-white w-full max-w-lg mx-4 rounded-lg shadow-xl border border-cordillera-sage/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-cordillera-sage/20 flex items-center justify-between">
              <h3 className="text-lg font-medium text-cordillera-olive">Create post</h3>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="text-cordillera-olive/70 hover:text-cordillera-olive"
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
                className="w-full border border-cordillera-sage/30 rounded-md p-2 mb-3 focus:outline-none focus:ring-1 focus:ring-cordillera-gold"
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
                    className="inline-flex items-center gap-2 border border-cordillera-gold text-cordillera-olive px-3 py-1.5 rounded-md hover:bg-cordillera-gold/10 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Attach image
                  </button>

                  {file && (
                    <>
                      <span className="text-cordillera-olive/70 truncate max-w-[10rem] sm:max-w-[14rem]" title={file.name}>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                        className="inline-flex items-center gap-1 text-cordillera-olive/80 hover:text-cordillera-olive px-2 py-1 rounded-md hover:bg-cordillera-sage/20 whitespace-nowrap"
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
                    className="px-4 py-2 rounded-md border border-cordillera-sage/40 text-cordillera-olive hover:bg-cordillera-sage/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={posting || !file}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-md shadow-sm transition-colors whitespace-nowrap ${
                      posting || !file
                        ? 'bg-cordillera-olive/30 text-white cursor-not-allowed'
                        : 'bg-cordillera-gold text-cordillera-olive hover:bg-cordillera-gold/90'
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

              {postError && <p className="text-sm text-red-700 mt-3">{postError}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CommentBox: React.FC<{ onSubmit: (body: string) => void }> = ({ onSubmit }) => {
  const [body, setBody] = useState('');
  return (
    <div className="flex items-center gap-2">
      <input
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a comment…"
        className="flex-1 border border-cordillera-sage/30 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-cordillera-gold"
      />
      <button
        onClick={() => {
          const v = body.trim();
          if (!v) return;
          onSubmit(v);
          setBody('');
        }}
        className="text-sm bg-cordillera-gold text-cordillera-olive px-3 py-1 rounded-md hover:bg-cordillera-gold/90"
      >
        Send
      </button>
    </div>
  );
};

// Lightweight loading skeleton for feed posts
const SkeletonPost: React.FC = () => {
  return (
    <div className="bg-white rounded-md shadow-sm border border-cordillera-sage/30 p-3 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 bg-cordillera-sage/30 rounded w-32" />
        <div className="h-3 bg-cordillera-sage/20 rounded w-24" />
      </div>
      <div className="h-3 bg-cordillera-sage/30 rounded w-3/4 mb-2" />
      <div className="h-64 bg-cordillera-sage/20 rounded" />
      <div className="flex gap-4 mt-3">
        <div className="h-4 bg-cordillera-sage/30 rounded w-16" />
        <div className="h-4 bg-cordillera-sage/20 rounded w-12" />
      </div>
    </div>
  );
};

export default MediaFeedPage;
