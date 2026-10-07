import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PATHS } from './routePaths.js';

export function ProtectedRoute({ children }) {
  const token = useSelector((s) => s.auth.token);
  const location = useLocation();
  if (!token) return <Navigate to={PATHS.login} replace state={{ from: location }} />;
  return children;
}
