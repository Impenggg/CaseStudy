import React from 'react';
import { useParams, Link } from 'react-router-dom';
import BackLink from '@/components/BackLink';
import { useStory } from '@/hooks/useStory';

const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: story, isLoading } = useStory(id);

  if (isLoading || !story) {
    return <div className="min-h-screen bg-cordillera-olive flex items-center justify-center">
      <div className="text-cordillera-cream">Loading...</div>
    </div>;
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
            {story.title}
          </h1>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-cordillera-cream/80">
            <span className="text-cordillera-gold font-medium">By {story.author}</span>
            <span className="hidden sm:inline">•</span>
            <span>{story.date}</span>
            <span className="hidden sm:inline">•</span>
            <span className="bg-cordillera-gold/20 px-3 py-1 text-sm">{story.category}</span>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-16 bg-cordillera-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg max-w-none">
            <div 
              className="text-cordillera-olive leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: story.fullContent }}
            />
          </article>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-cordillera-sage">
            <h3 className="text-lg font-medium text-cordillera-olive mb-4">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag) => (
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
              <img
                src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face"
                alt={story.author}
                className="w-20 h-20 rounded-full object-cover"
              />
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

      {/* Related Stories */}
      <section className="py-16 bg-cordillera-olive">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif text-cordillera-cream mb-12 text-center">
            More Stories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 2,
                title: "The Art of Natural Dyeing",
                author: "Carlos Mendoza",
                image: "https://images.unsplash.com/photo-1582582494881-41e67beece72?w=500",
                excerpt: "Learning traditional plant-based coloring methods..."
              },
              {
                id: 3,
                title: "Young Weavers, Ancient Traditions",
                author: "Ana Bautista",
                image: "https://images.unsplash.com/photo-1594736797933-d0051ba0ff29?w=500",
                excerpt: "How millennials are embracing traditional crafts..."
              },
              {
                id: 4,
                title: "Preserving Cultural Patterns",
                author: "Roberto Calam",
                image: "https://images.unsplash.com/photo-1558618666-fcd25b9cd7db?w=500",
                excerpt: "The significance of geometric designs in Cordillera textiles..."
              }
            ].map((relatedStory) => (
              <Link
                key={relatedStory.id}
                to={`/story/${relatedStory.id}`}
                className="group block bg-cordillera-olive hover:bg-cordillera-olive/80 transition-colors duration-300"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={relatedStory.image}
                    alt={relatedStory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif text-cordillera-cream mb-2 group-hover:text-cordillera-cream/90">
                    {relatedStory.title}
                  </h3>
                  <p className="text-cordillera-cream/70 text-sm mb-3 leading-relaxed">
                    {relatedStory.excerpt}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-cordillera-gold">
                    By {relatedStory.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoryDetailPage;
