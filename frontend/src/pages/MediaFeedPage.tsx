import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mediaAPI } from '@/services/api';
import type { MediaPost } from '@/services/api';

const MediaFeedPage: React.FC = () => {
  const { isAuthenticated, requireAuth } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const [feed, setFeed] = useState<MediaPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

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

  const handleCreatePost = async () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('intended_action', 'create_media_post');
      requireAuth('/login');
      return;
    }
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
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message || 'Failed to post';
      setPostError(`${status ? status + ' - ' : ''}${msg}`);
    } finally {
      setPosting(false);
    }
  };

  const toggleLike = async (postId: number, index: number) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('intended_action', `react:${postId}`);
      requireAuth('/login');
      return;
    }
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
    if (!isAuthenticated) {
      sessionStorage.setItem('intended_action', `comment:${postId}`);
      requireAuth('/login');
      return;
    }
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
      <div className="max-w-3xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-serif text-cordillera-olive mb-4">Media Feed</h1>

        {/* Composer */}
        <div className="bg-white rounded-md shadow-sm border border-cordillera-sage/30 p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Share something..."
                className="w-full border border-cordillera-sage/30 rounded-md p-2 mb-2 focus:outline-none focus:ring-1 focus:ring-cordillera-gold"
                rows={2}
              />
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
                className="block text-sm text-cordillera-olive/80"
              />
              {postError && <p className="text-sm text-red-700 mt-2">{postError}</p>}
            </div>
            <button
              onClick={handleCreatePost}
              disabled={posting || !file}
              className={`self-start bg-cordillera-gold text-cordillera-olive px-4 py-2 rounded-md ${posting || !file ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cordillera-gold/90'}`}
            >
              {posting ? 'Posting…' : 'Post'}
            </button>
          </div>
        </div>

        {/* Feed */}
        {feedError && <div className="text-sm text-red-700 mb-3">{feedError}</div>}
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

        {/* Pagination */}
        <div className="mt-6 text-center">
          {hasMore ? (
            <button
              onClick={() => loadFeed(page + 1)}
              disabled={loadingFeed}
              className={`border border-cordillera-gold text-cordillera-olive px-4 py-2 rounded-md ${loadingFeed ? 'opacity-50' : 'hover:bg-cordillera-gold/10'}`}
            >
              {loadingFeed ? 'Loading…' : 'Load more'}
            </button>
          ) : (
            <div className="text-cordillera-olive/60 text-sm">No more posts</div>
          )}
        </div>
      </div>
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

export default MediaFeedPage;
