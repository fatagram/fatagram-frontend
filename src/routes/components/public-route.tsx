// src/routes/MainRoutes.tsx
import React, { JSX } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";


const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuth();
    
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
  
    return children;
};

export default PublicRoute;
  
