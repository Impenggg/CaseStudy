import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  type: 'campaign';
}

const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supportAmount, setSupportAmount] = useState(1000);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    // Simulate loading campaign data
    setTimeout(() => {
      const sampleCampaigns: Campaign[] = [
        {
          id: 101,
          title: "Preserving Ancient Patterns Project",
          description: "Document and digitize centuries-old weaving patterns to ensure these precious designs are preserved for future generations of artisans. This project will create a comprehensive digital archive of traditional Cordillera weaving patterns, including detailed documentation of techniques, materials, and cultural significance. The archive will serve as a valuable resource for weavers, researchers, and cultural preservationists.",
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
          description: "Restore and maintain traditional wooden looms used by master weavers in remote Cordillera villages. These looms are essential tools that have been passed down through generations. Many are in need of repair and restoration to ensure they can continue to be used for creating authentic Cordillera textiles.",
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
          description: "Establish workshops to teach traditional weaving techniques to young people, ensuring cultural continuity. This program will provide hands-on training in traditional weaving methods, natural dyeing techniques, and pattern creation. Participants will learn from master weavers and gain the skills needed to preserve and continue these important cultural traditions.",
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
          description: "Provide financial support to elderly master weavers to continue their craft and share their knowledge. Many master weavers are elderly and face financial challenges that prevent them from continuing their work or teaching others. This fund will provide stipends, materials, and support to ensure their valuable knowledge is preserved and shared.",
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

      const foundCampaign = sampleCampaigns.find(c => c.id === parseInt(id || '0'));
      setCampaign(foundCampaign || null);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const handleSupport = () => {
    setShowSupportModal(true);
  };

  const handleSupportSubmit = () => {
    triggerAction(`Support campaign: ${campaign?.title} with ₱${supportAmount.toLocaleString()}`);
    setShowSupportModal(false);
    setSupportForm({ name: '', email: '', message: '' });
    setSupportAmount(1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cordillera-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cordillera-gold mx-auto mb-4"></div>
          <p className="text-cordillera-olive">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-cordillera-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-cordillera-olive mb-4">Campaign Not Found</h1>
          <Link to="/stories" className="text-cordillera-gold hover:text-cordillera-gold/80 transition-colors">
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cordillera-cream">
      {/* Breadcrumb */}
      <div className="bg-cordillera-olive py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-cordillera-cream">
            <Link to="/stories" className="hover:text-cordillera-gold transition-colors">Stories</Link>
            <span>/</span>
            <span className="text-cordillera-cream/60">Campaign</span>
          </div>
        </div>
      </div>

      {/* Return Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link 
          to="/stories" 
          className="inline-flex items-center text-cordillera-olive hover:text-cordillera-gold transition-colors mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Stories
        </Link>
      </div>

             {/* Campaign Header */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
           <div className="aspect-[3/1] relative">
             <img
               src={campaign.image}
               alt={campaign.title}
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
             <div className="absolute bottom-4 left-4 right-4">
               <div className="bg-cordillera-gold/90 text-cordillera-olive px-3 py-1 text-sm font-semibold uppercase tracking-wider backdrop-blur-sm rounded inline-block mb-2">
                 Campaign
               </div>
               <h1 className="text-3xl md:text-4xl font-serif text-white mb-1 leading-tight">
                 {campaign.title}
               </h1>
               <p className="text-white/90 text-base">
                 By {campaign.organizer}
               </p>
             </div>
           </div>
         </div>
       </div>

      {/* Campaign Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-serif text-cordillera-olive mb-6">About This Campaign</h2>
              <p className="text-cordillera-olive/80 leading-relaxed mb-6">
                {campaign.description}
              </p>
              
              <div className="border-t border-cordillera-sage/30 pt-6">
                <h3 className="text-xl font-serif text-cordillera-olive mb-4">Campaign Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-cordillera-olive mb-2">Category</h4>
                    <p className="text-cordillera-olive/70">{campaign.category}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-cordillera-olive mb-2">Organizer</h4>
                    <p className="text-cordillera-olive/70">{campaign.organizer}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-cordillera-olive mb-2">End Date</h4>
                    <p className="text-cordillera-olive/70">{campaign.endDate}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-cordillera-olive mb-2">Featured</h4>
                    <p className="text-cordillera-olive/70">{campaign.featured ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-serif text-cordillera-olive mb-4">Support This Campaign</h3>
              
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-cordillera-olive/80 text-sm mb-2">
                  <span>{getProgressPercentage(campaign.currentAmount, campaign.goalAmount).toFixed(0)}% funded</span>
                  <span>₱{campaign.currentAmount.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-cordillera-sage/30 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-cordillera-gold rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage(campaign.currentAmount, campaign.goalAmount)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-cordillera-olive/60">Goal: ₱{campaign.goalAmount.toLocaleString()}</p>
              </div>

              {/* Support Button */}
              <button
                onClick={handleSupport}
                className="w-full bg-cordillera-gold text-cordillera-olive py-4 px-6 rounded-lg font-medium hover:bg-cordillera-gold/90 transition-colors"
              >
                Support This Campaign
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSupportModal(false)}></div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-xl font-serif text-cordillera-olive mb-4">Support This Campaign</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-cordillera-olive mb-2">Support Amount (₱)</label>
                    <input
                      type="number"
                      value={supportAmount}
                      onChange={(e) => setSupportAmount(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                      min="100"
                      step="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-cordillera-olive mb-2">Your Name</label>
                    <input
                      type="text"
                      value={supportForm.name}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-cordillera-olive mb-2">Email</label>
                    <input
                      type="email"
                      value={supportForm.email}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-cordillera-olive mb-2">Message (Optional)</label>
                    <textarea
                      value={supportForm.message}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 border border-cordillera-olive/20 rounded-lg focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                      rows={3}
                      placeholder="Leave a message of support..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowSupportModal(false)}
                    className="flex-1 px-4 py-3 border border-cordillera-olive/20 rounded-lg text-cordillera-olive hover:bg-cordillera-olive/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSupportSubmit}
                    className="flex-1 bg-cordillera-gold text-cordillera-olive px-4 py-3 rounded-lg font-medium hover:bg-cordillera-gold/90 transition-colors"
                  >
                    Support with ₱{supportAmount.toLocaleString()}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetailPage;
