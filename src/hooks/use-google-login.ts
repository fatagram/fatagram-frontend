import { authService } from "@/api/auth/auth.api";
import appConfig from "@/config";
import { useCallback } from "react";
import { useResultFetcher } from "./use-fetcher";

export function useGoogleLogin() {
  const redirectToGoogle = useCallback(async () => {
    const url =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      "?client_id=" +
      appConfig.googleClientId +
      "&redirect_uri=" +
      appConfig.googleRedirectUri +
      "&response_type=code" +
      "&scope=openid%20profile%20email";
    window.location.href = url;
  }, []);

  const fetcher = useResultFetcher(authService.loginWithGoogle);

  return {
    redirectToGoogle,
    fetcher,
  };
}
