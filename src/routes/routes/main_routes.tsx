// src/routes/MainRoutes.tsx
import Layout from "../../components/layout/Layout/Layout";
import ProfilePage from "../../pages/profile/ProfilePage";
import LoadingPage from "../../pages/loading/LoadingPage";
import RouteType from "../interface/route_type";
import NotFoundPage from "@/pages/not_found/NotFoundPage";

export const mainRoutes : RouteType = {
    element: <Layout />,
    children: [
        { path: "/:userId", element: <ProfilePage /> },
        { path: "/loading", element: <LoadingPage /> },
        { path: "*", element: <NotFoundPage /> }, // Catch-all route for 404
    ]
};
