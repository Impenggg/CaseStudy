import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BackLink from '@/components/BackLink';
import { triggerAction } from '../lib/uiActions';
import { useAuth } from '../contexts/AuthContext';
import api, { campaignsAPI, donationsAPI } from '@/services/api';

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
  const { isAuthenticated, requireAuth, user } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supportAmount, setSupportAmount] = useState(1000);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [polling, setPolling] = useState<{ active: boolean; attempts: number }>()

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

  // Helper to refresh campaign details (used by polling)
  const refreshCampaign = async () => {
    if (!id) return;
    const data = await campaignsAPI.getById(Number(id));
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
    setCampaign(mapped);
  };

  // Continuous light polling while viewing the page (every 10s)
  useEffect(() => {
    if (!id) return;
    let interval: number | undefined;
    interval = window.setInterval(async () => {
      try { await refreshCampaign(); } catch {}
    }, 10000);
    return () => { if (interval) window.clearInterval(interval); };
  }, [id]);

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const handleSupport = () => {
    // Block artisans from supporting campaigns
    if (user && (user as any).role === 'artisan') {
      triggerAction('Artisan accounts cannot support campaigns');
      return;
    }
    // Require auth before supporting a campaign
    if (!isAuthenticated) {
      if (id) sessionStorage.setItem('resume_support_campaign_id', id);
      sessionStorage.setItem('resume_support', '1');
      requireAuth('/login');
      return;
    }
    setShowSupportModal(true);
  };

  const handleSupportSubmit = async () => {
    if (!id || !campaign) return;
    // Safety: block artisans at submit time as well
    if (user && (user as any).role === 'artisan') {
      triggerAction('Artisan accounts cannot support campaigns');
      return;
    }
    if (supportAmount <= 0) return;
    setIsSubmitting(true);
    try {
      // Submit donation
      await donationsAPI.create({
        campaign_id: Number(id),
        amount: supportAmount,
        message: supportForm.message || undefined,
        anonymous: false,
        payment_method: 'card',
      } as any);

      // Optimistic UI update
      setCampaign(prev => prev ? { ...prev, currentAmount: prev.currentAmount + supportAmount } : prev);
      triggerAction(`Support campaign: ${campaign.title} with ₱${supportAmount.toLocaleString()}`);

      // Start short polling (10 attempts every 2s) to reflect server total and other supporters in near real-time
      let attempts = 0;
      const maxAttempts = 10;
      const interval = setInterval(async () => {
        attempts += 1;
        try { await refreshCampaign(); } catch {}
        if (attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 2000);

      setShowSupportModal(false);
      setSupportForm({ name: '', email: '', message: '' });
      setSupportAmount(1000);
    } catch (e: any) {
      console.error('[CampaignDetail] Support failed', e);
      triggerAction('Failed to support campaign');
    } finally {
      setIsSubmitting(false);
    }
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
        <BackLink to="/stories" className="mb-6">Back to Stories</BackLink>
      </div>

      {/* Title & Meta below breadcrumb and return button (consistent with StoryDetailPage) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <h1 className="text-3xl md:text-4xl font-serif text-cordillera-olive mb-2 leading-tight">
          {campaign.title}
        </h1>
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-cordillera-olive/80">
          <span className="bg-cordillera-gold/30 text-cordillera-olive px-2.5 py-1 text-xs uppercase tracking-wider rounded">Campaign</span>
          <span className="hidden sm:inline">•</span>
          <span>By {campaign.organizer}</span>
          {campaign.endDate && (<>
            <span className="hidden sm:inline">•</span>
            <span>Ends {campaign.endDate}</span>
          </>)}
        </div>
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
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
