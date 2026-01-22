import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { userRole } from "@/domain/User/UserRole";
import { useEffect } from "react";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: userRole[];
};

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, checkAuth } = useAuth();

  useEffect(() => {    
    checkAuth()
  }, [children])

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/404" />;

  return <>{children}</>;
};
