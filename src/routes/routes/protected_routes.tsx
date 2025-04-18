// src/routes/ProtectedRoutes.tsx
import ProtectedLayout from "../../components/layout/Layout/ProtectedLayout";
import HomePage from "../../pages/home/HomePage";
import RouteType from "../interface/route_type";
import { settingRoutes } from "./setting_routes";

export const protectedRoutes : RouteType = {
    element: <ProtectedLayout />,
    children: [
        { path: "/", element: <HomePage /> },
        settingRoutes
    ]
}
