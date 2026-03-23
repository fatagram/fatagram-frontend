// src/routes/MainRoutes.tsx
import LoadingPage from "../features/components/loading-page";
import RouteType from "../types/route-type";
import NotFoundPage from "@/features/components/not-found-page";
import HomePage from "@/features/home/home-page";
import RegisterPage from "@/features/auth/register/register-page";
import LoginPage from "@/features/auth/login/login-page";
import { friendsRoutes } from "./friends.routes";
import NotificationPage from "@/features/notifications/notifications-page";
import { userRoute } from "./profile.routes";
import DefaultLayout from "../features/components/layouts/default-layout";
import SecondLayout from "../features/components/layouts/second-layout";
import GoogleCallbackPage from "@/features/auth/google-callback/google-callback-page";
import OnboardingPage from "@/features/onboarding/onboarding-page";
import { settingRoutes } from "./setting.routes";
import FatalkPage from "@/features/chat/fatalk-page";

export const mainRoutes: RouteType[] = [
  {
    element: <DefaultLayout />,
    type: "public",
    children: [
      {
        path: "/",
        element: <HomePage />,
        type: "private",
        index: true,
        keepAlive: true,
      },
      friendsRoutes,
      settingRoutes,
      userRoute,
      {
        path: "/notifications",
        element: <NotificationPage />,
        type: "private",
      },
      {
        path: "/fatalk",
        element: <FatalkPage />,
        type: "private",
      },
      {
        path: "/fatalk/:conversationId",
        element: <FatalkPage />,
        type: "private",
      },
      { path: "/loading", type: "public", element: <LoadingPage /> },
      { path: "*", type: "public", element: <NotFoundPage /> },
    ],
  },
  {
    element: <SecondLayout />,
    type: "public",
    children: [
      {
        path: "/login",
        element: <LoginPage />,
        type: "auth",
      },
      {
        path: "/register",
        element: <RegisterPage />,
        type: "auth",
      },
      {
        path: "/auth/google/callback",
        element: <GoogleCallbackPage />,
        type: "auth",
      },
      {
        path: "/onboarding",
        element: <OnboardingPage />,
        type: "private",
      },
    ],
  },
];
