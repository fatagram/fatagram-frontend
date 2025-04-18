import { mainRoutes } from "./routes/main_routes";
import { authRoutes } from "./routes/auth_routes";
import { protectedRoutes } from "./routes/protected_routes";
import { Route, Routes } from "react-router-dom";
import RouteType from "./interface/route_type";

const AppRoutes = () => {
    const allRoutes = [mainRoutes, authRoutes, protectedRoutes];

    const generateRoutes = (routes: RouteType[]) => {
        return routes.map((route) => {
            return (
                <Route key={route.path} path={route.path} element={route.element}>
                    {route.children && generateRoutes(route.children)}
                </Route>
            )
        })
    }

    return (
        <Routes>
            {generateRoutes(allRoutes)}
        </Routes>
    )
}

export default AppRoutes;