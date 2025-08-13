import React, { useState, useEffect } from 'react';
import { triggerAction } from '../lib/uiActions';
import { Link } from 'react-router-dom';

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
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contentType, setContentType] = useState<'all' | 'stories' | 'campaigns'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sample stories data with beautiful images
    const sampleStories: Story[] = [
      {
        id: 1,
        title: "Master Weaver Maria's Journey",
        content: "Discover how Maria preserves 300-year-old weaving techniques and passes them down to the next generation...",
        media_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
        author: "Maria Santos",
        date: "December 15, 2024",
        category: "Artisan Profile",
        readTime: 8,
        featured: true,
        type: 'story'
      },
      {
        id: 2,
        title: "The Art of Natural Dyeing",
        content: "Learning traditional plant-based coloring methods that have been used for centuries in Cordillera textiles...",
        media_url: "https://images.unsplash.com/photo-1582582494881-41e67beece72?w=800",
        author: "Carlos Mendoza",
        date: "December 10, 2024",
        category: "Techniques",
        readTime: 6,
        featured: false,
        type: 'story'
      },
      {
        id: 3,
        title: "Young Weavers, Ancient Traditions",
        content: "How millennials are embracing traditional crafts and bringing fresh perspectives to age-old practices...",
        media_url: "https://images.unsplash.com/photo-1594736797933-d0051ba0ff29?w=800",
        author: "Ana Bautista",
        date: "December 5, 2024",
        category: "Cultural Heritage",
        readTime: 10,
        featured: false,
        type: 'story'
      },
      {
        id: 4,
        title: "Preserving Cultural Patterns",
        content: "The significance of geometric designs in Cordillera textiles and their spiritual meaning in community life...",
        media_url: "https://images.unsplash.com/photo-1558618666-fcd25b9cd7db?w=800",
        author: "Roberto Calam",
        date: "November 28, 2024",
        category: "Cultural Heritage",
        readTime: 7,
        featured: false,
        type: 'story'
      },
      {
        id: 5,
        title: "From Loom to Market",
        content: "The journey of a handwoven textile from creation to the hands of appreciative buyers worldwide...",
        media_url: "https://images.unsplash.com/photo-1565084287938-0bcf4d4b90d8?w=800",
        author: "Elena Cruz",
        date: "November 20, 2024",
        category: "Business",
        readTime: 5,
        featured: false,
        type: 'story'
      }
    ];

    // Sample campaigns data
    const sampleCampaigns: Campaign[] = [
      {
        id: 101,
        title: "Preserving Ancient Patterns Project",
        description: "Document and digitize centuries-old weaving patterns to ensure these precious designs are preserved for future generations of artisans.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        goalAmount: 150000,
        currentAmount: 112500,
        endDate: "March 15, 2025",
        category: "Documentation",
        organizer: "Heritage Foundation",
        featured: false,
        type: 'campaign'
      },
      {
        id: 102,
        title: "Traditional Loom Restoration",
        description: "Restore and maintain traditional wooden looms used by master weavers in remote Cordillera villages.",
        image: "https://images.unsplash.com/photo-1607081692251-5bb4c0940e1e?w=800",
        goalAmount: 80000,
        currentAmount: 52000,
        endDate: "February 28, 2025",
        category: "Equipment",
        organizer: "Weaver's Guild",
        featured: false,
        type: 'campaign'
      },
      {
        id: 103,
        title: "Youth Weaving Education Program",
        description: "Establish workshops to teach traditional weaving techniques to young people, ensuring cultural continuity.",
        image: "https://images.unsplash.com/photo-1594736797933-d0051ba0ff29?w=800",
        goalAmount: 120000,
        currentAmount: 75000,
        endDate: "April 10, 2025",
        category: "Education",
        organizer: "Cultural Center",
        featured: true,
        type: 'campaign'
      },
      {
        id: 104,
        title: "Master Artisan Support Fund",
        description: "Provide financial support to elderly master weavers to continue their craft and share their knowledge.",
        image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800",
        goalAmount: 90000,
        currentAmount: 45000,
        endDate: "May 20, 2025",
        category: "Support",
        organizer: "Artisan Alliance",
        featured: false,
        type: 'campaign'
      }
    ];

    // Simulate loading time for realistic experience
    setTimeout(() => {
      // Combine all content
      const combined = [...sampleStories, ...sampleCampaigns];
      setAllContent(combined);
      setFilteredContent(combined);
      setIsLoading(false);
    }, 1000);
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

  // Get featured content (prioritize stories, then campaigns)
  const featuredStory = allContent.find(item => item.type === 'story' && item.featured) as Story;
  const featuredCampaign = allContent.find(item => item.type === 'campaign' && item.featured) as Campaign;
  
  // Regular content (non-featured)
  const regularContent = filteredContent.filter(item => !item.featured);
  
  // Get all categories from both stories and campaigns
  const categories = ['all', ...Array.from(new Set(allContent.map(item => item.category)))];
  
  // Content type counts (showing available counts, not filtered counts)
  const totalStoryCount = allContent.filter(item => item.type === 'story').length;
  const totalCampaignCount = allContent.filter(item => item.type === 'campaign').length;

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setContentType('all');
  };

  // Loading component
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cordillera-olive flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cordillera-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-serif text-cordillera-cream mb-2">Loading Heritage Content</h2>
          <p className="text-cordillera-cream/70">Gathering stories and campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cordillera-olive">
      {/* Compact header */}
      <section className="bg-cordillera-olive py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-cordillera-cream mb-2">Stories & Campaigns</h1>
          <p className="text-cordillera-cream/80 max-w-3xl">
            Explore inspiring stories and support meaningful initiatives that preserve our cultural heritage.
          </p>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-20 bg-cordillera-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularContent.map((item) => (
              <div key={`${item.type}-${item.id}`} className="group block bg-white shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-lg border border-cordillera-sage/20">
                {item.type === 'story' ? (
                  // Story Card
                  <Link to={`/story/${item.id}`} className="block">
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={(item as Story).media_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-cordillera-olive/90 text-cordillera-cream px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm rounded">
                        Story
                      </div>
                    </div>
                    <div className="p-8">
                      <span className="text-cordillera-gold text-xs font-medium uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-xl font-serif text-cordillera-olive mt-2 mb-3 leading-tight group-hover:text-cordillera-gold transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-cordillera-olive/70 text-sm mb-6 leading-relaxed line-clamp-3">
                        {(item as Story).content}
                      </p>
                      <div className="flex justify-between items-center text-xs text-cordillera-olive/50">
                        <span>By {(item as Story).author}</span>
                        <span>{(item as Story).readTime} min read</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  // Campaign Card
                  <div>
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={(item as Campaign).image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-cordillera-gold/90 text-cordillera-olive px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm rounded">
                        Campaign
                      </div>
                    </div>
                    <div className="p-8">
                      <span className="text-cordillera-gold text-xs font-medium uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-xl font-serif text-cordillera-olive mt-2 mb-3 leading-tight group-hover:text-cordillera-gold transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-cordillera-olive/70 text-sm mb-6 leading-relaxed line-clamp-3">
                        {(item as Campaign).description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-cordillera-olive/80 text-sm mb-2">
                          <span>{getProgressPercentage((item as Campaign).currentAmount, (item as Campaign).goalAmount).toFixed(0)}% funded</span>
                          <span>₱{(item as Campaign).currentAmount.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-cordillera-sage/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cordillera-gold rounded-full transition-all duration-500"
                            style={{ width: `${getProgressPercentage((item as Campaign).currentAmount, (item as Campaign).goalAmount)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-cordillera-olive/50 mt-1">Goal: ₱{(item as Campaign).goalAmount.toLocaleString()}</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <Link 
                          to={`/campaign/${item.id}`}
                          className="bg-cordillera-gold text-cordillera-olive px-6 py-3 text-sm font-medium hover:bg-cordillera-gold/90 transition-colors rounded cursor-pointer"
                        >
                          Support Now
                        </Link>
                        <div className="text-right text-xs text-cordillera-olive/50">
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
