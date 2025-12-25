import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute component to guard auth pages (sign-in, sign-up, etc.)
 * Redirects to home page if user is already authenticated
 */
export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};
