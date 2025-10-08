import { authService } from "@/api/auth/auth.api";
import LoginDto, { LoginResponse } from "@/api/auth/dto/login.dto";
import { userProfileService } from "@/api/user/user-profile.api";
import {
  getRefreshToken,
  getRefreshTokenFromSession,
  removeRefreshToken,
  removeRefreshTokenFromSession,
  setRefreshToken,
  setRefreshTokenToSession,
} from "@/utils/token";
import React, { createContext, useCallback, useEffect, useMemo } from "react";
import { Result } from "@/api/common/result";
import { useDispatch } from "react-redux";
import { resetState } from "@/features/notifications/stores/notification-slice";
import { useQueryClient } from "@tanstack/react-query";
import { AuthState, initialAuthStatus } from "@/types/auth-state";
import { useLanguage } from "@/hooks/utilities/use-language";
import { useDialog } from "@/hooks/utilities/use-dialog";
import { useLoading } from "@/hooks/utilities/use-loading";
import { LANG_LIST, Language } from "../common/language-context";

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
  logIn: (loginDto: LoginDto) => Promise<Result<LoginResponse>>;
  logOut?: () => Promise<void>;
  userId?: string;
  urlName?: string;
}

// Create AuthContext
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  isInitialized: false,
  logIn: () => Promise.resolve({ success: false, data: undefined }),
  logOut: () => Promise.resolve(),
  userId: undefined,
  urlName: undefined,
});

type AuthProviderProps = {
  children: React.ReactNode;
};

// Create AuthProvider
export const AuthProvider = React.memo(function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = React.useReducer(authReducer, initialAuthStatus);
  const { setLanguage } = useLanguage();
  const { openDialog, closeDialog } = useDialog();
  const { increment, decrement } = useLoading();
  const _dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Function to set language when reload or login - MEMOIZED
  const setLang = useCallback((langCode: string) => {
    if (LANG_LIST.includes(langCode as Language)) {
      setLanguage(langCode as Language);
    }
  }, [setLanguage]);

  // Function to login
  const _logIn = useCallback(
    async (loginDto: LoginDto): Promise<Result<LoginResponse>> => {
      if (state.isAuthenticated) return { success: false, errorCode: "AlreadyLoggedIn" };
      try {
        const result = await authService.login(loginDto);
        if (result.success) {
          dispatch({
            type: "LOGIN",
            payload: {
              userId: result.data?.userId,
              urlName: result.data?.urlName,
              lang: result.data?.languageCode || "en",
            },
          });
          if (localStorage.getItem("isRememberMe") === "true") {
            setRefreshToken(result.data?.refreshToken || "");
          } else {
            setRefreshTokenToSession(result.data?.refreshToken || "");
          }
          closeDialog();
        }
        return result;
      } catch (err) {
        return { success: false, data: undefined };
      }
    },
    [state.isAuthenticated, closeDialog, dispatch],
  );

  const clearUserData = useCallback(() => {
    removeRefreshToken();
    removeRefreshTokenFromSession();
    queryClient.clear();
    _dispatch(resetState());
  }, [_dispatch, queryClient]);

  // Function to logout
  const _logOut = useCallback(async () => {
    try {
      increment();
      if ((await authService.logout()).success) {
        console.log("User is logged out");
        dispatch({ type: "LOGOUT" });
        clearUserData();
      } else {
        openDialog({
          title: "Logout failed",
          content: "Logout failed. Please try again later.",
        });
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      decrement();
    }
  }, [increment, decrement, clearUserData, openDialog]);

  const checkAuth = useCallback(async () => {
    try {
      const result = await authService.ping();
      if (!result.success) {
        await _logOut();
      }
    } catch (err) {
      console.error("Check auth failed:", err);
      await _logOut();
    }
  }, [_logOut]);

  // Memoize initialize function
  const initialize = useCallback(async () => {
    try {
      increment();
      // Check if refresh token exists first
      const refreshToken = getRefreshToken() || getRefreshTokenFromSession();

      if (!refreshToken) {
        // No token found, user is not authenticated
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            userId: "",
            urlName: undefined,
            lang: "en",
          },
        });
        return;
      }

      // Token exists, try to verify with server
      const result = await userProfileService.GetMe();
      // console.log(result);
      if (result.success) {
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: true,
            userId: result.data?.id || "",
            urlName: result.data?.urlName,
            lang: result.data?.languageCode || "en",
          },
        });
        setLang(result.data?.languageCode || "en");
        // console.log("User is authenticated");
      } else {
        // API failed but token exists - keep authenticated for dev experience
        console.warn("GetMe API failed but token exists, keeping authenticated");
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: true, // Keep authenticated if we have token
            userId: "",
            urlName: undefined,
            lang: "en",
          },
        });
      }
    } catch (err) {
      console.error("Check auth failed:", err);
      // Check if we have token - if yes, keep authenticated
      const refreshToken = getRefreshToken() || getRefreshTokenFromSession();
      dispatch({
        type: "INITIALIZE",
        payload: {
          isAuthenticated: !!refreshToken, // Keep auth if token exists
          userId: "",
          urlName: undefined,
          lang: "en",
        },
      });
    } finally {
      decrement();
    }
  }, [increment, decrement, setLang]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const handleFocus = () => {
      checkAuth();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          isAuthenticated: state.isAuthenticated,
          isInitialized: state.isInitialized,
          userId: state.userId,
          urlName: state.urlName,
          logIn: _logIn,
          logOut: _logOut,
        }),
        [state.isAuthenticated, state.isInitialized, state.userId, state.urlName, _logIn, _logOut],
      )}
    >
      {state.isInitialized && children}
    </AuthContext.Provider>
  );
});