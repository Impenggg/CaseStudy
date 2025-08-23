import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-cordillera-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-cordillera-olive mb-4">Access Denied</h1>
          <p className="text-cordillera-olive/70 mb-6">Please log in to access your dashboard.</p>
          <Link to="/login" className="bg-cordillera-gold text-cordillera-olive px-6 py-2 font-medium">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cordillera-cream py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-6">
            <h1 className="text-4xl font-serif font-light text-cordillera-olive tracking-wide">
              Welcome, {user.name || 'Member'}
            </h1>
            <p className="text-cordillera-olive/70 font-light capitalize">
              {(user.role || 'member')} • Member since {user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="bg-white p-8 border border-cordillera-sage/20">
              <h2 className="text-2xl font-serif font-light text-cordillera-olive mb-6 tracking-wide">
                {user.role === 'artisan' ? 'Your Artisan Stats' : 'Your Activity'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user.role === 'artisan' ? (
                  <>
                    <div className="text-center">
                      <div className="text-3xl font-serif font-light text-cordillera-olive mb-2">12</div>
                      <div className="text-sm text-cordillera-olive/70">Products Listed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-serif font-light text-cordillera-olive mb-2">45</div>
                      <div className="text-sm text-cordillera-olive/70">Total Sales</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-serif font-light text-cordillera-olive mb-2">₱85,600</div>
                      <div className="text-sm text-cordillera-olive/70">Total Revenue</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="text-3xl font-serif font-light text-cordillera-olive mb-2">8</div>
                      <div className="text-sm text-cordillera-olive/70">Items Purchased</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-serif font-light text-cordillera-olive mb-2">15</div>
                      <div className="text-sm text-cordillera-olive/70">Favorites</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-serif font-light text-cordillera-olive mb-2">₱12,400</div>
                      <div className="text-sm text-cordillera-olive/70">Total Spent</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-8 border border-cordillera-sage/20">
              <h3 className="text-xl font-serif font-light text-cordillera-olive mb-6 tracking-wide">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {user.role === 'artisan' ? (
                  <>
                    <div className="flex items-center justify-between py-3 border-b border-cordillera-sage/10">
                      <div>
                        <p className="text-cordillera-olive font-light">New order received</p>
                        <p className="text-sm text-cordillera-olive/60">Traditional Tapis Skirt - ₱2,500</p>
                      </div>
                      <span className="text-xs text-cordillera-olive/50">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-cordillera-sage/10">
                      <div>
                        <p className="text-cordillera-olive font-light">Product view milestone</p>
                        <p className="text-sm text-cordillera-olive/60">Kalinga Blanket reached 100 views</p>
                      </div>
                      <span className="text-xs text-cordillera-olive/50">1 day ago</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-cordillera-sage/10">
                      <div>
                        <p className="text-cordillera-olive font-light">New product added</p>
                        <p className="text-sm text-cordillera-olive/60">Ceremonial Cloth listed for ₱3,200</p>
                      </div>
                      <span className="text-xs text-cordillera-olive/50">3 days ago</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between py-3 border-b border-cordillera-sage/10">
                      <div>
                        <p className="text-cordillera-olive font-light">Order delivered</p>
                        <p className="text-sm text-cordillera-olive/60">Table Runner by Rosa Mendoza</p>
                      </div>
                      <span className="text-xs text-cordillera-olive/50">1 day ago</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-cordillera-sage/10">
                      <div>
                        <p className="text-cordillera-olive font-light">Added to favorites</p>
                        <p className="text-sm text-cordillera-olive/60">Wall Hanging by Maria Santos</p>
                      </div>
                      <span className="text-xs text-cordillera-olive/50">2 days ago</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-cordillera-sage/10">
                      <div>
                        <p className="text-cordillera-olive font-light">Order placed</p>
                        <p className="text-sm text-cordillera-olive/60">Traditional Bahag - ₱1,200</p>
                      </div>
                      <span className="text-xs text-cordillera-olive/50">5 days ago</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white p-6 border border-cordillera-sage/20">
              <h3 className="text-lg font-serif font-light text-cordillera-olive mb-4 tracking-wide">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {user.role === 'artisan' ? (
                  <>
                    <Link to="/create-product">
                      <button className="w-full bg-cordillera-gold text-cordillera-olive py-2 px-4 text-sm font-medium tracking-wide hover:bg-cordillera-gold/90 transition-colors">
                        Add New Product
                      </button>
                    </Link>
                    <Link to="/submit-story">
                      <button className="w-full border border-cordillera-olive text-cordillera-olive py-2 px-4 text-sm font-light tracking-wide hover:bg-cordillera-olive hover:text-cordillera-cream transition-colors">
                        Share Your Story
                      </button>
                    </Link>
                    <Link to="/create-campaign">
                      <button className="w-full border border-cordillera-olive text-cordillera-olive py-2 px-4 text-sm font-light tracking-wide hover:bg-cordillera-olive hover:text-cordillera-cream transition-colors">
                        Submit Campaign
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/marketplace">
                      <button className="w-full bg-cordillera-gold text-cordillera-olive py-2 px-4 text-sm font-medium tracking-wide hover:bg-cordillera-gold/90 transition-colors">
                        Browse Products
                      </button>
                    </Link>
                    <button className="w-full border border-cordillera-olive text-cordillera-olive py-2 px-4 text-sm font-light tracking-wide hover:bg-cordillera-olive hover:text-cordillera-cream transition-colors">
                      View Orders
                    </button>
                    <button className="w-full border border-cordillera-olive text-cordillera-olive py-2 px-4 text-sm font-light tracking-wide hover:bg-cordillera-olive hover:text-cordillera-cream transition-colors">
                      Manage Favorites
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-cordillera-olive p-6 text-cordillera-cream">
              <h3 className="text-lg font-serif font-light mb-4 tracking-wide">
                Community Impact
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-cordillera-cream/80">Artisans Supported</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cordillera-cream/80">Cultural Contributions</span>
                  <span className="font-medium">₱12,400</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cordillera-cream/80">Stories Shared</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};