import React, { useState, useEffect } from 'react';
import { triggerAction } from '../lib/uiActions';

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
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState(1000);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorMessage, setDonorMessage] = useState('');

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

  // Campaign interaction functions
  const openCampaignDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDetailsModalOpen(true);
  };

  const openDonationModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDonationModalOpen(true);
  };

  const handleDonation = () => {
    if (!selectedCampaign || !donorName || !donorEmail) {
      alert('Please fill in all required fields');
      return;
    }

    // Simulate donation processing
    triggerAction(`Donated ₱${donationAmount.toLocaleString()} to ${selectedCampaign.title}`);
    
    // Update campaign amount (in a real app, this would be an API call)
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === selectedCampaign.id 
        ? { ...campaign, currentAmount: campaign.currentAmount + donationAmount }
        : campaign
    ));

    // Reset form and close modal
    setDonationAmount(1000);
    setDonorName('');
    setDonorEmail('');
    setDonorMessage('');
    setIsDonationModalOpen(false);
    
    alert(`Thank you for your donation of ₱${donationAmount.toLocaleString()}!`);
  };

  const closeModals = () => {
    setIsDetailsModalOpen(false);
    setIsDonationModalOpen(false);
    setSelectedCampaign(null);
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

              <div className="flex gap-4">
                <button 
                  onClick={() => openCampaignDetails(featuredCampaign)} 
                  className="bg-cordillera-sage text-cordillera-olive px-8 py-4 text-lg font-medium hover:bg-cordillera-sage/80 transition-all duration-200"
                >
                  View Details
                </button>
                <button 
                  onClick={() => openDonationModal(featuredCampaign)} 
                  className="bg-cordillera-gold text-cordillera-olive px-10 py-4 text-lg font-medium hover:bg-cordillera-olive hover:text-cordillera-cream transition-all duration-200"
                >
                  Support This Campaign
                </button>
              </div>
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
                     <div className="flex gap-2">
                       <button 
                         onClick={() => openCampaignDetails(campaign)} 
                         className="bg-cordillera-sage text-cordillera-olive px-4 py-2 text-sm font-medium hover:bg-cordillera-sage/80 transition-colors"
                       >
                         View Details
                       </button>
                       <button 
                         onClick={() => openDonationModal(campaign)} 
                         className="bg-cordillera-gold text-cordillera-olive px-4 py-2 text-sm font-medium hover:bg-cordillera-gold/90 transition-colors"
                       >
                         Donate Now
                       </button>
                     </div>
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
              <button onClick={() => triggerAction('Create Campaign CTA')} className="bg-cordillera-gold text-cordillera-olive px-8 py-4 text-lg font-medium hover:bg-cordillera-gold/90 transition-colors">
            Create Campaign
          </button>
        </div>
      </section>

      {/* Campaign Details Modal */}
      {isDetailsModalOpen && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModals}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-cordillera-sage/20 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-serif text-cordillera-olive">Campaign Details</h2>
              <button onClick={closeModals} className="text-cordillera-olive/60 hover:text-cordillera-olive">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <img 
                    src={selectedCampaign.image} 
                    alt={selectedCampaign.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <span className="text-cordillera-gold text-sm font-medium uppercase tracking-wider mb-3 block">
                    {selectedCampaign.category}
                  </span>
                  <h3 className="text-2xl font-serif text-cordillera-olive mb-4">
                    {selectedCampaign.title}
                  </h3>
                  <p className="text-cordillera-olive/70 mb-6 leading-relaxed">
                    {selectedCampaign.description}
                  </p>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-cordillera-olive/80 text-sm mb-2">
                      <span>Progress: {getProgressPercentage(selectedCampaign.currentAmount, selectedCampaign.goalAmount).toFixed(0)}%</span>
                      <span>₱{selectedCampaign.currentAmount.toLocaleString()} of ₱{selectedCampaign.goalAmount.toLocaleString()}</span>
                    </div>
                    <div className="h-3 bg-cordillera-sage/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cordillera-gold rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage(selectedCampaign.currentAmount, selectedCampaign.goalAmount)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm text-cordillera-olive/60 mb-6">
                    <p><strong>Organizer:</strong> {selectedCampaign.organizer}</p>
                    <p><strong>End Date:</strong> {selectedCampaign.endDate}</p>
                    <p><strong>Goal:</strong> ₱{selectedCampaign.goalAmount.toLocaleString()}</p>
                    <p><strong>Current:</strong> ₱{selectedCampaign.currentAmount.toLocaleString()}</p>
                  </div>
                  
                                     <div className="flex gap-3">
                     <button 
                       onClick={() => {
                         setIsDetailsModalOpen(false);
                         openDonationModal(selectedCampaign);
                       }}
                       className="bg-cordillera-gold text-cordillera-olive px-6 py-3 font-medium hover:bg-cordillera-gold/90 transition-colors rounded-lg"
                     >
                       Support This Campaign
                     </button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Donation Modal */}
      {isDonationModalOpen && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModals}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-cordillera-sage/20">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-serif text-cordillera-olive">Make a Donation</h2>
                <button onClick={closeModals} className="text-cordillera-olive/60 hover:text-cordillera-olive">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-cordillera-olive/70 text-sm mt-2">
                Supporting: <strong>{selectedCampaign.title}</strong>
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-cordillera-olive mb-2">Donation Amount (₱)</label>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-cordillera-sage/30 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                  min="100"
                  step="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-cordillera-olive mb-2">Your Name *</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-2 border border-cordillera-sage/30 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-cordillera-olive mb-2">Email Address *</label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-cordillera-sage/30 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-cordillera-olive mb-2">Message (Optional)</label>
                <textarea
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-cordillera-sage/30 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                  rows={3}
                  placeholder="Share why you're supporting this campaign..."
                />
              </div>
              
              <button 
                onClick={handleDonation}
                className="w-full bg-cordillera-gold text-cordillera-olive py-3 font-medium hover:bg-cordillera-gold/90 transition-colors rounded-lg"
              >
                Donate ₱{donationAmount.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default FundraisingPage;