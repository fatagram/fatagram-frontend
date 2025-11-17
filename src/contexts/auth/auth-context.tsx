import { authService } from "@/api/auth/auth.api";
import { userProfileService } from "@/api/user/user-profile.api";
import React, { createContext, FC, useCallback, useEffect, useMemo, useReducer } from "react";
import { useDispatch } from "react-redux";
import { resetState } from "@/features/notifications/stores/notification-slice";
import { useQueryClient } from "@tanstack/react-query";
import { AuthState, initialAuthStatus } from "@/types/auth-state";
import { useLoading } from "@/hooks/contexts/use-loading";
import { LoginDto } from "@/types/entities";
import { LocaleKeys, useLanguage } from "@/hooks/use-trans";

type AuthAction =
  | { type: "INITIALIZE"; payload: Omit<AuthState, "isInitialized"> }
  | { type: "LOGIN"; payload: Omit<Omit<AuthState, "isInitialized">, "isAuthenticated"> }
  | { type: "LOGOUT" }
  | { type: "UPDATE_URL_NAME"; payload: string | undefined };

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "INITIALIZE":
      return {
        ...state,
        ...action.payload,
        isInitialized: true,
      };
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        userId: action.payload.userId,
        urlName: action.payload.urlName,
        lang: action.payload.lang,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        userId: "",
        urlName: undefined,
      };
    case "UPDATE_URL_NAME":
      return {
        ...state,
        urlName: action.payload,
      };
    default:
      return state;
  }
};

// Authentication context
export interface AuthContextType {
  isAuthenticated: boolean | null;
  isInitialized?: boolean;
  logIn: (loginDto: LoginDto) => void;
  logOut?: () => Promise<void>;
  setUrlName?: (urlName: string | undefined) => void;
  userId?: string;
  urlName?: string;
}

// Create AuthContext
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  isInitialized: false,
  logIn: () => Promise.resolve({ success: false, data: undefined }),
  logOut: () => Promise.resolve(),
  setUrlName: () => {},
  userId: undefined,
  urlName: undefined,
});

type AuthProviderProps = {
  children: React.ReactNode;
};

// Create AuthProvider
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthStatus);
  const { changeLanguage } = useLanguage();
  const { increment, decrement } = useLoading();
  const _dispatch = useDispatch();
  const queryClient = useQueryClient();

  const _logIn = async (loginDto: LoginDto) => {
    try {
      await authService.login(loginDto);
      // Fetch me
      const me = (await userProfileService.GetMe()).data;
      if (me) {
        dispatch({
          type: "LOGIN",
          payload: {
            userId: me.id,
            urlName: me.urlName,
            lang: (me.languageCode as LocaleKeys) || "en",
          },
        });
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const clearUserData = useCallback(() => {
    queryClient.clear();
    _dispatch(resetState());
  }, [queryClient, _dispatch]);

  // Function to logout
  const _logOut = useCallback(async () => {
    increment();
    await authService.logout();
    dispatch({ type: "LOGOUT" });
    clearUserData();
    decrement();
  }, [increment, decrement, clearUserData]);

  const setUrlName = useCallback((urlName: string | undefined) => {
    dispatch({
      type: "UPDATE_URL_NAME",
      payload: urlName,
    });
  }, []);

  // Memoize initialize function - Run ONLY ONCE on mount
  const initializeRef = React.useRef(false);

  useEffect(() => {
    // Prevent double initialization in StrictMode or on refresh
    if (initializeRef.current) return;
    initializeRef.current = true;

    const initialize = async () => {
      increment();
      try {
        const result = await userProfileService.GetMe();
        if (!result.success) {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              lang: "en",
            },
          });
          return;
        }
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: true,
            userId: result.data?.id,
            urlName: result.data?.urlName,
            lang: (result.data?.languageCode as LocaleKeys) || "en",
          },
        });
        changeLanguage((result.data?.languageCode as LocaleKeys) || "en");
      } finally {
        decrement();
      }
    };

    initialize();
  }, []); // Empty deps - run ONLY once

  const contextValue = useMemo(
    () => ({
      isAuthenticated: state.isAuthenticated,
      isInitialized: state.isInitialized,
      userId: state.userId,
      urlName: state.urlName,
      logIn: _logIn,
      logOut: _logOut,
      setUrlName,
    }),
    [
      state.isAuthenticated,
      state.isInitialized,
      state.userId,
      state.urlName,
      _logIn,
      _logOut,
      setUrlName,
    ],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
