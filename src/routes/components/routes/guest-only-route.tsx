// src/routes/MainRoutes.tsx
import { useAuth } from "@/hooks/contexts/use-auth";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GuestOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // If user is authenticated, redirect them away from auth pages
    if (auth && auth.isAuthenticated) {
      const returnTo = searchParams.get("returnTo") || "/";
      navigate(returnTo, { replace: true });
    }
  }, [auth, navigate, searchParams]);

  // While auth state is loading/undefined, don't render anything
  if (!auth) return null;

  // If not authenticated (guest), render children (login/register pages)
  return children;
};

export default GuestOnlyRoute;
