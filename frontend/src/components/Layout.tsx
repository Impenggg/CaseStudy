import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import EnhancedCartModal from './EnhancedCartModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAccountOpen, setIsAccountOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const accountRef = React.useRef<HTMLDivElement | null>(null);

  // Close account dropdown on outside click or Escape
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isAccountOpen) return;
      const target = e.target as Node | null;
      if (accountRef.current && target && !accountRef.current.contains(target)) {
        setIsAccountOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsAccountOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAccountOpen]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-heritage-50">
      {/* Modern, Professional Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 
        bg-white/95 backdrop-blur-lg
        shadow-sm
        border-b border-heritage-200
        transition-all duration-300">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Professional Logo */}
            <Link 
              to="/" 
              className="flex-shrink-0 group relative flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-heritage-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h1 className="text-2xl font-display font-bold text-heritage-900 
                group-hover:text-heritage-600
                transition-colors duration-300">
                Cordillera Heritage
              </h1>
            </Link>

            {/* Clean Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/marketplace', label: 'Marketplace' },
                { to: '/stories', label: 'Stories' },
                { to: '/campaigns', label: 'Campaigns' },
                { to: '/media-creation', label: 'Media Creation' }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    relative px-4 py-2 rounded-lg font-medium
                    transition-all duration-200
                    ${isActive(link.to) 
                      ? 'text-white bg-heritage-500 shadow-sm' 
                      : 'text-heritage-700 hover:text-heritage-900 hover:bg-heritage-100'
                    }
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-500 focus-visible:ring-offset-2
                    after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
                    after:h-0.5 after:w-0 after:bg-heritage-500
                    after:transition-all after:duration-200 after:rounded-full
                    ${isActive(link.to) ? '' : 'hover:after:w-4/5'}
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side / Account */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Auth controls */}
              {isAuthenticated ? (
                <div className="relative" ref={accountRef}>
                  <button
                    onClick={() => setIsAccountOpen(v => !v)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg 
                      bg-heritage-100 hover:bg-heritage-200
                      text-heritage-800
                      border border-heritage-300 hover:border-heritage-400
                      transition-all duration-200 
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-500
                      shadow-sm hover:shadow"
                    aria-haspopup="menu"
                    aria-expanded={isAccountOpen}
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg 
                      bg-heritage-500 
                      text-white font-semibold text-sm shadow-sm">
                      {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden lg:inline font-medium">Account</span>
                    <svg className={`h-4 w-4 transition-transform duration-200 ${isAccountOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  {isAccountOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl border border-heritage-300 bg-white shadow-xl overflow-hidden z-50 animate-scale-in" role="menu" aria-label="Account">
                      <div className="px-4 py-3 border-b border-heritage-200 bg-heritage-50">
                        <p className="text-xs text-heritage-600 font-medium">Signed in as</p>
                        <p className="text-heritage-900 truncate font-semibold mt-0.5">{user?.name || user?.email}</p>
                      </div>
                      <div className="py-1">
                        {/* Role-specific menus */}
                        {user?.role === 'admin' ? (
                          // Admin menu
                          <>
                            <Link to="/admin/moderation" role="menuitem" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-heritage-700 hover:bg-heritage-50 hover:text-heritage-900 focus:outline-none focus-visible:bg-heritage-100 transition-all duration-150 group">
                              <svg className="w-5 h-5 text-heritage-500 group-hover:text-accent-terracotta transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                              <span className="font-medium">Moderation</span>
                            </Link>
                            <Link to="/account" role="menuitem" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-heritage-700 hover:bg-heritage-50 hover:text-heritage-900 focus:outline-none focus-visible:bg-heritage-100 transition-all duration-150 group">
                              <svg className="w-5 h-5 text-heritage-500 group-hover:text-accent-terracotta transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                              <span className="font-medium">Account Information</span>
                            </Link>
                          </>
                        ) : user?.role === 'artisan' ? (
                          // Artisan menu
                          <>
                            <Link to="/dashboard/artisan" role="menuitem" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-heritage-700 hover:bg-heritage-50 hover:text-heritage-900 focus:outline-none focus-visible:bg-heritage-100 transition-all duration-150 group">
                              <svg className="w-5 h-5 text-heritage-500 group-hover:text-accent-terracotta transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                              <span className="font-medium">Account Information</span>
                            </Link>
                            <Link to="/my-products" role="menuitem" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-heritage-700 hover:bg-heritage-50 hover:text-heritage-900 focus:outline-none focus-visible:bg-heritage-100 transition-all duration-150 group">
                              <svg className="w-5 h-5 text-heritage-500 group-hover:text-accent-terracotta transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                              <span className="font-medium">My Products</span>
                            </Link>
                            <Link to="/my-stories" role="menuitem" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-heritage-700 hover:bg-heritage-50 hover:text-heritage-900 focus:outline-none focus-visible:bg-heritage-100 transition-all duration-150 group">
                              <svg className="w-5 h-5 text-heritage-500 group-hover:text-accent-terracotta transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                              <span className="font-medium">My Stories</span>
                            </Link>
                            <Link to="/my-campaigns" role="menuitem" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-heritage-700 hover:bg-heritage-50 hover:text-heritage-900 focus:outline-none focus-visible:bg-heritage-100 transition-all duration-150 group">
                              <svg className="w-5 h-5 text-heritage-500 group-hover:text-accent-terracotta transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                              <span className="font-medium">My Campaigns</span>
                            </Link>
                            <Link to="/media-creation" role="menuitem" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-heritage-700 hover:bg-heritage-50 hover:text-heritage-900 focus:outline-none focus-visible:bg-heritage-100 transition-all duration-150 group">
                              <svg className="w-5 h-5 text-heritage-500 group-hover:text-accent-terracotta transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              <span className="font-medium">Media Uploads</span>
                            </Link>
                          </>
                        ) : user?.role === 'customer' ? (
                          // Customer menu
                          <>
                            <Link to="/dashboard/customer" role="menuitem" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-heritage-700 hover:bg-heritage-50 hover:text-heritage-900 focus:outline-none focus-visible:bg-heritage-100 transition-all duration-150 group">
                              <svg className="w-5 h-5 text-heritage-500 group-hover:text-accent-terracotta transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                              <span className="font-medium">Account Information</span>
                            </Link>
                            <Link to="/my-purchases" role="menuitem" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-heritage-700 hover:bg-heritage-50 hover:text-heritage-900 focus:outline-none focus-visible:bg-heritage-100 transition-all duration-150 group">
                              <svg className="w-5 h-5 text-heritage-500 group-hover:text-accent-terracotta transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                              <span className="font-medium">My Purchases</span>
                            </Link>
                            <Link to="/campaigns-supported" role="menuitem" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-heritage-700 hover:bg-heritage-50 hover:text-heritage-900 focus:outline-none focus-visible:bg-heritage-100 transition-all duration-150 group">
                              <svg className="w-5 h-5 text-heritage-500 group-hover:text-accent-terracotta transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                              <span className="font-medium">Campaigns Supported</span>
                            </Link>
                            <Link to="/media-creation" role="menuitem" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-heritage-700 hover:bg-heritage-50 hover:text-heritage-900 focus:outline-none focus-visible:bg-heritage-100 transition-all duration-150 group">
                              <svg className="w-5 h-5 text-heritage-500 group-hover:text-accent-terracotta transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              <span className="font-medium">Media Uploads</span>
                            </Link>
                          </>
                        ) : (
                          // Other roles: minimal
                          <>
                            <Link to="/account" role="menuitem" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-heritage-700 hover:bg-heritage-50 hover:text-heritage-900 focus:outline-none focus-visible:bg-heritage-100 transition-all duration-150 group">
                              <svg className="w-5 h-5 text-heritage-500 group-hover:text-accent-terracotta transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                              <span className="font-medium">Account Information</span>
                            </Link>
                          </>
                        )}
                        <button
                          onClick={async () => {
                            setIsAccountOpen(false);
                            await logout();
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-heritage-700 hover:bg-red-50 hover:text-error focus:outline-none focus-visible:bg-red-50 border-t border-heritage-200 transition-all duration-150 group mt-1"
                          role="menuitem"
                        >
                          <svg className="w-5 h-5 text-heritage-500 group-hover:text-error transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          <span className="font-medium">Log out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {/* Cart Icon */}
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 text-heritage-700 hover:text-heritage-900 hover:bg-heritage-100 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                    </svg>
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-heritage-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {totalItems > 99 ? '99+' : totalItems}
                      </span>
                    )}
                  </button>
                  
                  <Link 
                    to="/login" 
                    className="px-4 py-2 rounded-lg
                      text-heritage-700 hover:text-heritage-900
                      hover:bg-heritage-100
                      font-medium
                      transition-all duration-200 
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-500"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-6 py-2.5 rounded-lg
                      bg-heritage-500
                      text-white font-semibold
                      shadow-md hover:shadow-lg
                      hover:-translate-y-0.5
                      transition-all duration-200 
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-500 focus-visible:ring-offset-2
                      relative overflow-hidden"
                  >
                    <span className="relative z-10">Create account</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-cordillera-cream hover:text-cordillera-gold transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-cordillera-gold/30">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-cordillera-olive">
              <Link
                to="/"
                className={`block px-3 py-2 transition-colors ${isActive('/') ? 'text-cordillera-gold' : 'text-cordillera-cream/90 hover:text-cordillera-gold'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/marketplace"
                className={`block px-3 py-2 transition-colors ${isActive('/marketplace') ? 'text-cordillera-gold' : 'text-cordillera-cream/90 hover:text-cordillera-gold'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                to="/stories"
                className={`block px-3 py-2 transition-colors ${isActive('/stories') ? 'text-cordillera-gold' : 'text-cordillera-cream/90 hover:text-cordillera-gold'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Stories
              </Link>
              <Link
                to="/campaigns"
                className={`block px-3 py-2 transition-colors ${isActive('/campaigns') ? 'text-cordillera-gold' : 'text-cordillera-cream/90 hover:text-cordillera-gold'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Campaigns
              </Link>
              <Link
                to="/media-creation"
                className={`block px-3 py-2 transition-colors ${isActive('/media-creation') ? 'text-cordillera-gold' : 'text-cordillera-cream/90 hover:text-cordillera-gold'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Media Creation
              </Link>
              {/* Mobile auth controls */}
              {isAuthenticated ? (
                <>
                  <div className="px-3 pt-3 text-cordillera-cream/70 text-xs">Account</div>
                  {user?.role === 'admin' ? (
                    <>
                      <Link to="/admin/moderation" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">Moderation</Link>
                      <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">Account Information</Link>
                    </>
                  ) : user?.role === 'artisan' ? (
                    <>
                      <Link to="/dashboard/artisan" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">Account Information</Link>
                      <Link to="/my-products" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">My Products</Link>
                      <Link to="/my-stories" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">My Stories</Link>
                      <Link to="/my-campaigns" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">My Campaigns</Link>
                      <Link to="/media-creation" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">Media Uploads</Link>
                    </>
                  ) : user?.role === 'customer' ? (
                    <>
                      <Link to="/dashboard/customer" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">Account Information</Link>
                      <Link to="/my-purchases" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">My Purchases</Link>
                      <Link to="/campaigns-supported" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">Campaigns Supported</Link>
                      <Link to="/media-creation" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">Media Uploads</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">Account Information</Link>
                    </>
                  )}
                  <button
                    onClick={async () => { setIsMobileMenuOpen(false); await logout(); navigate('/'); }}
                    className="w-full text-left px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors border-t border-cordillera-gold/20"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">Login</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-olive bg-cordillera-gold hover:bg-cordillera-gold/90 transition-colors">Create account</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">{children}</main>
      
      {/* Cart Modal */}
      <EnhancedCartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
};

export default Layout;