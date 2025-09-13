import React, { useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import { mainRoutes } from "./routes/main-routes";
import RouteType from "./interface/route_type";
import { KeepAlive, AliveScope } from "react-activation";

const AppRoutes: React.FC = () => {
    const generateRoutes = useCallback((routes: RouteType[]) => {
        return routes.map((route, index) => {
            const key = route.path || `route-${index}`;
            const element = route.keepAlive
                ? <KeepAlive name={route.path}>{route.element}</KeepAlive>
                : route.element;

            if (route.index) {
                return <Route key={key} index element={element} />;
            }

            return (
                <Route key={key} path={route.path} element={element}>
                    {route.children && generateRoutes(route.children)}
                </Route>
            );
        });
    }, []);

    return (
        <AliveScope>
            <Routes>
                {generateRoutes(mainRoutes)}
            </Routes>
        </AliveScope>
    );
};

export default AppRoutes;
