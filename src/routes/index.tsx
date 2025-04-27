import { mainRoutes } from "./routes/main_routes";
import { Route, Routes } from "react-router-dom";
import RouteType from "./interface/route_type";

const AppRoutes: React.FC = () => {
    const allRoutes: RouteType[] = mainRoutes;

    const generateRoutes = (routes: RouteType[]) => {
        return routes.map((route, index) => {
            return (
                <Route key={route.path || index} path={route.path} element={route.element}>
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