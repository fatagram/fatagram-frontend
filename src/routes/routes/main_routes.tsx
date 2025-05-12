// src/routes/MainRoutes.tsx
import Layout from "../../components/layout/Layout/Layout";
import ProfilePage from "../../pages/profile/ProfilePage";
import LoadingPage from "../../pages/loading/LoadingPage";
import RouteType from "../interface/route_type";
import NotFoundPage from "@/pages/not_found/NotFoundPage";
import HomePage from "@/pages/home/HomePage";
import { settingRoutes } from "./setting_routes";
import RegisterPage from "@/pages/register/RegisterPage";
import LoginPage from "@/pages/login/LoginPage";
import NoNavbarLayout from "@/components/layout/Layout/NoNavbarLayout";
import ProtectedRoute from "../components/protected_route";
import PublicRoute from "../components/public_route";
import { friendsRoutes } from "./friends_routes";

export const mainRoutes: RouteType[] = [
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: (
                    <ProtectedRoute>
                        <HomePage/>
                    </ProtectedRoute>
                ),
                index: true,
                keepAlive: true
            },
            friendsRoutes,
            settingRoutes,
            { 
                path: "/:userParam",
                element: (
                    <ProfilePage/>
                ),
            },
            { path: "/loading", element: <LoadingPage /> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
    {
        element: <NoNavbarLayout />,
        children: [
            { 
                path: "/login", 
                element: (
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                )
            },
            { 
                path: "/register", 
                element: (
                    <PublicRoute>
                        <RegisterPage />
                    </PublicRoute>
                )
            }
        ],
    },
];
