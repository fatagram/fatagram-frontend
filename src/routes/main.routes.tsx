// src/routes/MainRoutes.tsx
import { lazy, Suspense, ReactNode } from "react";
import LoadingPage from "../features/components/loading-page";
import RouteType from "../types/route-type";
import { friendsRoutes } from "./friends.routes";
import { userRoute } from "./profile.routes";
import DefaultLayout from "../features/components/layouts/default-layout";
import SecondLayout from "../features/components/layouts/second-layout";
import { settingRoutes } from "./setting.routes";

const NotFoundPage = lazy(() => import("@/features/components/not-found-page"));
const HomePage = lazy(() => import("@/features/home/home-page"));
const RegisterPage = lazy(() => import("@/features/auth/register/register-page"));
const LoginPage = lazy(() => import("@/features/auth/login/login-page"));
const NotificationPage = lazy(() => import("@/features/notifications/notifications-page"));
const GoogleCallbackPage = lazy(
  () => import("@/features/auth/google-callback/google-callback-page"),
);
const OnboardingPage = lazy(() => import("@/features/onboarding/onboarding-page"));
const FatalkPage = lazy(() => import("@/features/chat/fatalk/fatalk-page"));
const ConversationPage = lazy(() =>
  import("@/features/chat/fatalk/conversation/conversation-page").then((module) => ({
    default: module.ConversationPage,
  })),
);
const TempConversation = lazy(() =>
  import("@/features/chat/fatalk/temp/temp-conversation").then((module) => ({
    default: module.TempConversation,
  })),
);
const ThuNghiemCuon = lazy(() => import("@/features/tests/tests-infinity-scroll-page"));

const withFallback = (element: ReactNode) => (
  <Suspense fallback={<LoadingPage />}>{element}</Suspense>
);

export const mainRoutes: RouteType[] = [
  {
    element: <DefaultLayout />,
    type: "public",
    children: [
      {
        path: "/",
        element: withFallback(<HomePage />),
        type: "private",
        index: true,
        keepAlive: true,
      },
      friendsRoutes,
      settingRoutes,
      userRoute,
      {
        path: "/notifications",
        element: withFallback(<NotificationPage />),
        type: "private",
      },
      {
        path: "/fatalk",
        element: <FatalkPage />,
        type: "private",
        children: [
          {
            path: ":conversationId",
            element: <ConversationPage />,
            type: "private",
          },
          {
            path: "temp",
            element: <TempConversation />,
            type: "private",
          },
        ],
      },
      { path: "/loading", type: "public", element: <LoadingPage /> },
      { path: "*", type: "public", element: withFallback(<NotFoundPage />) },
      {
        path: "/thu-nghiem-cuon",
        element: withFallback(<ThuNghiemCuon />),
        type: "public",
      },
    ],
  },
  {
    element: <SecondLayout />,
    type: "public",
    children: [
      {
        path: "/login",
        element: withFallback(<LoginPage />),
        type: "auth",
      },
      {
        path: "/register",
        element: withFallback(<RegisterPage />),
        type: "auth",
      },
      {
        path: "/auth/google/callback",
        element: withFallback(<GoogleCallbackPage />),
        type: "auth",
      },
      {
        path: "/onboarding",
        element: withFallback(<OnboardingPage />),
        type: "private",
      },
    ],
  },
];
