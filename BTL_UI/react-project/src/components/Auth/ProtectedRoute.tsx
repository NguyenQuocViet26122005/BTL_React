import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getDefaultRouteForRole, getStoredUser } from '../../utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: number[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.maVaiTro)) {
    return <Navigate to={getDefaultRouteForRole(user.maVaiTro)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
