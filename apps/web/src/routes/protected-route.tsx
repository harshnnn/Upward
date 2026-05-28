import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/use-auth';

export const ProtectedRoute = () => {
  const status = useAuth((state) => state.status);

  if (status === 'idle' || status === 'loading') {
    return <div className="grid min-h-screen place-items-center text-sm text-[var(--upward-text-muted)]">Restoring session...</div>;
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
