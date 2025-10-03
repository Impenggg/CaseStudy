import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useScrollToTop } from './hooks/useScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Lazy-loaded pages for better structure and to avoid stale modules
const HomePage = lazy(() => import('./pages/HomePage'));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const StoriesPage = lazy(() => import('./pages/StoriesPage'));
const StoryDetailPage = lazy(() => import('./pages/StoryDetailPage'));
const CampaignDetailPage = lazy(() => import('./pages/CampaignDetailPage'));
const StorySubmissionPage = lazy(() => import('./pages/StorySubmissionPage'));
const CampaignCreationPage = lazy(() => import('./pages/CampaignCreationPage'));
const MediaFeedPage = lazy(() => import('./pages/MediaFeedPage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard').then(m => ({ default: m.UserDashboard })));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage.tsx').then(m => ({ default: m.default })));
const SupportsPage = lazy(() => import('./pages/SupportsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ProductCreatePage = lazy(() => import('./pages/ProductCreatePage'));
const MyProductsPage = lazy(() => import('./pages/MyProductsPage'));
const ProductEditPage = lazy(() => import('./pages/ProductEditPage'));
const MyStoriesPage = lazy(() => import('./pages/MyStoriesPage'));
const MyCampaignsPage = lazy(() => import('./pages/MyCampaignsPage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const AdminModerationPage = lazy(() => import('./pages/AdminModerationPage'));

// Main App component
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-screen bg-cordillera-olive" />}>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/marketplace" element={<Layout><MarketplacePage /></Layout>} />
            <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
            <Route path="/stories" element={<Layout><StoriesPage /></Layout>} />
            <Route path="/stories/:id" element={<Layout><StoryDetailPage /></Layout>} />
            <Route path="/campaigns/:id" element={<Layout><CampaignDetailPage /></Layout>} />

            {/* Auth pages */}
            <Route path="/login" element={<Layout><LoginPage /></Layout>} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Media (protected) */}
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

            {/* Account-only routes */}
            <Route
              path="/submit-story"
              element={
                <Layout>
                  <RoleProtectedRoute allowed={['artisan', 'admin']}>
                    <StorySubmissionPage />
                  </RoleProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/create-campaign"
              element={
                <Layout>
                  <RoleProtectedRoute allowed={['artisan', 'admin']}>
                    <CampaignCreationPage />
                  </RoleProtectedRoute>
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
            {/* Customer alias to OrdersPage */}
            <Route
              path="/my-purchases"
              element={
                <Layout>
                  <RoleProtectedRoute allowed={['customer', 'admin']}>
                    <OrdersPage />
                  </RoleProtectedRoute>
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
              path="/create-product"
              element={
                <Layout>
                  <RoleProtectedRoute allowed={['artisan', 'admin']}>
                    <ProductCreatePage />
                  </RoleProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/my-products"
              element={
                <Layout>
                  <RoleProtectedRoute allowed={['artisan', 'admin']}>
                    <MyProductsPage />
                  </RoleProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/products/:id/edit"
              element={
                <Layout>
                  <RoleProtectedRoute allowed={['artisan', 'admin']}>
                    <ProductEditPage />
                  </RoleProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/my-stories"
              element={
                <Layout>
                  <RoleProtectedRoute allowed={['artisan', 'admin']}>
                    <MyStoriesPage />
                  </RoleProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/my-campaigns"
              element={
                <Layout>
                  <RoleProtectedRoute allowed={['artisan', 'admin']}>
                    <MyCampaignsPage />
                  </RoleProtectedRoute>
                </Layout>
              }
            />

            {/* Role-specific dashboards */}
            <Route
              path="/dashboard/artisan"
              element={
                <Layout>
                  <RoleProtectedRoute allowed={['artisan', 'admin']}>
                    <UserDashboard />
                  </RoleProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/dashboard/customer"
              element={
                <Layout>
                  <RoleProtectedRoute allowed={['customer', 'admin']}>
                    <UserDashboard />
                  </RoleProtectedRoute>
                </Layout>
              }
            />

            <Route
              path="/admin/moderation"
              element={
                <Layout>
                  <RoleProtectedRoute allowed={['admin']}>
                    <AdminModerationPage />
                  </RoleProtectedRoute>
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
            {/* Customer alias to SupportsPage */}
            <Route
              path="/campaigns-supported"
              element={
                <Layout>
                  <RoleProtectedRoute allowed={['customer', 'admin']}>
                    <SupportsPage />
                  </RoleProtectedRoute>
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