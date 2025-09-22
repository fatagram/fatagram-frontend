// src/routes/MainRoutes.tsx
import React, { JSX } from "react";
import { useAuth } from "@/contexts/auth/auth-context";
import { Navigate } from "react-router-dom";

const GuestOnlyRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuth();
    
    // if (isAuthenticated === null) return null;

    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    return children;
};

export default GuestOnlyRoute;
