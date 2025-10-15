import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BackLink from '@/components/BackLink';
import { triggerAction } from '../lib/uiActions';
import { useAuth } from '../contexts/AuthContext';
import api, { campaignsAPI, donationsAPI, uploadAPI } from '@/services/api';
import type { CampaignExpenditure } from '@/types';

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
  organizerId?: number;
  featured: boolean;
  status?: string;
  type: 'campaign';
}

type TransparencySummary = {
  donations_total: number;
  expenditures_total: number;
  utilization_percentage: number;
  donations_count: number;
  expenditures_count: number;
} | null;

type DonationItem = {
  id: number;
  amount: number;
  message?: string;
  anonymous: boolean;
  donor?: { id: number; name: string } | null;
  created_at: string;
};

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

  // Transparency / History states
  const [activeTab, setActiveTab] = useState<'overview' | 'transparency' | 'history'>('overview');

  const [transparency, setTransparency] = useState<TransparencySummary>(null);
  const [expenditures, setExpenditures] = useState<CampaignExpenditure[]>([]);
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [loadingExtras, setLoadingExtras] = useState<boolean>(false);

  // Organizer/admin-only expenditure form
  const [newExp, setNewExp] = useState<{ title: string; description?: string; amount: string; used_at?: string; attachment?: File | null }>(
    {
      title: '',
      description: '',
      amount: '',
      used_at: '',
      attachment: null,
    }
  );
  const [savingExp, setSavingExp] = useState<boolean>(false);
  // Editing/deleting expenditures (organizer/admin only)
  const [editingExp, setEditingExp] = useState<CampaignExpenditure | null>(null);
  const [editExp, setEditExp] = useState<{ title: string; description?: string; amount: string; used_at?: string }>({
    title: '', description: '', amount: '', used_at: ''
  });
  const [updatingExp, setUpdatingExp] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Helpers
  const formatCurrency = (value?: number | string | null) => {
    const n = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
    if (!Number.isFinite(n as number)) return '₱0';
    return `₱${(n as number).toLocaleString()}`;
  };

  const formatDate = (value?: string | null) => {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isOrganizerOrAdmin = !!(
    user && campaign && (((user as any).role === 'admin') || ((user as any).id === (campaign as any).organizerId))
  );
  const isCustomer = !!(user && (user as any).role === 'customer');

  const handleCreateExpenditure = async () => {
    if (!id || !campaign) return;
    if (!isAuthenticated) { requireAuth('/login'); return; }
    if (!isOrganizerOrAdmin) { triggerAction('Only the organizer or an admin can add expenditures'); return; }

    const title = (newExp.title || '').trim();
    const amountNum = parseFloat(newExp.amount || '');
    if (!title || !Number.isFinite(amountNum) || amountNum <= 0) {
      triggerAction('Please provide a valid title and amount');
      return;
    }

    setSavingExp(true);
    try {
      let created = false;
      // 1) Try direct multipart submit with 'attachment' field (common Laravel pattern)
      if (newExp.attachment) {
        try {
          const form = new FormData();
          form.append('title', title);
          if (newExp.description?.trim()) form.append('description', newExp.description.trim());
          form.append('amount', String(amountNum));
          if (newExp.used_at) form.append('used_at', newExp.used_at);
          form.append('attachment', newExp.attachment);
          await api.post(`/campaigns/${id}/expenditures`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          created = true;
        } catch (mpErr) {
          console.error('[CampaignDetail] Multipart create failed, will fallback to upload+JSON', mpErr);
        }
      }

      // 2) Fallback: separate upload (if any) then JSON create with attachment_path
      if (!created) {
        let attachment_path: string | undefined;
        if (newExp.attachment) {
          try {
            const uploadRes: any = await uploadAPI.uploadFile(newExp.attachment);
            attachment_path = uploadRes?.path ?? uploadRes?.data?.path ?? uploadRes?.data?.data?.path;
          } catch (upErr) {
            console.error('[CampaignDetail] Attachment upload failed, continuing without attachment', upErr);
            triggerAction('Attachment upload failed, saving without attachment.');
          }
        }

        await campaignsAPI.createExpenditure(Number(id), {
          title,
          description: newExp.description?.trim() || undefined,
          amount: amountNum,
          used_at: newExp.used_at || undefined,
          attachment_path,
        });
      }

      setNewExp({ title: '', description: '', amount: '', used_at: '', attachment: null });
      triggerAction('Expenditure saved');
      try { await Promise.all([loadSupplemental(), refreshCampaign()]); } catch {}
    } catch (e: any) {
      console.error('[CampaignDetail] Create expenditure failed', e);
      const resp = e?.response;
      const backendErrors = resp?.data?.errors;
      let msg = resp?.data?.message || 'Failed to save expenditure';
      if (backendErrors && typeof backendErrors === 'object') {
        try {
          const list = Object.values(backendErrors).flat() as string[];
          if (list.length) msg = list.join(' ');
        } catch {}
      }
      triggerAction(msg);
    } finally {
      setSavingExp(false);
    }
  };

  // Start editing an expenditure
  const handleEditExpenditure = (exp: CampaignExpenditure) => {
    setEditingExp(exp);
    setEditExp({
      title: exp.title || '',
      description: exp.description || '',
      amount: String(exp.amount ?? ''),
      used_at: exp.used_at || '',
    });
  };

  const handleCancelEditExpenditure = () => {
    setEditingExp(null);
    setEditExp({ title: '', description: '', amount: '', used_at: '' });
  };

  const handleUpdateExpenditure = async () => {
    if (!id || !editingExp) return;
    if (!isOrganizerOrAdmin) { triggerAction('Only the organizer or an admin can update expenditures'); return; }
    const title = (editExp.title || '').trim();
    const amountNum = parseFloat(editExp.amount || '');
    if (!title || !Number.isFinite(amountNum) || amountNum <= 0) {
      triggerAction('Please provide a valid title and amount');
      return;
    }
    setUpdatingExp(true);
    try {
      await campaignsAPI.updateExpenditure(Number(id), editingExp.id, {
        title,
        description: (editExp.description || '').trim() || undefined,
        amount: amountNum,
        used_at: editExp.used_at || undefined,
      });
      triggerAction('Expenditure updated');
      setEditingExp(null);
      setEditExp({ title: '', description: '', amount: '', used_at: '' });
      try { await loadSupplemental(); } catch {}
    } catch (e) {
      console.error('[CampaignDetail] Update expenditure failed', e);
      triggerAction('Failed to update expenditure');
    } finally {
      setUpdatingExp(false);
    }
  };

  const handleDeleteExpenditure = async (exp: CampaignExpenditure) => {
    if (!id) return;
    if (!isOrganizerOrAdmin) { triggerAction('Only the organizer or an admin can delete expenditures'); return; }
    const ok = window.confirm(`Delete expenditure "${exp.title}"? This cannot be undone.`);
    if (!ok) return;
    setDeletingId(exp.id);
    try {
      await campaignsAPI.deleteExpenditure(Number(id), exp.id);
      triggerAction('Expenditure deleted');
      try { await loadSupplemental(); } catch {}
    } catch (e) {
      console.error('[CampaignDetail] Delete expenditure failed', e);
      triggerAction('Failed to delete expenditure');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      setIsLoading(true);
      try {
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
          organizerId: (data as any).organizer?.id,
          featured: false,
          status: (data as any).status,
          type: 'campaign',
        };
        if (mounted) {
          setCampaign(mapped);
          setTransparency((data as any)?.transparency || null);
        }
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
      organizerId: (data as any).organizer?.id,
      featured: false,
      status: (data as any).status,
      type: 'campaign',
    };
    setCampaign(mapped);
    setTransparency((data as any)?.transparency || null);
  };

  // Load expenditures and donations history
  const loadSupplemental = async () => {
    if (!id) return;
    setLoadingExtras(true);
    try {
      const [exps, dons] = await Promise.all([
        campaignsAPI.getExpenditures(Number(id)),
        campaignsAPI.getCampaignDonations(Number(id), { per_page: 50 }),
      ]);
      setExpenditures(exps || []);
      setDonations((dons?.data as DonationItem[]) || []);
    } catch (e) {
      // silent
    } finally {
      setLoadingExtras(false);
    }
  };

  useEffect(() => {
    loadSupplemental();
  }, [id]);

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
    // Block any non-customer roles from supporting campaigns (UI guard to match backend)
    if (user && (user as any).role !== 'customer') {
      triggerAction('This account type cannot support campaigns');
      return;
    }
    // Block if campaign is not active
    if (campaign && (campaign as any).status && (campaign as any).status !== 'active') {
      triggerAction('This campaign is not active');
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
    // Safety: block artisans/admins at submit time as well
    if (user && (((user as any).role === 'artisan') || ((user as any).role === 'admin'))) {
      triggerAction('This account type cannot support campaigns');
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
      const resp = e?.response;
      const backendErrors = resp?.data?.errors;
      let msg = resp?.data?.message || 'Failed to support campaign';
      if (backendErrors && typeof backendErrors === 'object') {
        try {
          const list = Object.values(backendErrors).flat() as string[];
          if (list.length) msg = list.join(' ');
        } catch {}
      }
      triggerAction(msg);
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
      <div className="min-h-screen bg-heritage-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-500 mx-auto mb-4"></div>
          <p className="text-heritage-800">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-heritage-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-heritage-800 mb-4">Campaign Not Found</h1>
          <Link to="/campaigns" className="text-heritage-500 hover:text-heritage-500/80 transition-colors">
            Back to Campaigns
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-heritage-800">

      {/* Breadcrumb */}
      <div className="bg-heritage-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center text-sm text-heritage-100/80">
            <Link to="/campaigns" className="hover:text-heritage-100 transition-colors">Campaigns</Link>
            <span className="mx-2">/</span>
            <span className="text-heritage-100/60">Campaign</span>
          </nav>
        </div>
      </div>

      {/* Return Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BackLink to="/campaigns" variant="light" className="mb-4">Back to Campaigns</BackLink>
      </div>

      {/* Title & Meta below breadcrumb and return button */}
      <section className="bg-heritage-800 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-serif text-heritage-100 mb-3 leading-tight">
              {campaign.title}
            </h1>
          </div>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-heritage-100/80">
            <span className="text-heritage-500 font-medium">By {campaign.organizer}</span>
            {campaign.endDate && (<>
              <span className="hidden sm:inline">•</span>
              <span>{campaign.endDate}</span>
            </>)}
            <span className="hidden sm:inline">•</span>
            <span className="bg-heritage-500/20 px-3 py-1 text-sm">{campaign.category || 'community'}</span>
          </div>
        </div>
      </section>

      {/* Removed extra header card to match StoryDetailPage */}

      {/* Campaign Content (cream section like StoryDetailPage) */}
      <section className="py-16 bg-heritage-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="mb-6 flex gap-2">
              {(['overview','transparency','history'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded border ${activeTab === tab ? 'bg-heritage-500 text-heritage-800 border-heritage-500' : 'bg-white text-heritage-800/80 border-brand-sage hover:bg-heritage-100'}`}
                >
                  {tab === 'overview' ? 'Overview' : tab === 'transparency' ? 'Transparency' : 'Donation History'}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="mb-10">
                <article className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-serif text-heritage-800 mb-4">About This Campaign</h2>
                  <p className="text-heritage-800/80 leading-relaxed">{campaign.description}</p>
                </article>
                <div className="mt-8 pt-6 border-t border-brand-sage/30">
                  <h3 className="text-xl font-serif text-heritage-800 mb-4">Campaign Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-heritage-800 mb-2">Category</h4>
                      <p className="text-heritage-800/70">{campaign.category}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-heritage-800 mb-2">Organizer</h4>
                      <p className="text-heritage-800/70">{campaign.organizer}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-heritage-800 mb-2">End Date</h4>
                      <p className="text-heritage-800/70">{campaign.endDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transparency' && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-white border border-brand-sage p-6">
                  <h3 className="text-xl font-serif text-heritage-800 mb-4">Transparency Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-heritage-800">
                    <div>
                      <div className="text-sm text-heritage-800/60">Total Donations</div>
                      <div className="text-lg font-semibold">{formatCurrency(transparency?.donations_total)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-heritage-800/60">Total Spent</div>
                      <div className="text-lg font-semibold">{formatCurrency(transparency?.expenditures_total)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-heritage-800/60">Utilization</div>
                      <div className="text-lg font-semibold">{(transparency?.utilization_percentage ?? 0).toFixed(2)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-heritage-800/60">Records</div>
                      <div className="text-lg font-semibold">{(transparency?.expenditures_count ?? 0)} expenditures</div>
                    </div>
                  </div>
                </div>

                {/* Expenditures list */}
                <div className="bg-white border border-brand-sage p-6">
                  <h3 className="text-xl font-serif text-heritage-800 mb-4">Expenditures</h3>
                  {loadingExtras ? (
                    <div className="text-heritage-800/70">Loading...</div>
                  ) : expenditures.length === 0 ? (
                    <div className="text-heritage-800/70">No expenditures recorded yet.</div>
                  ) : (
                    <ul className="divide-y divide-brand-sage/30">
                      {expenditures.map(exp => (
                        <li key={exp.id} className="py-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="font-medium text-heritage-800">{exp.title}</div>
                              {exp.description && <div className="text-sm text-heritage-800/70">{exp.description}</div>}
                              <div className="text-xs text-heritage-800/60">{formatDate(exp.used_at)} by {exp.creator?.name || 'Organizer'}</div>
                              {exp.attachment_path && (
                                <a className="text-xs text-heritage-500 hover:underline" href={exp.attachment_path.startsWith('http') ? exp.attachment_path : `${(api.defaults.baseURL || '').replace(/\/api\/??$/, '')}/${exp.attachment_path}`} target="_blank" rel="noreferrer">View Attachment</a>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-heritage-800 font-semibold">{formatCurrency(exp.amount as any)}</div>
                              {isOrganizerOrAdmin && (
                                <div className="flex items-center gap-2">
                                  <button onClick={() => handleEditExpenditure(exp)} className="px-2 py-1 text-xs border rounded hover:bg-heritage-100">Edit</button>
                                  <button onClick={() => handleDeleteExpenditure(exp)} disabled={deletingId === exp.id} className="px-2 py-1 text-xs border border-error/30 text-error-dark rounded hover:bg-error/10 disabled:opacity-60">{deletingId === exp.id ? 'Deleting…' : 'Delete'}</button>
                                </div>
                              )}
                            </div>
                          </div>
                          {isOrganizerOrAdmin && editingExp?.id === exp.id && (
                            <div className="mt-3 p-3 bg-heritage-100 border border-brand-sage rounded">
                              <div className="grid md:grid-cols-2 gap-3">
                                <div className="md:col-span-2">
                                  <label className="block text-xs text-heritage-800 mb-1">Title</label>
                                  <input className="w-full px-3 py-2 border border-brand-sage rounded" value={editExp.title} onChange={(e) => setEditExp(prev => ({ ...prev, title: e.target.value }))} />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs text-heritage-800 mb-1">Description</label>
                                  <textarea className="w-full px-3 py-2 border border-brand-sage rounded" rows={3} value={editExp.description} onChange={(e) => setEditExp(prev => ({ ...prev, description: e.target.value }))} />
                                </div>
                                <div>
                                  <label className="block text-xs text-heritage-800 mb-1">Amount (₱)</label>
                                  <input type="number" className="w-full px-3 py-2 border border-brand-sage rounded" value={editExp.amount} onChange={(e) => setEditExp(prev => ({ ...prev, amount: e.target.value }))} />
                                </div>
                                <div>
                                  <label className="block text-xs text-heritage-800 mb-1">Used At</label>
                                  <input type="date" className="w-full px-3 py-2 border border-brand-sage rounded" value={editExp.used_at} onChange={(e) => setEditExp(prev => ({ ...prev, used_at: e.target.value }))} />
                                </div>
                              </div>
                              <div className="mt-3 flex items-center gap-2">
                                <button disabled={updatingExp} onClick={handleUpdateExpenditure} className="px-3 py-2 bg-heritage-500 text-heritage-800 rounded disabled:opacity-60">{updatingExp ? 'Saving…' : 'Save'}</button>
                                <button onClick={handleCancelEditExpenditure} className="px-3 py-2 border rounded">Cancel</button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Add expenditure (organizer/admin only) */}
                {isOrganizerOrAdmin && (
                  <div className="bg-white border border-brand-sage p-6">
                    <h3 className="text-xl font-serif text-heritage-800 mb-4">Add Expenditure</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm text-heritage-800 mb-1">Title</label>
                        <input className="w-full px-3 py-2 border border-brand-sage rounded" value={newExp.title} onChange={(e) => setNewExp(prev => ({ ...prev, title: e.target.value }))} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-heritage-800 mb-1">Description</label>
                        <textarea className="w-full px-3 py-2 border border-brand-sage rounded" rows={3} value={newExp.description} onChange={(e) => setNewExp(prev => ({ ...prev, description: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm text-heritage-800 mb-1">Amount (₱)</label>
                        <input type="number" className="w-full px-3 py-2 border border-brand-sage rounded" value={newExp.amount} onChange={(e) => setNewExp(prev => ({ ...prev, amount: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm text-heritage-800 mb-1">Used At</label>
                        <input type="date" className="w-full px-3 py-2 border border-brand-sage rounded" value={newExp.used_at} onChange={(e) => setNewExp(prev => ({ ...prev, used_at: e.target.value }))} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-heritage-800 mb-1">Attachment (optional)</label>
                        <input type="file" onChange={(e) => setNewExp(prev => ({ ...prev, attachment: e.target.files?.[0] || null }))} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <button disabled={savingExp} onClick={handleCreateExpenditure} className="bg-heritage-500 text-heritage-800 px-5 py-2 rounded hover:bg-heritage-500/90 disabled:opacity-60">{savingExp ? 'Saving...' : 'Save Expenditure'}</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white border border-brand-sage p-6">
                <h3 className="text-xl font-serif text-heritage-800 mb-4">Recent Supporters</h3>
                {loadingExtras ? (
                  <div className="text-heritage-800/70">Loading...</div>
                ) : donations.length === 0 ? (
                  <div className="text-heritage-800/70">No donations yet. Be the first to support!</div>
                ) : (
                  <ul className="divide-y divide-brand-sage/30">
                    {donations.map(d => (
                      <li key={d.id} className="py-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-heritage-800">{d.anonymous ? 'Anonymous' : (d.donor?.name || 'Supporter')}</div>
                          {d.message && <div className="text-sm text-heritage-800/70">"{d.message}"</div>}
                          <div className="text-xs text-heritage-800/60">{formatDate(d.created_at)}</div>
                        </div>
                        <div className="text-heritage-800 font-semibold">{formatCurrency(d.amount)}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-heritage-100 border border-brand-sage p-6 sticky top-6">
              <h3 className="text-xl font-serif text-heritage-800 mb-4">Support This Campaign</h3>
              
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-heritage-800/80 text-sm mb-2">
                  <span>{getProgressPercentage(campaign.currentAmount, campaign.goalAmount).toFixed(0)}% funded</span>
                  <span>₱{campaign.currentAmount.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-brand-sage/30 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-heritage-500 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage(campaign.currentAmount, campaign.goalAmount)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-heritage-800/60">Goal: ₱{campaign.goalAmount.toLocaleString()}</p>
              </div>

             {/* Support Button */}
<>
  <button
    onClick={handleSupport}
    disabled={(user ? (user as any).role !== 'customer' : false) || (((campaign as any)?.status) && (campaign as any).status !== 'active')}
    className="w-full bg-heritage-500 text-heritage-800 py-4 px-6 rounded-lg font-medium hover:bg-heritage-500/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
  >
    Support This Campaign
  </button>
  {(user && !isCustomer) && (
    <p className="mt-2 text-xs text-heritage-800/70">Only customers can support campaigns.</p>
  )}
  {(((campaign as any)?.status) && (campaign as any).status !== 'active') && (
    <p className="mt-2 text-xs text-heritage-800/70">This campaign is not active.</p>
  )}
</>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSupportModal(false)}></div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-xl font-serif text-heritage-800 mb-4">Support This Campaign</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-heritage-800 mb-2">Support Amount (₱)</label>
                    <input
                      type="number"
                      value={supportAmount}
                      onChange={(e) => setSupportAmount(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-heritage-800/20 rounded-lg focus:ring-2 focus:ring-heritage-500 focus:border-transparent"
                      min="100"
                      step="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-heritage-800 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={supportForm.name}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-heritage-800/20 rounded-lg focus:ring-2 focus:ring-heritage-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-heritage-800 mb-2">Email</label>
                    <input
                      type="email"
                      value={supportForm.email}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-heritage-800/20 rounded-lg focus:ring-2 focus:ring-heritage-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-heritage-800 mb-2">Message (Optional)</label>
                    <textarea
                      value={supportForm.message}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 border border-heritage-800/20 rounded-lg focus:ring-2 focus:ring-heritage-500 focus:border-transparent"
                      rows={3}
                      placeholder="Leave a message of support..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowSupportModal(false)}
                    className="flex-1 px-4 py-3 border border-heritage-800/20 rounded-lg text-heritage-800 hover:bg-heritage-800/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSupportSubmit}
                    className="flex-1 bg-heritage-500 text-heritage-800 px-4 py-3 rounded-lg font-medium hover:bg-heritage-500/90 transition-colors"
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



