export interface AuthState {
  isAuthenticated: boolean;
  userId: string;
  urlName?: string;
  lang: string;
};

export const initialAuthStatus: AuthState = {
  isAuthenticated: false,
  userId: "",
  urlName: undefined,
  lang: "en",
};