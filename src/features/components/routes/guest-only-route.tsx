// src/routes/MainRoutes.tsx
import { useAuth } from "@/contexts";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingPage from "../loading-page";

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
    return <LoadingPage />;
  }

  return children;
};

export default GuestOnlyRoute;
