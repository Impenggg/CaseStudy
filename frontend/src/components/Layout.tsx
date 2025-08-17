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

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-cordillera-olive">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cordillera-olive/95 backdrop-blur-sm shadow-lg transition-all duration-300">
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
                className={`text-cordillera-cream hover:text-cordillera-gold transition-colors ${
                  isActive('/') ? 'text-cordillera-gold' : ''
                }`}
                style={{ color: isActive('/') ? '#8A784E' : '#E7EFC7' }}
              >
                Home
              </Link>
              <Link
                to="/marketplace"
                className={`text-cordillera-cream hover:text-cordillera-gold transition-colors ${
                  isActive('/marketplace') ? 'text-cordillera-gold' : ''
                }`}
                style={{ color: isActive('/marketplace') ? '#8A784E' : '#E7EFC7' }}
              >
                Marketplace
              </Link>
              <Link
                to="/stories"
                className={`text-cordillera-cream hover:text-cordillera-gold transition-colors ${
                  isActive('/stories') ? 'text-cordillera-gold' : ''
                }`}
                style={{ color: isActive('/stories') ? '#8A784E' : '#E7EFC7' }}
              >
                Stories
              </Link>
              <Link
                to="/media-creation"
                className={`text-cordillera-cream hover:text-cordillera-gold transition-colors ${
                  isActive('/media-creation') ? 'text-cordillera-gold' : ''
                }`}
                style={{ color: isActive('/media-creation') ? '#8A784E' : '#E7EFC7' }}
              >
                Media Creation
              </Link>
            </div>

            {/* Right side / Account */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Auth controls */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsAccountOpen(v => !v)}
                    className="ml-2 inline-flex items-center px-3 py-1.5 rounded-full bg-cordillera-cream/10 text-cordillera-cream hover:bg-cordillera-cream/20 transition-colors"
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
                    <div className="absolute right-0 mt-2 w-64 rounded-md border border-cordillera-gold/30 bg-cordillera-olive shadow-lg z-50">
                      <div className="px-4 py-3 border-b border-cordillera-gold/20">
                        <p className="text-sm text-cordillera-cream/70">Signed in as</p>
                        <p className="text-cordillera-cream truncate">{user?.name || user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/account" onClick={() => setIsAccountOpen(false)} className="block px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10">Account Information</Link>
                        <Link to="/orders" onClick={() => setIsAccountOpen(false)} className="block px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10">Orders & History</Link>
                        <Link to="/supports" onClick={() => setIsAccountOpen(false)} className="block px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10">Support Fundraising History</Link>
                        <Link to="/media-creation" onClick={() => setIsAccountOpen(false)} className="block px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10">Media Uploads</Link>
                        <button
                          onClick={async () => {
                            setIsAccountOpen(false);
                            await logout();
                            navigate('/');
                          }}
                          className="w-full text-left px-4 py-2 text-cordillera-cream hover:bg-cordillera-cream/10 border-t border-cordillera-gold/20"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="text-cordillera-cream hover:text-cordillera-gold transition-colors">Login</Link>
                  <Link to="/register" className="bg-cordillera-gold text-cordillera-olive px-4 py-1.5 hover:bg-cordillera-gold/90 transition-colors">Create account</Link>
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
                className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors"
                style={{ color: isActive('/') ? '#8A784E' : '#E7EFC7' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/marketplace"
                className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors"
                style={{ color: isActive('/marketplace') ? '#8A784E' : '#E7EFC7' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                to="/stories"
                className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors"
                style={{ color: isActive('/stories') ? '#8A784E' : '#E7EFC7' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Stories
              </Link>
              <Link
                to="/media-creation"
                className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors"
                style={{ color: isActive('/media-creation') ? '#8A784E' : '#E7EFC7' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Media Creation
              </Link>
              {/* Mobile auth controls */}
              {isAuthenticated ? (
                <>
                  <div className="px-3 pt-3 text-cordillera-cream/70 text-xs">Account</div>
                  <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">Account Information</Link>
                  <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">Orders & History</Link>
                  <Link to="/supports" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">Support History</Link>
                  <Link to="/media-creation" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors">Media Uploads</Link>
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