import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component to guard routes that require authentication
 * Redirects to sign-in page if user is not authenticated
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  return <>{children}</>;
};
