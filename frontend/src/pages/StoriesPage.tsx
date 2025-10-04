import React, { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { triggerAction } from '../lib/uiActions';
import { Link } from 'react-router-dom';
import api, { storiesAPI } from '@/services/api';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

interface Story {
  id: number;
  title: string;
  content: string;
  media_url: string;
  author: string;
  date: string;
  category: string;
  readTime: number;
  featured: boolean;
  type: 'story';
}

// Campaigns are now handled on a separate page.

const StoriesPage: React.FC = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Resolve API origin from axios baseURL
    const API_ORIGIN = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');

    const isImageUrl = (url?: string) => {
      if (!url) return false;
      return /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
    };

    const fallbackImage = 'https://images.unsplash.com/photo-1594736797933-d0051ba0ff29?w=800';

    (async () => {
      try {
        const res = await storiesAPI.getAll({ per_page: 'all' });
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : res?.data?.data || []);
        const mappedStories: Story[] = list.map((s: any) => {
          // Prefer excerpt in card; full content can be shown in detail page
          const content = s.excerpt || s.content || '';
          // Use media_url only if it points to an image, else fallback
          const cover = isImageUrl(s.media_url) ? s.media_url : fallbackImage;
          return {
            id: s.id,
            title: s.title,
            content,
            media_url: cover,
            author: s.author?.name || 'Unknown',
            date: s.created_at ? new Date(s.created_at).toLocaleDateString() : '',
            category: s.category || 'community',
            readTime: s.reading_time ?? 0,
            featured: !!s.featured,
            type: 'story',
          } as Story;
        });

        if (mounted) {
          setStories(mappedStories);
          setFilteredStories(mappedStories);
        }
      } catch (e: any) {
        console.error('[StoriesPage] Fetch error:', e?.response?.status, e?.response?.data || e);
        if (mounted) {
          setStories([]);
          setFilteredStories([]);
          const status = e?.response?.status;
          const msg = e?.response?.data?.message || e?.message || 'Failed to fetch content';
          setErrorMsg(`Stories/Campaigns fetch error${status ? ` (${status})` : ''}: ${msg}`);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // Enhanced filtering logic for combined content
  useEffect(() => {
    let filtered = stories as Story[];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(searchLower);
        return (
          titleMatch ||
          item.content.toLowerCase().includes(searchLower) ||
          item.author.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredStories(filtered);
  }, [selectedCategory, stories, searchTerm]);

  // Helper function to get progress percentage for campaigns
  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  // Get featured content (currently not displayed separately)
  // Show all filtered stories in the grid
  const regularStories = filteredStories;
  
  // Get all categories from both stories and campaigns
  const categories = ['all', ...Array.from(new Set(stories.map(item => item.category)))];
  
  // Content type counts (showing available counts, not filtered counts)
  const totalStoryCount = stories.length;

  // Fallback image for any broken/blocked images at render time
  const FALLBACK_IMG = 'https://images.unsplash.com/photo-1594736797933-d0051ba0ff29?w=800';

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  // Loading component
  if (isLoading) {
    return <LoadingScreen title="Loading Heritage Content" subtitle="Gathering stories and campaigns..." />;
  }

  return (
    <div className="min-h-screen bg-cordillera-olive">
      {/* Hero Header */}
      <section className="relative bg-cordillera-olive py-24 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-6">
            <span className="inline-block bg-cordillera-gold/20 text-cordillera-gold px-4 py-2 text-sm font-medium uppercase tracking-wider mb-4 backdrop-blur-sm">
              Heritage Stories
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-light text-cordillera-cream mb-8 tracking-wide">
            Stories
          </h1>
          <p className="text-xl md:text-2xl text-cordillera-cream/90 max-w-4xl mx-auto font-light leading-relaxed mb-8">
            Explore inspiring stories and support meaningful initiatives that preserve our cultural heritage.
          </p>
          <div className="flex justify-center items-center space-x-8 text-cordillera-cream/70">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium">Cultural Stories</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium">Community Support</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Heritage Preservation</span>
            </div>
          </div>
          {user && ((user as any).role === 'artisan' || (user as any).role === 'weaver') && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/submit-story"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-cordillera-gold text-cordillera-olive font-semibold hover:bg-cordillera-gold/90 shadow-md transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Submit Story
              </Link>
              <Link
                to="/my-stories"
                className="inline-flex items-center px-6 py-3 rounded-lg border border-cordillera-cream/40 text-cordillera-cream hover:bg-white/10 font-semibold transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                </svg>
                My Stories
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-20 bg-cordillera-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {regularStories.map((item) => (
              <Card key={`story-${item.id}`} className="group block overflow-hidden h-full">
                  <Link to={`/stories/${item.id}`} className="block h-full">
                    <div className="px-6 pt-6">
                      <span className="inline-block bg-cordillera-olive/90 text-cordillera-cream px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded">
                        Story
                      </span>
                    </div>
                    <CardContent className="pt-4 flex flex-col h-full">
                      <span className="text-cordillera-gold text-[11px] font-medium uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-serif text-cordillera-olive mt-1 mb-2 leading-snug group-hover:text-cordillera-gold transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-cordillera-olive/70 text-[13px] leading-relaxed line-clamp-2 md:line-clamp-3">
                        {item.content}
                      </p>
                      <div className="mt-3 mb-4 h-6" aria-hidden="true" />
                      <div className="mt-auto flex justify-between items-center text-[11px] text-cordillera-olive/60">
                        <span>By {item.author}</span>
                        <span>{item.readTime} min read</span>
                      </div>
                    </CardContent>
                  </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-14 bg-cordillera-sage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {user && ((user as any).role === 'artisan' || (user as any).role === 'weaver') && (
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-serif text-cordillera-olive mb-4">Share Your Story</h3>
                <p className="text-cordillera-olive/80 text-base mb-5 leading-relaxed">
                  Are you a weaver with a story to tell? We'd love to feature your journey.
                </p>
                <Link 
                  to="/submit-story"
                  className="group relative inline-flex items-center justify-center border-2 border-cordillera-olive text-cordillera-olive px-6 py-3 text-base font-medium rounded-lg bg-cordillera-cream/10 backdrop-blur-sm shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-cordillera-gold hover:text-cordillera-olive hover:border-cordillera-gold"
                >
                  Submit Your Story
                </Link>
              </div>
            )}

            {user && (user as any).role === 'artisan' && (
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-serif text-cordillera-olive mb-4">Start Your Campaign</h3>
                <p className="text-cordillera-olive/80 text-base mb-5 leading-relaxed">
                  Have a project that supports Cordillera weaving heritage? Launch your own campaign.
                </p>
                <Link 
                  to="/create-campaign"
                  className="group relative inline-flex items-center justify-center border-2 border-cordillera-olive text-cordillera-olive px-6 py-3 text-base font-medium rounded-lg bg-cordillera-cream/10 backdrop-blur-sm shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-cordillera-gold hover:text-cordillera-olive hover:border-cordillera-gold"
                >
                  Create Campaign
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoriesPage;
