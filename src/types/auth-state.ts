import { LocaleKeys } from "@/hooks/use-trans";

export interface AuthState {
  isAuthenticated: boolean;
  userId?: string;
  urlName?: string;
  lang: LocaleKeys;
  isInitialized: boolean;
}

export const initialAuthStatus: AuthState = {
  isAuthenticated: false,
  lang: "en",
  isInitialized: false,
};
