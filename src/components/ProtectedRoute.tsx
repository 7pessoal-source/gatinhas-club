import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  children: ReactNode;
  requireAdmin?: boolean;
  requireGP?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, requireAdmin, requireGP, redirectTo = '/auth' }: Props) {
  const { user, isAdmin, isGP, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to={redirectTo} replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  if (requireGP && !isGP && !isAdmin) return <Navigate to="/cadastro-gp" replace />;

  return <>{children}</>;
}
