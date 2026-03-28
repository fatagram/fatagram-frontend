import { useAuth } from "@/contexts/auth-context";
import LoadingPage from "@/features/components/loading-page";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      navigate("/login");
      return;
    }
    loginWithGoogle(code);
  }, []);

  return <LoadingPage />;
}
