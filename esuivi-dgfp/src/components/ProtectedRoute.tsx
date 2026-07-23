import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../services/auth";
import type { Role } from "../types/api";

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children: ReactNode;
}

const LOGIN_PATH_BY_ROLE: Record<Role, string> = {
  agent: "/connexion",
  gestionnaire: "/connexion-personnel",
  admin: "/connexion-personnel",
};

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated || !role) {
    return <Navigate to={LOGIN_PATH_BY_ROLE[allowedRoles[0]]} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={LOGIN_PATH_BY_ROLE[role]} replace />;
  }

  return <>{children}</>;
}
