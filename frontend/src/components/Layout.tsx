import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAccountOpen, setIsAccountOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
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
    <div className="min-h-screen bg-cordillera-olive">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cordillera-olive/95 backdrop-blur-sm shadow-lg transition-all duration-300 border-b border-cordillera-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-3xl font-serif text-cordillera-cream font-light tracking-wide">
                Cordillera Heritage
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`relative text-cordillera-cream/90 hover:text-cordillera-gold transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-cordillera-gold after:transition-all after:duration-200 after:w-0 hover:after:w-full ${
                  isActive('/') ? 'text-cordillera-gold after:w-full' : ''
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-cordillera-gold/40 rounded`}
              >
                Home
              </Link>
              <Link
                to="/marketplace"
                className={`relative text-cordillera-cream/90 hover:text-cordillera-gold transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-cordillera-gold after:transition-all after:duration-200 after:w-0 hover:after:w-full ${
                  isActive('/marketplace') ? 'text-cordillera-gold after:w-full' : ''
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-cordillera-gold/40 rounded`}
              >
                Marketplace
              </Link>
              <Link
                to="/stories"
                className={`relative text-cordillera-cream/90 hover:text-cordillera-gold transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-cordillera-gold after:transition-all after:duration-200 after:w-0 hover:after:w-full ${
                  isActive('/stories') ? 'text-cordillera-gold after:w-full' : ''
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-cordillera-gold/40 rounded`}
              >
                Stories
              </Link>
              <Link
                to="/media-creation"
                className={`relative text-cordillera-cream/90 hover:text-cordillera-gold transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-cordillera-gold after:transition-all after:duration-200 after:w-0 hover:after:w-full ${
                  isActive('/media-creation') ? 'text-cordillera-gold after:w-full' : ''
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-cordillera-gold/40 rounded`}
              >
                Media Creation
              </Link>
            </div>

            {/* Right side / Account */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Auth controls */}
              {isAuthenticated ? (
                <div className="relative" ref={accountRef}>
                  <button
                    onClick={() => setIsAccountOpen(v => !v)}
                    className="ml-2 inline-flex items-center px-3 py-1.5 rounded-full bg-cordillera-cream/10 text-cordillera-cream hover:bg-cordillera-cream/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cordillera-gold/40"
                    aria-haspopup="menu"
                    aria-expanded={isAccountOpen}
                  >
                    <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-cordillera-gold text-cordillera-olive font-semibold">
                      {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden lg:inline">Account</span>
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  {isAccountOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-lg border border-cordillera-gold/30 bg-cordillera-olive shadow-xl overflow-hidden z-50" role="menu" aria-label="Account">
                      <div className="px-4 py-3 border-b border-cordillera-gold/20">
                        <p className="text-sm text-cordillera-cream/70">Signed in as</p>
                        <p className="text-cordillera-cream truncate">{user?.name || user?.email}</p>
                      </div>
                      <div className="py-1">
                        {/* Role-specific menus */}
                        {user?.role === 'admin' ? (
                          // Admin menu
                          <>
                            <Link to="/admin/moderation" role="menuitem" onClick={() => setIsAccountOpen(false)} className="block px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10 focus:outline-none focus-visible:bg-cordillera-cream/10 transition-colors">Moderation</Link>
                            <Link to="/account" role="menuitem" onClick={() => setIsAccountOpen(false)} className="block px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10 focus:outline-none focus-visible:bg-cordillera-cream/10 transition-colors">Account Information</Link>
                          </>
                        ) : user?.role === 'artisan' ? (
                          // Artisan menu
                          <>
                            <Link to="/dashboard/artisan" role="menuitem" onClick={() => setIsAccountOpen(false)} className="block px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10 focus:outline-none focus-visible:bg-cordillera-cream/10 transition-colors">Account Information</Link>
                            <Link to="/my-products" role="menuitem" onClick={() => setIsAccountOpen(false)} className="block px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10 focus:outline-none focus-visible:bg-cordillera-cream/10 transition-colors">My Products</Link>
                            <Link to="/my-stories" role="menuitem" onClick={() => setIsAccountOpen(false)} className="block px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10 focus:outline-none focus-visible:bg-cordillera-cream/10 transition-colors">My Stories</Link>
                            <Link to="/my-campaigns" role="menuitem" onClick={() => setIsAccountOpen(false)} className="block px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10 focus:outline-none focus-visible:bg-cordillera-cream/10 transition-colors">My Campaigns</Link>
                            <Link to="/media-creation" role="menuitem" onClick={() => setIsAccountOpen(false)} className="block px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10 focus:outline-none focus-visible:bg-cordillera-cream/10 transition-colors">Media Uploads</Link>
                          </>
                        ) : user?.role === 'customer' ? (
                          // Customer menu
                          <>
                            <Link to="/dashboard/customer" role="menuitem" onClick={() => setIsAccountOpen(false)} className="block px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10 focus:outline-none focus-visible:bg-cordillera-cream/10 transition-colors">Account Information</Link>
                            <Link to="/my-purchases" role="menuitem" onClick={() => setIsAccountOpen(false)} className="block px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10 focus:outline-none focus-visible:bg-cordillera-cream/10 transition-colors">My Purchases</Link>
                            <Link to="/campaigns-supported" role="menuitem" onClick={() => setIsAccountOpen(false)} className="block px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10 focus:outline-none focus-visible:bg-cordillera-cream/10 transition-colors">Campaigns Supported</Link>
                            <Link to="/media-creation" role="menuitem" onClick={() => setIsAccountOpen(false)} className="block px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10 focus:outline-none focus-visible:bg-cordillera-cream/10 transition-colors">Media Uploads</Link>
                          </>
                        ) : (
                          // Other roles: minimal
                          <>
                            <Link to="/account" role="menuitem" onClick={() => setIsAccountOpen(false)} className="block px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10 focus:outline-none focus-visible:bg-cordillera-cream/10 transition-colors">Account Information</Link>
                          </>
                        )}
                        <button
                          onClick={async () => {
                            setIsAccountOpen(false);
                            await logout();
                            navigate('/');
                          }}
                          className="w-full text-left px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10 focus:outline-none focus-visible:bg-cordillera-cream/10 border-t border-cordillera-gold/20 transition-colors"
                          role="menuitem"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="text-cordillera-cream/90 hover:text-cordillera-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cordillera-gold/40 rounded">Login</Link>
                  <Link to="/register" className="bg-cordillera-gold text-cordillera-olive px-4 py-1.5 rounded-full shadow-sm hover:bg-cordillera-gold/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cordillera-gold/40">Create account</Link>
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
    </div>
  );
};

export default Layout;