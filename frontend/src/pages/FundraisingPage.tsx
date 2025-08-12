import React, { useState, useEffect } from 'react';

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
}

const FundraisingPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Sample campaigns data with beautiful images
    const sampleCampaigns: Campaign[] = [
      {
        id: 1,
        title: "Preserving Ancient Patterns Project",
        description: "Document and digitize centuries-old weaving patterns to ensure these precious designs are preserved for future generations of artisans.",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
        goalAmount: 150000,
        currentAmount: 112500,
        endDate: "March 15, 2025",
        category: "Documentation",
        organizer: "Heritage Foundation",
        featured: true
      },
      {
        id: 2,
        title: "Traditional Loom Restoration",
        description: "Restore and maintain traditional wooden looms used by master weavers in remote Cordillera villages.",
        image: "https://images.unsplash.com/photo-1582582494881-41e67beece72?w=800",
        goalAmount: 80000,
        currentAmount: 52000,
        endDate: "February 28, 2025",
        category: "Equipment",
        organizer: "Weaver's Guild",
        featured: false
      },
      {
        id: 3,
        title: "Youth Weaving Education Program",
        description: "Establish workshops to teach traditional weaving techniques to young people, ensuring cultural continuity.",
        image: "https://images.unsplash.com/photo-1594736797933-d0051ba0ff29?w=800",
        goalAmount: 120000,
        currentAmount: 75000,
        endDate: "April 10, 2025",
        category: "Education",
        organizer: "Cultural Center",
        featured: false
      },
      {
        id: 4,
        title: "Master Artisan Support Fund",
        description: "Provide financial support to elderly master weavers to continue their craft and share their knowledge.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25b9cd7db?w=800",
        goalAmount: 90000,
        currentAmount: 45000,
        endDate: "May 20, 2025",
        category: "Support",
        organizer: "Artisan Alliance",
        featured: false
      },
      {
        id: 5,
        title: "Cultural Heritage Documentation",
        description: "Create a comprehensive digital archive of weaving stories, techniques, and cultural significance.",
        image: "https://images.unsplash.com/photo-1565084287938-0bcf4d4b90d8?w=800",
        goalAmount: 200000,
        currentAmount: 130000,
        endDate: "June 30, 2025",
        category: "Documentation",
        organizer: "Digital Archive Project",
        featured: false
      },
      {
        id: 6,
        title: "Community Weaving Center",
        description: "Build a dedicated space where artisans can work, teach, and showcase their traditional weaving skills.",
        image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800",
        goalAmount: 300000,
        currentAmount: 180000,
        endDate: "August 15, 2025",
        category: "Infrastructure",
        organizer: "Community Development",
        featured: false
      }
    ];
    setCampaigns(sampleCampaigns);
  }, []);

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const featuredCampaign = campaigns.find(campaign => campaign.featured);
  const regularCampaigns = campaigns.filter(campaign => !campaign.featured);
  const categories = ['all', ...Array.from(new Set(campaigns.map(c => c.category)))];

  const filteredCampaigns = selectedCategory === 'all' 
    ? regularCampaigns 
    : regularCampaigns.filter(campaign => campaign.category === selectedCategory);

  return (
    <div className="min-h-screen bg-cordillera-cream">
      {/* Hero Section */}
      <section className="relative py-20 bg-cordillera-olive">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-light text-cordillera-cream mb-6 tracking-wide">
            Fundraising
          </h1>
          <p className="text-xl text-cordillera-cream/90 max-w-3xl mx-auto font-light leading-relaxed">
            Support community initiatives that preserve cultural heritage, 
            empower artisans, and ensure weaving traditions survive for future generations.
          </p>
        </div>
      </section>

      {/* Featured Campaign - Background image with sage green gradient overlay */}
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
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <span className="text-cordillera-gold text-sm font-medium uppercase tracking-wider mb-3 block">
                Featured Campaign
              </span>
              <h2 className="text-5xl font-serif text-cordillera-olive mb-6 leading-tight">
                {featuredCampaign.title}
              </h2>
              <p className="text-cordillera-olive/80 mb-8 text-xl leading-relaxed max-w-2xl">
                {featuredCampaign.description}
              </p>
              
              {/* Progress Bar in #8A784E (muted brown gold) */}
              <div className="mb-8 max-w-2xl">
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
                <p className="text-sm text-cordillera-olive/60 mt-2">Ends {featuredCampaign.endDate}</p>
              </div>

              <button className="bg-cordillera-gold text-cordillera-olive px-10 py-4 text-lg font-medium hover:bg-cordillera-olive hover:text-cordillera-cream transition-all duration-200">
                Support This Campaign
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Campaigns Section */}
      <section className="py-20 bg-cordillera-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-serif text-cordillera-olive mb-8">All Campaigns</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-cordillera-gold text-cordillera-olive'
                      : 'bg-cordillera-sage text-cordillera-olive hover:bg-cordillera-gold hover:text-cordillera-olive'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Campaign Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="group bg-white shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                {/* Campaign image with sage green gradient overlay on hover */}
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-cordillera-sage/0 group-hover:bg-cordillera-sage/20 transition-colors duration-300"></div>
                </div>
                
                <div className="p-8">
                  <span className="text-cordillera-gold text-xs font-medium uppercase tracking-wider">
                    {campaign.category}
                  </span>
                  <h3 className="text-xl font-serif text-cordillera-olive mt-2 mb-3 leading-tight">
                    {campaign.title}
                  </h3>
                  <p className="text-cordillera-olive/70 text-sm mb-6 leading-relaxed line-clamp-3">
                    {campaign.description}
                  </p>
                  
                  {/* Progress bar in muted brown gold */}
                  <div className="mb-6">
                    <div className="flex justify-between text-cordillera-olive/80 text-sm mb-2">
                      <span>{getProgressPercentage(campaign.currentAmount, campaign.goalAmount).toFixed(0)}% funded</span>
                      <span>₱{campaign.currentAmount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-cordillera-sage/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cordillera-gold rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage(campaign.currentAmount, campaign.goalAmount)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-cordillera-olive/50 mt-1">Goal: ₱{campaign.goalAmount.toLocaleString()}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <button className="bg-cordillera-gold text-cordillera-olive px-6 py-3 text-sm font-medium hover:bg-cordillera-gold/90 transition-colors">
                      Donate Now
                    </button>
                    <div className="text-right text-xs text-cordillera-olive/50">
                      <p>By {campaign.organizer}</p>
                      <p>Ends {campaign.endDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCampaigns.length === 0 && (
            <div className="text-center py-16">
              <p className="text-cordillera-olive/60 text-lg mb-4">
                No campaigns found in this category.
              </p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="bg-cordillera-gold text-cordillera-olive px-6 py-3 font-medium hover:bg-cordillera-gold/90 transition-colors"
              >
                View All Campaigns
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-cordillera-sage">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif text-cordillera-olive mb-6">
            Start Your Own Campaign
          </h2>
          <p className="text-cordillera-olive/80 text-lg mb-8 leading-relaxed">
            Have a project that supports Cordillera weaving heritage? Launch your own fundraising campaign 
            and rally community support for preserving our cultural traditions.
          </p>
          <button className="bg-cordillera-gold text-cordillera-olive px-8 py-4 text-lg font-medium hover:bg-cordillera-gold/90 transition-colors">
            Create Campaign
          </button>
        </div>
      </section>
    </div>
  );
};

export default FundraisingPage;