import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowed: Array<string>; // roles allowed
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowed }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-heritage-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-500 mx-auto mb-4"></div>
          <p className="text-heritage-100">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Enforce email verification before allowing access
  if (user && (user as any).email_verified_at == null) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  if (!user || !allowed.includes((user as any).role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
