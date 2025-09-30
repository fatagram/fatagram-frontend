// src/routes/MainRoutes.tsx
import React, { JSX } from "react";
import { useAuth } from "@/contexts/auth/auth-context";
import { Navigate, useLocation } from "react-router-dom";

const UserOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  console.log('UserOnlyRoute:', { isAuthenticated, isInitialized, pathname: location.pathname });

  // Wait for auth initialization to complete
  if (!isInitialized) {
    console.log('UserOnlyRoute: Waiting for auth initialization...');
    return null;
  }

  if (!isAuthenticated) {
    console.log('UserOnlyRoute: Not authenticated, redirecting to login');
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  console.log('UserOnlyRoute: Authenticated, rendering children');
  return children;
};

export default UserOnlyRoute;
