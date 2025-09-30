// src/routes/MainRoutes.tsx
import React, { JSX } from "react";
import { useAuth } from "@/contexts/auth/auth-context";
import { Navigate, useSearchParams } from "react-router-dom";

const GuestOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const [searchParams] = useSearchParams();

  // Wait for auth initialization to complete
  if (!isInitialized) return null;

  if (isAuthenticated) {
    const returnTo = searchParams.get("returnTo") || "/";
    return <Navigate to={returnTo} replace />;
  }

  return children;
};

export default GuestOnlyRoute;
