import React, { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { triggerAction } from '../lib/uiActions';
import { Link } from 'react-router-dom';
import api, { storiesAPI, campaignsAPI } from '@/services/api';
import { externalStories } from '@/data/storiesExternal';
import { useAuth } from '../contexts/AuthContext';

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

interface Campaign {
  id: number;
  title: string;
  description: string;
  image: string;
  goalAmount: number;
  currentAmount: number;
  endDate: string;
  category: string;
  organizer: string;
  featured: boolean;
  type: 'campaign';
}

type ContentItem = Story | Campaign;

const StoriesPage: React.FC = () => {
  const { user } = useAuth();
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contentType, setContentType] = useState<'all' | 'stories' | 'campaigns'>('all');
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
        console.debug('[StoriesPage] Fetching stories...');
        const res = await storiesAPI.getAll({ per_page: 'all' });
        console.debug('[StoriesPage] Stories response:', res);
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

        // Map external stories dataset
        const mappedExternalStories: Story[] = externalStories.map((e) => {
          const cover = isImageUrl(e.media_url) ? e.media_url : fallbackImage;
          return {
            id: e.id,
            title: e.title,
            content: e.excerpt || e.content || '',
            media_url: cover,
            author: e.author || 'Unknown',
            date: e.created_at ? new Date(e.created_at).toLocaleDateString() : '',
            category: e.category || 'community',
            readTime: e.reading_time ?? 0,
            featured: !!e.featured,
            type: 'story',
          } as Story;
        });

        // Fetch campaigns (all)
        console.debug('[StoriesPage] Fetching campaigns...');
        const cres = await campaignsAPI.getAll({ per_page: 'all' });
        console.debug('[StoriesPage] Campaigns response:', cres);
        const clist = Array.isArray(cres?.data) ? cres.data : (Array.isArray(cres) ? cres : cres?.data?.data || []);
        const mappedCampaigns: Campaign[] = clist.map((c: any) => {
          const img = c.image && isImageUrl(c.image) ? c.image : fallbackImage;
          return {
            id: c.id,
            title: c.title,
            description: c.description,
            image: img,
            goalAmount: Number(c.goal_amount ?? 0),
            currentAmount: Number(c.current_amount ?? 0),
            endDate: c.end_date ? new Date(c.end_date).toLocaleDateString() : '',
            category: c.category || 'community',
            organizer: c.organizer?.name || 'Organizer',
            featured: false,
            type: 'campaign',
          } as Campaign;
        });

        // Combine: external stories + API stories + campaigns
        const combined: ContentItem[] = [...mappedExternalStories, ...mappedStories, ...mappedCampaigns];
        if (mounted) {
          setAllContent(combined);
          setFilteredContent(combined);
        }
      } catch (e: any) {
        console.error('[StoriesPage] Fetch error:', e?.response?.status, e?.response?.data || e);
        if (mounted) {
          setAllContent([]);
          setFilteredContent([]);
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
    let filtered = allContent;

    // Filter by content type
    if (contentType === 'stories') {
      filtered = filtered.filter(item => item.type === 'story');
    } else if (contentType === 'campaigns') {
      filtered = filtered.filter(item => item.type === 'campaign');
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(searchLower);
        
        if (item.type === 'story') {
          const story = item as Story;
          return titleMatch || 
                 story.content.toLowerCase().includes(searchLower) ||
                 story.author.toLowerCase().includes(searchLower) ||
                 story.category.toLowerCase().includes(searchLower);
        } else {
          const campaign = item as Campaign;
          return titleMatch || 
                 campaign.description.toLowerCase().includes(searchLower) ||
                 campaign.organizer.toLowerCase().includes(searchLower) ||
                 campaign.category.toLowerCase().includes(searchLower);
        }
      });
    }

    setFilteredContent(filtered);
  }, [selectedCategory, contentType, allContent, searchTerm]);

  // Helper function to get progress percentage for campaigns
  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  // Get featured content (currently not displayed separately)
  const featuredStory = allContent.find(item => item.type === 'story' && item.featured) as Story;
  const featuredCampaign = allContent.find(item => item.type === 'campaign' && item.featured) as Campaign;
  
  // Show all filtered content (including featured) in the grid
  const regularContent = filteredContent;
  
  // Get all categories from both stories and campaigns
  const categories = ['all', ...Array.from(new Set(allContent.map(item => item.category)))];
  
  // Content type counts (showing available counts, not filtered counts)
  const totalStoryCount = allContent.filter(item => item.type === 'story').length;
  const totalCampaignCount = allContent.filter(item => item.type === 'campaign').length;

  // Fallback image for any broken/blocked images at render time
  const FALLBACK_IMG = 'https://images.unsplash.com/photo-1594736797933-d0051ba0ff29?w=800';

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setContentType('all');
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
            Stories & Campaigns
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
          {user && (
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
                to="/create-campaign"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-cordillera-gold text-cordillera-olive font-semibold hover:bg-cordillera-gold/90 shadow-md transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create Campaign
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
              <Link
                to="/my-campaigns"
                className="inline-flex items-center px-6 py-3 rounded-lg border border-cordillera-cream/40 text-cordillera-cream hover:bg-white/10 font-semibold transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h8" />
                </svg>
                My Campaigns
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-20 bg-cordillera-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {regularContent.map((item) => (
              <div key={`${item.type}-${item.id}`} className="group block bg-white shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-lg border border-cordillera-sage/20 h-full">
                {item.type === 'story' ? (
                  // Story Card (no image preview)
                  <Link to={`/story/${item.id}`} className="block h-full">
                    <div className="px-6 pt-6">
                      <span className="inline-block bg-cordillera-olive/90 text-cordillera-cream px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded">
                        Story
                      </span>
                    </div>
                    <div className="p-6 pt-4 flex flex-col h-full">
                      <span className="text-cordillera-gold text-[11px] font-medium uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-serif text-cordillera-olive mt-1 mb-2 leading-snug group-hover:text-cordillera-gold transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-cordillera-olive/70 text-[13px] leading-relaxed line-clamp-2 md:line-clamp-3">
                        {(item as Story).content}
                      </p>
                      {/* Spacer to match campaign progress section height */}
                      <div className="mt-3 mb-4 h-14 md:h-16" aria-hidden="true" />
                      <div className="mt-auto flex justify-between items-center text-[11px] text-cordillera-olive/60">
                        <span>By {(item as Story).author}</span>
                        <span>{(item as Story).readTime} min read</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  // Campaign Card (no image preview)
                  <div className="flex flex-col h-full">
                    <div className="px-6 pt-6">
                      <span className="inline-block bg-cordillera-gold/90 text-cordillera-olive px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded">
                        Campaign
                      </span>
                    </div>
                    <div className="p-6 pt-4 flex flex-col h-full">
                      <span className="text-cordillera-gold text-[11px] font-medium uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-serif text-cordillera-olive mt-1 mb-2 leading-snug group-hover:text-cordillera-gold transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-cordillera-olive/70 text-[13px] leading-relaxed line-clamp-2 md:line-clamp-3">
                        {(item as Campaign).description}
                      </p>
                      
                      {/* Progress Bar - fixed height to align with story spacer */}
                      <div className="mt-3 mb-4 h-14 md:h-16 flex flex-col justify-start">
                        <div className="flex justify-between text-cordillera-olive/80 text-[13px] mb-1.5">
                          <span>{getProgressPercentage((item as Campaign).currentAmount, (item as Campaign).goalAmount).toFixed(0)}% funded</span>
                          <span>₱{(item as Campaign).currentAmount.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-cordillera-sage/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cordillera-gold rounded-full transition-all duration-500"
                            style={{ width: `${getProgressPercentage((item as Campaign).currentAmount, (item as Campaign).goalAmount)}%` }}
                          ></div>
                        </div>
                        <p className="text-[11px] text-cordillera-olive/60 mt-1">Goal: ₱{(item as Campaign).goalAmount.toLocaleString()}</p>
                      </div>

                      <div className="mt-auto flex flex-col md:flex-row md:justify-between items-stretch md:items-center gap-2.5">
                        {user && (user as any).role === 'artisan' ? (
                          <button
                            disabled
                            title="Artisan accounts cannot support campaigns"
                            className="bg-gray-300 text-gray-600 px-5 py-2.5 text-sm font-medium rounded w-full md:w-auto text-center md:min-w-[128px] cursor-not-allowed"
                          >
                            Support Disabled
                          </button>
                        ) : (
                          <Link 
                            to={`/campaign/${item.id}`}
                            className="bg-cordillera-gold text-cordillera-olive px-5 py-2.5 text-sm font-medium hover:bg-cordillera-gold/90 transition-colors rounded cursor-pointer w-full md:w-auto text-center md:min-w-[128px]"
                          >
                            Support Now
                          </Link>
                        )}
                        <div className="text-center md:text-right text-[11px] text-cordillera-olive/60">
                          <p>By {(item as Campaign).organizer}</p>
                          <p>Ends {(item as Campaign).endDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-14 bg-cordillera-sage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoriesPage;
