import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import BackLink from '@/components/BackLink';
import { useStory } from '@/hooks/useStory';
import { useAuth } from '@/contexts/AuthContext';
import { storyLikesAPI } from '@/services/api';

const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: story, isLoading, error } = useStory(id);
  const { isAuthenticated, requireAuth } = useAuth();
  const [liked, setLiked] = useState<boolean>(false);

  // Initialize liked state when authenticated
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isAuthenticated || !id) { setLiked(false); return; }
      try {
        const list = await storyLikesAPI.list();
        if (!mounted) return;
        const likedIds = new Set(list.map(x => x.story_id));
        setLiked(likedIds.has(Number(id)));
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [isAuthenticated, id]);

  const toggleLike = async () => {
    if (!id) return;
    if (!isAuthenticated) {
      sessionStorage.setItem('pending_like_story_id', String(id));
      requireAuth('/login');
      return;
    }
    try {
      const res = await storyLikesAPI.toggle(Number(id));
      setLiked(res.liked);
    } catch {
      // ignore
    }
  };

  // Realtime: increment stories_viewed_count once per story view and notify Account page
  useEffect(() => {
    const sid = Number(id)
    if (!sid || !story?.id) return
    const viewedKey = `viewed_story_${sid}`
    try {
      if (sessionStorage.getItem(viewedKey) === '1') return
      const current = Number(localStorage.getItem('stories_viewed_count') || '0')
      const next = Number.isFinite(current) ? current + 1 : 1
      localStorage.setItem('stories_viewed_count', String(next))
      sessionStorage.setItem(viewedKey, '1')
      // Force Account page to refetch immediately
      localStorage.setItem('account_refresh', String(Date.now()))
    } catch {}
  }, [id, story?.id])

  // Normalize story fields to avoid undefined access; do this before any returns
  const safeStory = {
    id: story?.id ?? 0,
    title: story?.title || 'Story',
    author: story?.author || 'Unknown',
    date: story?.date || '',
    category: story?.category || 'community',
    tags: (story?.tags as string[] | undefined) || [],
    sourceUrl: story?.sourceUrl,
    sourceText: story?.sourceText,
    fullContent: story?.fullContent || '',
    content: story?.content || '',
  }

  // Removed external related stories; consider adding backend-powered related in the future

  if (isLoading) {
    return <div className="min-h-screen bg-heritage-800 flex items-center justify-center">
      <div className="text-heritage-100">Loading...</div>
    </div>;
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-heritage-800 flex items-center justify-center">
        <div className="text-center px-6">
          <h2 className="text-2xl text-heritage-100 mb-3">Unable to load story</h2>
          <p className="text-heritage-100/80 mb-6">Please go back and try another story.</p>
          <Link to="/stories" className="inline-block bg-heritage-500 text-heritage-800 px-5 py-2 rounded">Back to Stories</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-heritage-800">
      {/* Breadcrumb (consistent with CampaignDetailPage) */}
      <div className="bg-heritage-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center text-sm text-heritage-100/80">
            <Link to="/stories" className="hover:text-heritage-100 transition-colors">Stories</Link>
            <span className="mx-2">/</span>
            <span className="text-heritage-100/60">Story</span>
          </nav>
        </div>
      </div>

      {/* Return Button (consistent spacing) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BackLink to="/stories" variant="light" className="mb-4">Back to Stories</BackLink>
      </div>

      {/* Title & Meta below breadcrumb and return button */}
      <section className="bg-heritage-800 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-serif text-heritage-100 mb-3 leading-tight">
              {safeStory.title}
            </h1>
            <button
              type="button"
              onClick={toggleLike}
              aria-label={liked ? 'Unlike story' : 'Like story'}
              className={`mt-1 rounded-full p-2 border transition-colors ${liked ? 'bg-error-dark text-white border-transparent' : 'bg-transparent text-heritage-100 border-heritage-100/30 hover:bg-heritage-100/10'}`}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-heritage-100/80">
            <span className="text-heritage-500 font-medium">By {safeStory.author}</span>
            <span className="hidden sm:inline">•</span>
            <span>{safeStory.date}</span>
            <span className="hidden sm:inline">•</span>
            <span className="bg-heritage-500/20 px-3 py-1 text-sm">{safeStory.category}</span>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-16 bg-heritage-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg max-w-none">
            <div 
              className="text-heritage-800 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: (safeStory.sourceText || safeStory.fullContent || safeStory.content || '').toString() }}
            />
          </article>

          {safeStory.sourceUrl && (
            <div className="mt-6 text-sm">
              <a
                href={safeStory.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-heritage-800 underline hover:text-heritage-500"
              >
                Source: {safeStory.sourceUrl}
              </a>
            </div>
          )}

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-brand-sage">
            <h3 className="text-lg font-medium text-heritage-800 mb-4">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {safeStory.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-brand-sage text-heritage-800 px-3 py-1 text-sm hover:bg-heritage-500 hover:text-heritage-800 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-12 p-8 bg-brand-sage">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 rounded-full bg-heritage-800/20 flex items-center justify-center text-heritage-800 font-semibold">
                <span className="text-lg">{(story.author || 'A').slice(0,1).toUpperCase()}</span>
              </div>
              <div>
                <h3 className="text-xl font-serif text-heritage-800 mb-2">{story.author}</h3>
                <p className="text-heritage-800/70 leading-relaxed">
                  Master weaver from Bontoc with over 40 years of experience in traditional Cordillera textile arts. 
                  Maria has dedicated her life to preserving ancient weaving techniques and passing them on to the next generation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default StoryDetailPage;
