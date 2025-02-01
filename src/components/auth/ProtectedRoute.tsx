import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect admin to admin dashboard and students to home page
  if (user?.role === 'admin' && window.location.pathname === '/home') {
    return <Navigate to="/admin" replace />;
  }

  if (user?.role === 'student' && window.location.pathname === '/admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};