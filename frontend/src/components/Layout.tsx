import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
              >
                Home
              </Link>
              <Link
                to="/marketplace"
                className={`text-cordillera-cream hover:text-cordillera-gold transition-colors ${
                  isActive('/marketplace') ? 'text-cordillera-gold' : ''
                }`}
              >
                Marketplace
              </Link>
              <Link
                to="/stories"
                className={`text-cordillera-cream hover:text-cordillera-gold transition-colors ${
                  isActive('/stories') ? 'text-cordillera-gold' : ''
                }`}
              >
                Stories
              </Link>
              <Link
                to="/media-creation"
                className={`text-cordillera-cream hover:text-cordillera-gold transition-colors ${
                  isActive('/media-creation') ? 'text-cordillera-gold' : ''
                }`}
              >
                Media Creation
              </Link>
            </div>

            {/* Contact Info */}
            <div className="hidden md:flex items-center">
              <span className="text-cordillera-cream/70 text-sm">
                Preserving Heritage Through Digital Innovation
              </span>
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
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/marketplace"
                className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                to="/stories"
                className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Stories
              </Link>
              <Link
                to="/media-creation"
                className="block px-3 py-2 text-cordillera-cream hover:text-cordillera-gold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Media Creation
              </Link>
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