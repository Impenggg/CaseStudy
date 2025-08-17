import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { triggerAction } from '../lib/uiActions';
import { useAuth } from '../contexts/AuthContext';
import api, { campaignsAPI } from '@/services/api';

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
  const { isAuthenticated, requireAuth } = useAuth();
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
    let mounted = true;
    (async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        console.debug('[CampaignDetail] BaseURL:', api.defaults.baseURL);
        console.debug('[CampaignDetail] Fetching campaign by id:', id);
        const data = await campaignsAPI.getById(Number(id));
        // Resolve image URL if backend returns a relative path
        const API_ORIGIN = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');
        const resolveImage = (image?: string | null) => {
          if (!image) return '';
          if (image.startsWith('http://') || image.startsWith('https://')) return image;
          return `${API_ORIGIN}/${image.replace(/^\/?/, '')}`;
        };
        const mapped: Campaign = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          image: resolveImage(data.image),
          goalAmount: Number((data as any).goal_amount ?? 0),
          currentAmount: Number((data as any).current_amount ?? 0),
          endDate: data.end_date ? new Date(data.end_date).toLocaleDateString() : '',
          category: (data as any).category || 'community',
          organizer: (data as any).organizer?.name || 'Organizer',
          featured: false,
          type: 'campaign',
        };
        if (mounted) setCampaign(mapped);
      } catch (e: any) {
        console.error('[CampaignDetail] Fetch error:', e?.response?.status, e?.response?.data || e);
        if (mounted) setCampaign(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const handleSupport = () => {
    // Require auth before supporting a campaign
    if (!isAuthenticated) {
      if (id) sessionStorage.setItem('resume_support_campaign_id', id);
      sessionStorage.setItem('resume_support', '1');
      requireAuth('/login');
      return;
    }
    setShowSupportModal(true);
  };

  const handleSupportSubmit = () => {
    triggerAction(`Support campaign: ${campaign?.title} with ₱${supportAmount.toLocaleString()}`);
    setShowSupportModal(false);
    setSupportForm({ name: '', email: '', message: '' });
    setSupportAmount(1000);
  };

  // Resume support modal after login
  useEffect(() => {
    if (isAuthenticated) {
      const resume = sessionStorage.getItem('resume_support');
      const cid = sessionStorage.getItem('resume_support_campaign_id');
      if (resume === '1' && cid && id === cid) {
        sessionStorage.removeItem('resume_support');
        sessionStorage.removeItem('resume_support_campaign_id');
        setShowSupportModal(true);
      }
    }
  }, [isAuthenticated, id]);

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
