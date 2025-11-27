import { LocaleKeys } from "@/hooks/use-trans";

export interface AuthState {
  isAuthenticated: boolean | null;
  userId?: string;
  urlName?: string;
  lang: LocaleKeys;
  isOnBoarding?: boolean;
}

export const initialAuthStatus: AuthState = {
  isAuthenticated: false,
  lang: "en",
  isOnBoarding: false,
};
