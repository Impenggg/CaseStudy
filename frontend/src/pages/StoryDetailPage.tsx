import React from 'react';
import { useParams, Link } from 'react-router-dom';
import BackLink from '@/components/BackLink';
import { useStory } from '@/hooks/useStory';

const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: story, isLoading, error } = useStory(id);

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
    return <div className="min-h-screen bg-cordillera-olive flex items-center justify-center">
      <div className="text-cordillera-cream">Loading...</div>
    </div>;
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-cordillera-olive flex items-center justify-center">
        <div className="text-center px-6">
          <h2 className="text-2xl text-cordillera-cream mb-3">Unable to load story</h2>
          <p className="text-cordillera-cream/80 mb-6">Please go back and try another story.</p>
          <Link to="/stories" className="inline-block bg-cordillera-gold text-cordillera-olive px-5 py-2 rounded">Back to Stories</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cordillera-olive">
      {/* Breadcrumb (consistent with CampaignDetailPage) */}
      <div className="bg-cordillera-olive py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center text-sm text-cordillera-cream/80">
            <Link to="/stories" className="hover:text-cordillera-cream transition-colors">Stories</Link>
            <span className="mx-2">/</span>
            <span className="text-cordillera-cream/60">Story</span>
          </nav>
        </div>
      </div>

      {/* Return Button (consistent spacing) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BackLink to="/stories" variant="light" className="mb-4">Back to Stories</BackLink>
      </div>

      {/* Title & Meta below breadcrumb and return button */}
      <section className="bg-cordillera-olive pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif text-cordillera-cream mb-3 leading-tight">
            {safeStory.title}
          </h1>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-cordillera-cream/80">
            <span className="text-cordillera-gold font-medium">By {safeStory.author}</span>
            <span className="hidden sm:inline">•</span>
            <span>{safeStory.date}</span>
            <span className="hidden sm:inline">•</span>
            <span className="bg-cordillera-gold/20 px-3 py-1 text-sm">{safeStory.category}</span>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-16 bg-cordillera-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg max-w-none">
            <div 
              className="text-cordillera-olive leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: (safeStory.sourceText || safeStory.fullContent || safeStory.content || '').toString() }}
            />
          </article>

          {safeStory.sourceUrl && (
            <div className="mt-6 text-sm">
              <a
                href={safeStory.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cordillera-olive underline hover:text-cordillera-gold"
              >
                Source: {safeStory.sourceUrl}
              </a>
            </div>
          )}

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-cordillera-sage">
            <h3 className="text-lg font-medium text-cordillera-olive mb-4">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {safeStory.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-cordillera-sage text-cordillera-olive px-3 py-1 text-sm hover:bg-cordillera-gold hover:text-cordillera-olive transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-12 p-8 bg-cordillera-sage">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 rounded-full bg-cordillera-olive/20 flex items-center justify-center text-cordillera-olive font-semibold">
                <span className="text-lg">{(story.author || 'A').slice(0,1).toUpperCase()}</span>
              </div>
              <div>
                <h3 className="text-xl font-serif text-cordillera-olive mb-2">{story.author}</h3>
                <p className="text-cordillera-olive/70 leading-relaxed">
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
