import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export default function RequireAuth() {
  const authed = useAppStore((s) => s.currentUserId !== null);
  const location = useLocation();
  return authed ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
