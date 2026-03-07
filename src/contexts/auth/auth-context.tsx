import { authService } from "@/api/auth/auth.api";
import { userProfileService } from "@/api/user/user-profile.api";
import React, { createContext, FC, useCallback, useEffect, useMemo, useReducer } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthState, initialAuthStatus } from "@/types/auth-state";
import { LocaleKeys } from "@/hooks/use-trans";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { useGoogleLogin } from "@/hooks/use-google-login";
import { useNavigate } from "react-router-dom";
import { authEvents } from "@/events/auth-event";

type AuthAction =
  | { type: "INITIALIZE"; payload: Omit<AuthState, "isAuthenticated"> }
  | { type: "LOGIN"; payload: Omit<AuthState, "isAuthenticated"> }
  | { type: "LOGOUT" }
  | { type: "UPDATE_URL_NAME"; payload: string | undefined };

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
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
  logIn: (...args: any[]) => Promise<any>;
  loginWithGoogle: (...args: any[]) => Promise<any>;
  redirectToGoogle: () => void;
  logOut?: () => Promise<void>;
  setUrlName?: (urlName: string | undefined) => void;
  userId?: string;
  urlName?: string;
  isOnBoarding?: boolean;
}

// Create AuthContext
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  logIn: () => Promise.resolve(),
  loginWithGoogle: () => Promise.resolve(),
  redirectToGoogle: () => {},
  logOut: () => Promise.resolve(),
  setUrlName: () => {},
  userId: undefined,
  urlName: undefined,
  isOnBoarding: false,
});

type AuthProviderProps = {
  children: React.ReactNode;
  initialIsAuthenticated?: boolean;
  userData?: any;
};

// Create AuthProvider
export const AuthProvider: FC<AuthProviderProps> = ({
  children,
  initialIsAuthenticated,
  userData,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    ...initialAuthStatus,
    isAuthenticated: (initialIsAuthenticated ?? null) as boolean | null,
    userId: userData?.id,
    urlName: userData?.urlName,
    lang: userData?.languageCode as LocaleKeys,
    isOnBoarding: userData?.isOnBoarding,
  });
  // console.log("AuthContext", userData);
  // const { changeLanguage } = useLanguage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { fetch: me } = useResultFetcher(userProfileService.getMe, {});

  const { fetch: login } = useResultFetcher(authService.login, {
    onSuccess: async () => {
      await me(undefined, {
        onSuccess: (data) => {
          dispatch({
            type: "LOGIN",
            payload: {
              userId: data?.infos.id,
              urlName: data?.infos.urlName,
              lang: (data?.infos.languageCode as LocaleKeys) || "en",
            },
          });
        },
      });
    },
  });
  const { fetch: logout } = useResultFetcher(authService.logout, {
    onSuccess: () => {
      dispatch({ type: "LOGOUT" });
      clearUserData();
    },
  });

  const { redirectToGoogle, fetcher: loginWithGoogle } = useGoogleLogin();

  const handleLoginWithGoogle = async (code: string) => {
    await loginWithGoogle.fetch(code, {
      onSuccess: async () => {
        await me(undefined, {
          onSuccess: async (data) => {
            dispatch({
              type: "LOGIN",
              payload: {
                userId: data?.infos.id,
                urlName: data?.infos.urlName,
                lang: (data?.infos.languageCode as LocaleKeys) || "en",
              },
            });
          },
        });
      },
    });
  };

  const clearUserData = useCallback(() => {
    queryClient.clear();
  }, [queryClient]);

  const setUrlName = useCallback((urlName: string | undefined) => {
    dispatch({
      type: "UPDATE_URL_NAME",
      payload: urlName,
    });
  }, []);

  useEffect(() => {
    const handleRedirectToOnboarding = () => {
      navigate("/onboarding");
    };

    authEvents.on("redirectToOnboarding", handleRedirectToOnboarding);

    return () => {
      authEvents.off("redirectToOnboarding", handleRedirectToOnboarding);
    };
  }, [navigate]);

  useEffect(() => {
    if (state.isAuthenticated && !state.userId) {
      me(undefined, {
        onSuccess: (data) => {
          dispatch({
            type: "LOGIN",
            payload: {
              userId: data?.infos.id,
              urlName: data?.infos.urlName,
              lang: (data?.infos.languageCode as LocaleKeys) || "en",
            },
          });
        },
      });
    }
  }, [state.isAuthenticated, state.userId]);

  const contextValue = useMemo(
    () => ({
      isAuthenticated: state.isAuthenticated,
      userId: state.userId,
      urlName: state.urlName,
      logIn: login,
      loginWithGoogle: handleLoginWithGoogle,
      redirectToGoogle,
      logOut: logout,
      setUrlName,
      isOnBoarding: state.isOnBoarding,
    }),
    [
      state.isAuthenticated,
      state.userId,
      state.urlName,
      login,
      handleLoginWithGoogle,
      redirectToGoogle,
      logout,
      setUrlName,
      state.isOnBoarding,
    ],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
