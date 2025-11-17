// src/routes/MainRoutes.tsx
import LoadingPage from "../../pages/loading/loading-page";
import RouteType from "../interface/route-type";
import NotFoundPage from "@/pages/not-found/not-found-page";
import HomePage from "@/pages/home/home-page";
import { settingRoutes } from "./setting.routes";
import RegisterPage from "@/pages/register/register-page";
import LoginPage from "@/pages/login/login-page";
import { friendsRoutes } from "./friends.routes";
import NotificationPage from "@/pages/notifications/notifications-page";
import { userRoute } from "./profile.routes";
import DefaultLayout from "../components/layouts/default-layout";
import SecondLayout from "../components/layouts/second-layout";

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
    ],
  },
];
