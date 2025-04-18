// src/routes/AuthRoutes.tsx
import AuthLayout from "../../components/layout/Layout/AuthLayout";
import LoginPage from "../../pages/login/LoginPage";
import RegisterPage from "../../pages/register/RegisterPage";
import RouteType from "../interface/route_type";


export const authRoutes : RouteType = {
    element: <AuthLayout />,
    children: [
        { path: "/login", element: <LoginPage /> },
        { path: "/register", element: <RegisterPage /> },
    ]
}
