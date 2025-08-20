import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useScrollToTop } from './hooks/useScrollToTop';

// Lazy-loaded pages for better structure and to avoid stale modules
const HomePage = lazy(() => import('./pages/HomePage'));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const StoriesPage = lazy(() => import('./pages/StoriesPage'));
const StoryDetailPage = lazy(() => import('./pages/StoryDetailPage'));
const CampaignDetailPage = lazy(() => import('./pages/CampaignDetailPage'));
const StorySubmissionPage = lazy(() => import('./pages/StorySubmissionPage'));
const CampaignCreationPage = lazy(() => import('./pages/CampaignCreationPage'));
const MediaCreationPage = lazy(() => import('./pages/MediaCreationPage'));
const MediaFeedPage = lazy(() => import('./pages/MediaFeedPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage.tsx').then(m => ({ default: m.default })));
const SupportsPage = lazy(() => import('./pages/SupportsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
import ProtectedRoute from './components/ProtectedRoute';

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
        <Suspense
          fallback={
            <div className="min-h-screen bg-cordillera-olive flex items-center justify-center">
              <div className="text-center text-cordillera-cream">Loading…</div>
            </div>
          }
        >
        <Routes>
          {/* Public browsing routes */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/marketplace" element={<Layout><MarketplacePage /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetailPage /></Layout>} />
          <Route path="/stories" element={<Layout><StoriesPage /></Layout>} />
          <Route path="/story/:id" element={<Layout><StoryDetailPage /></Layout>} />
          <Route path="/campaign/:id" element={<Layout><CampaignDetailPage /></Layout>} />
          {/* Media-related routes */}
          <Route
            path="/media"
            element={
              <Layout>
                <ProtectedRoute>
                  <MediaFeedPage />
                </ProtectedRoute>
              </Layout>
            }
          />

          {/* Auth pages */}
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout><RegisterPage /></Layout>} />

          {/* Account-only routes */}
          <Route
            path="/submit-story"
            element={
              <Layout>
                <ProtectedRoute>
                  <StorySubmissionPage />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/create-campaign"
            element={
              <Layout>
                <ProtectedRoute>
                  <CampaignCreationPage />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/media-creation"
            element={
              <Layout>
                <ProtectedRoute>
                  <Navigate to="/media" replace />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/account"
            element={
              <Layout>
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/orders"
            element={
              <Layout>
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <Layout>
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/supports"
            element={
              <Layout>
                <ProtectedRoute>
                  <SupportsPage />
                </ProtectedRoute>
              </Layout>
            }
          />

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
        </Suspense>
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