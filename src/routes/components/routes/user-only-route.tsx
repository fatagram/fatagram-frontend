// src/routes/MainRoutes.tsx
import { useAuth } from "@/hooks/contexts/use-auth";
import { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

const UserOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
};

export default UserOnlyRoute;
