// src/routes/MainRoutes.tsx
import { useAuth } from "@/hooks/contexts/use-auth";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GuestOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (auth?.isAuthenticated) {
      const returnTo = searchParams.get("returnTo") || "/";
      navigate(returnTo, { replace: true });
    }
  }, [auth?.isAuthenticated, navigate, searchParams]);

  if (auth?.isAuthenticated) {
    return null;
  }

  return children;
};

export default GuestOnlyRoute;
