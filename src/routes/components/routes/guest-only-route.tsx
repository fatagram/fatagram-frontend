// src/routes/MainRoutes.tsx
import { useAuth } from "@/hooks/utilities/use-auth";
import React, { JSX } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

const GuestOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  if (isAuthenticated !== null && isAuthenticated) {
    const returnTo = searchParams.get("returnTo") || "/";
    return <Navigate to={returnTo} replace />;
  }

  return children;
};

export default GuestOnlyRoute;
