import React, { useState, useEffect } from 'react';
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
      {/* Compact header (similar to marketplace but without image) */}
      <section className="bg-cordillera-olive py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-cordillera-cream mb-2">Stories & Campaigns</h1>
          <p className="text-cordillera-cream/80 max-w-3xl">
            Explore inspiring stories and support meaningful initiatives that preserve our cultural heritage.
          </p>
        </div>
      </section>

      {/* Featured Story - Full width with dark olive background */}
      {featuredStory && (
        <section className="relative py-12 bg-cordillera-olive">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-cordillera-olive border border-cordillera-gold/30 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-video md:aspect-[4/5] overflow-hidden">
                  <img
                    src={featuredStory.media_url}
                    alt={featuredStory.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="text-cordillera-gold text-sm font-medium uppercase tracking-wider mb-3">
                    Featured Story
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif text-cordillera-cream mb-4 leading-tight">
                    {featuredStory.title}
                  </h2>
                  <p className="text-cordillera-cream/80 mb-6 text-sm md:text-base leading-relaxed">
                    {featuredStory.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/story/${featuredStory.id}`}
                      className="group relative inline-flex items-center justify-center border-2 border-cordillera-cream text-cordillera-cream px-6 py-3 font-medium rounded-lg bg-cordillera-cream/10 backdrop-blur-sm shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-cordillera-gold hover:text-cordillera-olive hover:border-cordillera-gold"
                    >
                      <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Read Full Story
                    </Link>
                    <div className="text-right text-cordillera-cream/60 text-sm">
                      <p>By {featuredStory.author}</p>
                      <p>{featuredStory.readTime} min read</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Campaign - Sage green background with gradient overlay */}
      {featuredCampaign && (
        <section className="relative py-20">
          <div className="absolute inset-0">
            <img
              src={featuredCampaign.image}
              alt={featuredCampaign.title}
              className="w-full h-full object-cover"
            />
            {/* Sage green gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-cordillera-sage via-cordillera-sage/80 to-cordillera-sage/60"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <span className="text-cordillera-gold text-sm font-medium uppercase tracking-wider mb-3 inline-block">
                Featured Campaign
              </span>
              <h2 className="text-5xl font-serif text-cordillera-olive mb-6 leading-tight">
                {featuredCampaign.title}
              </h2>
              <p className="text-cordillera-olive/80 mb-8 text-xl leading-relaxed max-w-2xl mx-auto">
                {featuredCampaign.description}
              </p>
              
              {/* Progress Bar */}
              <div className="mb-8 max-w-2xl mx-auto">
                <div className="flex justify-between text-cordillera-olive/80 text-sm mb-3">
                  <span>Progress: {getProgressPercentage(featuredCampaign.currentAmount, featuredCampaign.goalAmount).toFixed(0)}%</span>
                  <span>₱{featuredCampaign.currentAmount.toLocaleString()} of ₱{featuredCampaign.goalAmount.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-cordillera-olive/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cordillera-gold rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage(featuredCampaign.currentAmount, featuredCampaign.goalAmount)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-cordillera-olive/60 mt-2">
                  <span>By {featuredCampaign.organizer}</span>
                  <span>Ends {featuredCampaign.endDate}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group relative bg-cordillera-gold text-cordillera-olive px-10 py-4 text-lg font-semibold transition-all duration-300 overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-0.5 rounded-lg">
                  <span className="relative z-10 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Support This Campaign
                  </span>
                  <div className="absolute inset-0 bg-cordillera-olive transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-cordillera-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-semibold">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Support This Campaign
                  </span>
                </button>
                
                <button className="group relative border-2 border-cordillera-gold text-cordillera-olive px-8 py-4 text-lg font-medium transition-all duration-300 hover:bg-cordillera-gold/10 backdrop-blur-sm rounded-lg">
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share Campaign
                  </span>
              </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Section - Cream green background */}
      <section className="py-20 bg-cordillera-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Filter Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-serif text-cordillera-olive mb-4">Heritage Content</h2>
              <p className="text-cordillera-olive/60 max-w-2xl mx-auto mb-6">
                Explore inspiring stories and support meaningful initiatives that preserve our cultural heritage
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search stories and campaigns..."
                    className="w-full px-6 py-4 pl-14 bg-white border-2 border-cordillera-sage/30 rounded-full text-cordillera-olive placeholder-cordillera-olive/50 focus:outline-none focus:border-cordillera-gold focus:ring-4 focus:ring-cordillera-gold/20 transition-all duration-300 shadow-md"
                  />
                  <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cordillera-olive/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-cordillera-olive/40 hover:text-cordillera-olive transition-colors"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Content Type Filter */}
            <div className="flex justify-center mb-6">
              <div className="bg-cordillera-sage/30 p-1 rounded-lg inline-flex">
                <button
                  onClick={() => setContentType('all')}
                  className={`px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-md ${
                    contentType === 'all'
                      ? 'bg-cordillera-gold text-cordillera-olive shadow-md'
                      : 'text-cordillera-olive hover:bg-cordillera-gold/20'
                  }`}
                >
                  All Content ({filteredContent.length})
                </button>
                <button
                  onClick={() => setContentType('stories')}
                  className={`px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-md ${
                    contentType === 'stories'
                      ? 'bg-cordillera-gold text-cordillera-olive shadow-md'
                      : 'text-cordillera-olive hover:bg-cordillera-gold/20'
                  }`}
                >
                  Stories ({totalStoryCount})
                </button>
                <button
                  onClick={() => setContentType('campaigns')}
                  className={`px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-md ${
                    contentType === 'campaigns'
                      ? 'bg-cordillera-gold text-cordillera-olive shadow-md'
                      : 'text-cordillera-olive hover:bg-cordillera-gold/20'
                  }`}
                >
                  Campaigns ({totalCampaignCount})
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                    selectedCategory === category
                      ? 'bg-cordillera-olive text-cordillera-cream shadow-md'
                      : 'bg-cordillera-sage text-cordillera-olive hover:bg-cordillera-olive hover:text-cordillera-cream'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
        </div>

            {/* Results Summary & Active Filters */}
            <div className="border-t border-cordillera-sage/30 pt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-cordillera-olive">
                    <span className="text-lg font-semibold">{filteredContent.length}</span>
                    <span className="text-sm text-cordillera-olive/60 ml-1">
                      {filteredContent.length === 1 ? 'result' : 'results'}
                      {(searchTerm || selectedCategory !== 'all' || contentType !== 'all') && ' found'}
                    </span>
                  </div>
                  {(searchTerm || selectedCategory !== 'all' || contentType !== 'all') && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-cordillera-gold hover:text-cordillera-olive transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Clear all filters
                    </button>
                  )}
                </div>
                
                {/* Active Filters Display */}
                {(searchTerm || selectedCategory !== 'all' || contentType !== 'all') && (
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cordillera-gold/20 text-cordillera-olive">
                        Search: "{searchTerm}"
                        <button
                          onClick={() => setSearchTerm('')}
                          className="ml-2 w-4 h-4 hover:text-cordillera-olive/60"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    )}
                    {contentType !== 'all' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cordillera-sage/30 text-cordillera-olive">
                        Type: {contentType === 'stories' ? 'Stories' : 'Campaigns'}
                        <button
                          onClick={() => setContentType('all')}
                          className="ml-2 w-4 h-4 hover:text-cordillera-olive/60"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    )}
                    {selectedCategory !== 'all' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cordillera-olive/20 text-cordillera-olive">
                        Category: {selectedCategory}
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className="ml-2 w-4 h-4 hover:text-cordillera-olive/60"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Combined Content Grid */}
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
                      {/* Story Badge */}
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
                      {/* Campaign Badge */}
                      <div className="absolute top-4 left-4 bg-cordillera-gold/90 text-cordillera-olive px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm rounded">
                        Campaign
                      </div>
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-cordillera-sage/0 group-hover:bg-cordillera-sage/20 transition-colors duration-300"></div>
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
                        <button className="bg-cordillera-gold text-cordillera-olive px-6 py-3 text-sm font-medium hover:bg-cordillera-gold/90 transition-colors rounded">
                          Support Now
                        </button>
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

          {/* Enhanced Empty State */}
          {regularContent.length === 0 && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-cordillera-sage/20 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-cordillera-olive/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif text-cordillera-olive mb-4">
                  No Content Found
                </h3>
                <p className="text-cordillera-olive/60 text-lg mb-8 leading-relaxed">
                  We couldn't find any {contentType === 'stories' ? 'stories' : contentType === 'campaigns' ? 'campaigns' : 'content'} matching your criteria. 
                  Try adjusting your filters or browse our full collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="group relative bg-cordillera-gold text-cordillera-olive px-8 py-4 font-semibold hover:bg-cordillera-gold/90 transition-all duration-300 overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-0.5 rounded-lg"
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    View All Content
                  </span>
                  <div className="absolute inset-0 bg-cordillera-olive transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-cordillera-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-semibold">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    View All Content
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Call to Action Section */}
      <section className="py-14 bg-cordillera-sage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Share Your Story */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <svg className="w-8 h-8 text-cordillera-gold mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-2xl font-serif text-cordillera-olive">Share Your Story</h3>
              </div>
              <p className="text-cordillera-olive/80 text-base mb-5 leading-relaxed">
                Are you a weaver with a story to tell? We'd love to feature your journey, 
                techniques, and cultural insights to inspire others and preserve our heritage.
              </p>
              <button className="group relative inline-flex items-center justify-center border-2 border-cordillera-olive text-cordillera-olive px-6 py-3 text-base font-medium rounded-lg bg-cordillera-cream/10 backdrop-blur-sm shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-cordillera-gold hover:text-cordillera-olive hover:border-cordillera-gold">
                <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Submit Your Story
              </button>
        </div>

            {/* Start Your Campaign */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <svg className="w-8 h-8 text-cordillera-gold mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="text-2xl font-serif text-cordillera-olive">Start Your Campaign</h3>
              </div>
              <p className="text-cordillera-olive/80 text-base mb-5 leading-relaxed">
                Have a project that supports Cordillera weaving heritage? Launch your own campaign 
                and rally community support for preserving our cultural traditions.
              </p>
              <button className="group relative inline-flex items-center justify-center border-2 border-cordillera-olive text-cordillera-olive px-6 py-3 text-base font-medium rounded-lg bg-cordillera-cream/10 backdrop-blur-sm shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-cordillera-gold hover:text-cordillera-olive hover:border-cordillera-gold">
                <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Create Campaign
              </button>
        </div>
      </div>
        </div>
      </section>
    </div>
  );
};

export default StoriesPage;
