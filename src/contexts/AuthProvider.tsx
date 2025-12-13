import type { ReactNode } from "react";
import { useCurrentUser, useLogout } from "../hooks/useAuth";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: logout } = useLogout();

  const value: AuthContextType = {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user && !!localStorage.getItem("authToken"),
    logout: () => logout(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
