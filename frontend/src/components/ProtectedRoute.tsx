import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const LoadingScreen = () => (
  <div className="min-h-screen bg-heritage-800 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-500 mx-auto mb-4"></div>
      <p className="text-heritage-100">Loading...</p>
    </div>
  </div>
);

const isUnverified = (user: any | null | undefined) => {
  if (!user) return false;
  return user.email_verified_at == null; // null or undefined means not verified
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isUnverified(user)) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

export const RoleProtectedRoute = ({ children, allowed }: { children: React.ReactElement, allowed: string[] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isUnverified(user)) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  if (user && user.role && !allowed.includes(user.role)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};