import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Story {
  id: number;
  title: string;
  content: string;
  media_url: string;
  author: string;
  date: string;
  category: string;
  fullContent: string;
  tags: string[];
}

const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);

  useEffect(() => {
    // Sample story data - in real app, fetch from API
    const sampleStory: Story = {
      id: parseInt(id || '1'),
      title: "Master Weaver Maria's Journey",
      content: "Discover how Maria preserves 300-year-old weaving techniques...",
      media_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200",
      author: "Maria Santos",
      date: "December 15, 2024",
      category: "Artisan Profile",
      fullContent: `
        <p>In the misty mountains of Bontoc, where clouds kiss the rice terraces and ancient traditions flow like the mountain streams, Maria Santos sits at her traditional loom, her weathered hands moving with the precision of a master craftsperson who has dedicated over four decades to preserving the sacred art of Cordillera weaving.</p>
        
        <p>Maria's story begins in 1965, when she was just eight years old. Her grandmother, Aling Rosa, first placed the wooden shuttle in her small hands and taught her the sacred patterns that have been passed down through generations of women in their family. "Each thread tells a story," Aling Rosa would say, "and each pattern holds the wisdom of our ancestors."</p>
        
        <p>The traditional Ikat weaving technique that Maria practices is far more than a craft—it's a spiritual practice that connects her to the land, her ancestors, and the cosmic order that governs mountain life. The geometric patterns she weaves represent mountains, rivers, rice fields, and the eternal cycle of planting and harvest that has sustained her people for centuries.</p>
        
        <p>Today, at 67, Maria has become one of the most respected master weavers in the region. Her works are not merely textiles but repositories of cultural memory, each piece carrying within its fibers the stories, beliefs, and artistic vision of the Cordillera people. Through her dedication, she ensures that these ancient techniques will not be lost to time.</p>
        
        <p>"When I weave," Maria explains, her eyes twinkling with the wisdom of years, "I am not just creating cloth. I am continuing a conversation that began with my great-great-grandmothers, and I am ensuring that my granddaughters will have voices in that conversation too."</p>
        
        <p>Her workshop, nestled in a traditional Ifugao house overlooking the famous Banaue rice terraces, has become a pilgrimage site for young people eager to learn traditional weaving techniques. Maria teaches not just the technical aspects of the craft, but also the cultural significance, the proper prayers to say while working, and the respect that must be shown to the materials and the process.</p>
      `,
      tags: ["Traditional Craft", "Master Weaver", "Cultural Heritage", "Bontoc", "Ikat Weaving"]
    };
    setStory(sampleStory);
  }, [id]);

  if (!story) {
    return <div className="min-h-screen bg-cordillera-olive flex items-center justify-center">
      <div className="text-cordillera-cream">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-cordillera-olive">
      {/* Hero Section with Story Image */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={story.media_url}
          alt={story.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-cordillera-olive/60"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl px-4">
            <h1 className="text-5xl md:text-6xl font-serif text-cordillera-cream mb-4 leading-tight">
              {story.title}
            </h1>
            <div className="flex items-center justify-center space-x-4 text-cordillera-cream/80">
              <span className="text-cordillera-gold font-medium">By {story.author}</span>
              <span>•</span>
              <span>{story.date}</span>
              <span>•</span>
              <span className="bg-cordillera-gold/20 px-3 py-1 text-sm">{story.category}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-cordillera-olive">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm text-cordillera-cream/60">
            <Link to="/" className="hover:text-cordillera-cream">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/stories" className="hover:text-cordillera-cream">Stories</Link>
            <span className="mx-2">/</span>
            <span className="text-cordillera-cream">{story.title}</span>
          </nav>
        </div>
      </div>

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
