// src/routes/MainRoutes.tsx
import { useAuth } from "@/hooks/contexts/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuth();
  const navigate = useNavigate();

  // Client-side navigation redirect (useEffect only runs on client)
  useEffect(() => {
    if (!user?.isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [user?.isAuthenticated, navigate]);

  // SSR: Server already redirected, so if we're rendering this,
  // user is authenticated. Just render children.
  // Client: Return null while redirecting to prevent flash
  if (!user?.isAuthenticated) {
    return null;
  }

  return children;
};

export default UserOnlyRoute;
