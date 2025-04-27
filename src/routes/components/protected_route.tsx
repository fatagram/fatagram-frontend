// src/routes/MainRoutes.tsx
import React, { JSX } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children} : { children: JSX.Element}) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;