import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import api from '@/services/api';

export const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<
    | {
        // Artisan quick stats
        totalSales?: number;
        storiesShared?: number;
        campaignsStarted?: number;
        // Legacy/product or buyer fields (for non-artisan)
        productsListed?: number;
        itemsPurchased?: number;
        favorites?: number;
        totalSpent?: number;
        totalRevenue?: number; // kept for backwards compat
        // Community group (role-dependent keys)
        community?: {
          // Artisan community
          totalRevenue?: number;
          storiesViewed?: number;
          fundsRaised?: number;
          // Customer/community fallback
          artisansSupported?: number;
          culturalContributions?: number;
          storiesShared?: number;
          // New buyer community metrics
          pendingOrders?: number;
          totalCampaignsSupported?: number;
        };
        activity: Array<{ id: string | number; title: string; subtitle?: string; at: string | number | Date }>;
      }
    | null
  >(null);

  const isArtisanRole = React.useMemo(() => {
    const r = (user?.role || '').toLowerCase();
    return ['artisan', 'weaver', 'seller'].includes(r);
  }, [user?.role]);

  // Simple time-ago formatter without extra deps
  const timeAgo = (dateInput: string | number | Date) => {
    const d = new Date(dateInput);
    const diff = Date.now() - d.getTime();
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.floor(hr / 24);
    return `${day}d ago`;
  };

  React.useEffect(() => {
    if (!user) return;
    let mounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setError(null);
        const role = user.role || 'customer';
        const res = await api.get(`/dashboard/${role}`, { signal: controller.signal as any });
        const data = res.data;
        if (!mounted) return;
        // Expected shape documented above; tolerate partials
        const storiesShared =
          data.storiesShared ?? data.stories_shared ?? data.community?.storiesShared ?? 0;
        const campaignsStarted =
          data.campaignsStarted ?? data.campaigns_started ?? (Array.isArray(data.campaigns) ? data.campaigns.length : 0);
        setStats({
          // artisan quick stats
          totalSales: data.totalSales,
          storiesShared,
          campaignsStarted,
          // buyer/legacy fields if present
          productsListed: data.productsListed,
          totalRevenue: data.totalRevenue,
          itemsPurchased: data.itemsPurchased,
          favorites: data.favorites,
          totalSpent: data.totalSpent,
          community: data.community || {},
          activity: Array.isArray(data.activity) ? data.activity : [],
        });
      } catch (e: any) {
        // Ignore cancellations from unmount/re-render
        const code = e?.code || e?.name;
        if (code === 'ERR_CANCELED' || code === 'CanceledError' || code === 'AbortError') {
          return;
        }
        setError(e instanceof Error ? e.message : 'Failed to load dashboard');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Initial load
    fetchData();
    // Poll every 15s for near-realtime updates
    const id = setInterval(fetchData, 15000);
    return () => {
      mounted = false;
      controller.abort();
      clearInterval(id);
    };
  }, [user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-heritage-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-heritage-800 mb-4">Access Denied</h1>
          <p className="text-heritage-800/70 mb-6">Please log in to access your dashboard.</p>
          <Link to="/login" className="bg-heritage-500 text-heritage-800 px-6 py-2 font-medium">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-heritage-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-6">
            <h1 className="text-4xl font-serif font-light text-heritage-800 tracking-wide">
              Welcome, {user.name || 'Member'}
            </h1>
            <p className="text-heritage-800/70 font-light capitalize">
              {(user.role || 'member')} • Member since {user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="bg-white p-8 border border-brand-sage/20">
              <h2 className="text-2xl font-serif font-light text-heritage-800 mb-6 tracking-wide">
                {isArtisanRole ? 'Your Artisan Stats' : 'Your Activity'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isArtisanRole ? (
                  <>
                    <div className="text-center">
                      <div className="text-3xl font-serif font-light text-heritage-800 mb-2">
                        {loading ? '—' : (stats?.totalSales ?? 0)}
                      </div>
                      <div className="text-sm text-heritage-800/70">Total Sales</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-serif font-light text-heritage-800 mb-2">
                        {loading ? '—' : (stats?.storiesShared ?? 0)}
                      </div>
                      <div className="text-sm text-heritage-800/70">Stories Shared</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-serif font-light text-heritage-800 mb-2">
                        {loading ? '—' : (stats?.campaignsStarted ?? 0)}
                      </div>
                      <div className="text-sm text-heritage-800/70">Campaigns Started</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="text-3xl font-serif font-light text-heritage-800 mb-2">
                        {loading ? '—' : (stats?.itemsPurchased ?? 0)}
                      </div>
                      <div className="text-sm text-heritage-800/70">Items Purchased</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-serif font-light text-heritage-800 mb-2">
                        {loading ? '—' : (stats?.favorites ?? 0)}
                      </div>
                      <div className="text-sm text-heritage-800/70">Favorites</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-serif font-light text-heritage-800 mb-2">
                        {loading ? '—' : `₱${(stats?.totalSpent ?? 0).toLocaleString()}`}
                      </div>
                      <div className="text-sm text-heritage-800/70">Total Spent</div>
                    </div>
                  </>
                )}
              </div>
              {!loading && error && (
                <div className="mt-4 text-sm text-error">{error}</div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-8 border border-brand-sage/20">
              <h3 className="text-xl font-serif font-light text-heritage-800 mb-6 tracking-wide">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {loading ? (
                  // Simple loading placeholders
                  <>
                    <div className="h-12 bg-brand-sage/10" />
                    <div className="h-12 bg-brand-sage/10" />
                    <div className="h-12 bg-brand-sage/10" />
                  </>
                ) : stats?.activity && stats.activity.length > 0 ? (
                  stats.activity.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b border-brand-sage/10">
                      <div>
                        <p className="text-heritage-800 font-light">{item.title}</p>
                        {item.subtitle && (
                          <p className="text-sm text-heritage-800/60">{item.subtitle}</p>
                        )}
                      </div>
                      <span className="text-xs text-heritage-800/50">{timeAgo(item.at)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-heritage-800/60">No recent activity yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white p-6 border border-brand-sage/20">
              <h3 className="text-lg font-serif font-light text-heritage-800 mb-4 tracking-wide">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {user.role === 'artisan' ? (
                  <>
                    <Link to="/create-product">
                      <button className="w-full bg-heritage-500 text-heritage-800 py-2 px-4 text-sm font-medium tracking-wide hover:bg-heritage-500/90 transition-colors">
                        Add New Product
                      </button>
                    </Link>
                    <Link to="/submit-story">
                      <button className="w-full border border-heritage-800 text-heritage-800 py-2 px-4 text-sm font-light tracking-wide hover:bg-heritage-800 hover:text-heritage-100 transition-colors">
                        Share Your Story
                      </button>
                    </Link>
                    <Link to="/create-campaign">
                      <button className="w-full border border-heritage-800 text-heritage-800 py-2 px-4 text-sm font-light tracking-wide hover:bg-heritage-800 hover:text-heritage-100 transition-colors">
                        Submit Campaign
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/marketplace">
                      <button className="w-full bg-heritage-500 text-heritage-800 py-2 px-4 text-sm font-medium tracking-wide hover:bg-heritage-500/90 transition-colors">
                        Browse Products
                      </button>
                    </Link>
                    <button className="w-full border border-heritage-800 text-heritage-800 py-2 px-4 text-sm font-light tracking-wide hover:bg-heritage-800 hover:text-heritage-100 transition-colors">
                      View Orders
                    </button>
                    <button className="w-full border border-heritage-800 text-heritage-800 py-2 px-4 text-sm font-light tracking-wide hover:bg-heritage-800 hover:text-heritage-100 transition-colors">
                      Manage Favorites
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-heritage-800 p-6 text-heritage-100">
              <h3 className="text-lg font-serif font-light mb-4 tracking-wide">
                Community Impact
              </h3>
              {isArtisanRole ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-heritage-100/80">Total Revenue</span>
                    <span className="font-medium">{loading ? '—' : `₱${(stats?.community?.totalRevenue ?? 0).toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-heritage-100/80">Stories Viewed</span>
                    <span className="font-medium">{loading ? '—' : (stats?.community?.storiesViewed ?? 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-heritage-100/80">Funds Raised</span>
                    <span className="font-medium">{loading ? '—' : `₱${(stats?.community?.fundsRaised ?? 0).toLocaleString()}`}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-heritage-100/80">Pending Orders</span>
                    <span className="font-medium">{loading ? '—' : (stats?.community?.pendingOrders ?? 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-heritage-100/80">Stories Viewed</span>
                    <span className="font-medium">{loading ? '—' : (stats?.community?.storiesViewed ?? 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-heritage-100/80">Total Campaigns Supported</span>
                    <span className="font-medium">{loading ? '—' : (stats?.community?.totalCampaignsSupported ?? 0)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};