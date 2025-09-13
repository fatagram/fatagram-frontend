// src/routes/MainRoutes.tsx
import Layout from "../../components/layout/Layout/Layout";
import ProfilePage from "../../pages/profile/ProfilePage";
import LoadingPage from "../../pages/loading/LoadingPage";
import RouteType from "../interface/route_type";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import HomePage from "@/pages/home/HomePage";
import { settingRoutes } from "./setting-routes";
import RegisterPage from "@/pages/register/RegisterPage";
import LoginPage from "@/pages/login/LoginPage";
import NoNavbarLayout from "@/components/layout/Layout/NoNavbarLayout";
import ProtectedRoute from "../components/protected-route";
import PublicRoute from "../components/public-route";
import { friendsRoutes } from "./friends-routes";
import PostsPage from "@/pages/profile/sub_pages/posts/PostsPage";
import ProfileFriendsPage from "@/pages/profile/sub_pages/friends/ProfileFriendsPage";
import ProfileAboutPage from "@/pages/profile/sub_pages/about/ProfileAboutPage";
import ProfileAboutOverview from "@/pages/profile/sub_pages/about/ProfileAboutOverview";
import NotificationPage from "@/pages/notifications/NotificationPage";

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
                path: "/notifications",
                element: (
                    <NotificationPage />
                )
            },
            { 
                path: "/:userParam",
                element: (
                    <ProfilePage/>
                ),
                children: [
                    {
                        path: "",
                        element: <PostsPage />,
                        index: true
                    },
                    {
                        path: "friends",
                        element: <ProfileFriendsPage />,
                    },
                    {
                        path: "about",
                        element: <ProfileAboutPage />,
                        children: [
                            {
                                path: "overview",
                                element: <ProfileAboutOverview />,
                                index: true
                            },
                            {
                                path: "work-and-education",
                                element: <div>Work and Education</div>,
                            },
                            {
                                path: "contact-info",
                                element: <div>Contact Information</div>,
                            },
                            {
                                path: "places-lived",
                                element: <div>Places Lived</div>,
                            }
                        ]
                    },
                    {
                        path: "photos",
                        element: <div>Photos</div>,
                    },
                    {
                        path: "videos",
                        element: <div>Videos</div>,
                    },
                    {
                        path: "settings",
                        element: <div>Settings</div>,
                    }
                ]
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
