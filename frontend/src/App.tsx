import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailPage from './pages/ProductDetailPage';
import StoriesPage from './pages/StoriesPage';
import StoryDetailPage from './pages/StoryDetailPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import StorySubmissionPage from './pages/StorySubmissionPage';
import CampaignCreationPage from './pages/CampaignCreationPage';
import MediaCreationPage from './pages/MediaCreationPage';
import MediaFeedPage from './pages/MediaFeedPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useScrollToTop } from './hooks/useScrollToTop';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import OrdersPage from './pages/OrdersPage';
import SupportsPage from './pages/SupportsPage';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cordillera-olive flex items-center justify-center">
          <div className="text-center text-cordillera-cream p-8">
            <h1 className="text-4xl font-serif mb-4">Something went wrong</h1>
            <p className="mb-4 text-cordillera-cream/80">The app encountered an error, but we're handling it gracefully.</p>
            <button 
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
              className="bg-cordillera-gold text-cordillera-olive px-6 py-2 font-medium hover:bg-cordillera-gold/90 transition-colors"
            >
              Reload App
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public browsing routes */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/marketplace" element={<Layout><MarketplacePage /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetailPage /></Layout>} />
          <Route path="/stories" element={<Layout><StoriesPage /></Layout>} />
          <Route path="/story/:id" element={<Layout><StoryDetailPage /></Layout>} />
          <Route path="/campaign/:id" element={<Layout><CampaignDetailPage /></Layout>} />
          <Route path="/media" element={<Layout><MediaFeedPage /></Layout>} />

          {/* Auth pages */}
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout><RegisterPage /></Layout>} />

          {/* Account-only routes */}
          <Route path="/submit-story" element={<Layout><StorySubmissionPage /></Layout>} />
          <Route path="/create-campaign" element={<Layout><CampaignCreationPage /></Layout>} />
          <Route
            path="/media-creation"
            element={
              <Layout>
                <ProtectedRoute>
                  <MediaCreationPage />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route path="/account" element={<Layout><AccountPage /></Layout>} />
          <Route path="/orders" element={<Layout><OrdersPage /></Layout>} />
          <Route path="/supports" element={<Layout><SupportsPage /></Layout>} />

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <Layout>
                <div className="min-h-screen bg-cordillera-olive flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-serif text-cordillera-cream mb-4">Page Not Found</h1>
                    <Link to="/" className="text-cordillera-gold hover:text-cordillera-gold/80 transition-colors">
                      Return to Homepage
                    </Link>
                  </div>
                </div>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

// ScrollToTop component that uses the hook
const ScrollToTop: React.FC = () => {
  useScrollToTop();
  return null;
};

export default App;