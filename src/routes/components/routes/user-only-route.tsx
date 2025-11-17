// src/routes/MainRoutes.tsx
import { useAuth } from "@/hooks/contexts/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth && auth.isAuthenticated === false) {
      navigate("/login", { replace: true });
    }
  }, [auth, navigate]);

  if (!auth) return null;

  return children;
};

export default UserOnlyRoute;
