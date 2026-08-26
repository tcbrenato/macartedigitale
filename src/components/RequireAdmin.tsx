import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';

function RequireAdmin({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!isAdmin(user?.email)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default RequireAdmin;
