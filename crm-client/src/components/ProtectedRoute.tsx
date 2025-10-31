import React from 'react';
import { useAuth } from '../context/AuthContext';
import UnauthorizedPage from './UnauthorizedPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'admin' 
}) => {
  const { isAuthenticated, user } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <UnauthorizedPage message="Пожалуйста, войдите в систему для доступа к этой странице" />;
  }

  // Check if user has required role
  if (requiredRole && user?.role !== requiredRole) {
    return <UnauthorizedPage message="У вас нет прав для доступа к этой странице" />;
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
