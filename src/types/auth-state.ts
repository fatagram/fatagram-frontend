export interface AuthState {
  isAuthenticated: boolean;
  userId?: string;
  urlName?: string;
  lang: string;
  isInitialized: boolean;
}

export const initialAuthStatus: AuthState = {
  isAuthenticated: false,
  lang: "en",
  isInitialized: false,
};
