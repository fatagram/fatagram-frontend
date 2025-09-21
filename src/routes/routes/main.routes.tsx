// src/routes/MainRoutes.tsx
import LoadingPage from "../../pages/loading/LoadingPage";
import RouteType from "../interface/RouteType";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import HomePage from "@/pages/home/HomePage";
import { settingRoutes } from "./setting.routes";
import RegisterPage from "@/pages/register/RegisterPage";
import LoginPage from "@/pages/login/LoginPage";
import { friendsRoutes } from "./friends.routes";
import NotificationPage from "@/pages/notifications/NotificationPage";
import { userRoute } from "./profile.routes";
import DefaultLayout from "../components/DefaultLayout";
import SecondLayout from "../components/SecondLayout";

export const mainRoutes: RouteType[] = [
    {
        element: <DefaultLayout/>,
        children: [
            {
                path: "/",
                element: <HomePage/>,
                isUserOnly: true,
                index: true,
                keepAlive: true
            },
            friendsRoutes,
            settingRoutes,
            userRoute,
            {
                path: "/notifications",
                element: <NotificationPage/>,
                isUserOnly: true
            },
            { path: "/loading", element: <LoadingPage /> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
    {
        element: <SecondLayout/>,
        children: [
            { 
                path: "/login", 
                element: <LoginPage/>,
                isGuestOnly: true
            },
            { 
                path: "/register", 
                element: <RegisterPage/>,
                isGuestOnly: true
            }
        ],
    },
];
