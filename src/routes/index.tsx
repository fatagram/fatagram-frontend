import React, { useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import { mainRoutes } from "./main.routes";
import RouteType from "../types/route-type";
import RouteWrapper from "../features/components/routes/route-wrapper";

const AppRoutes: React.FC = () => {
  const generateRoutes = useCallback((routes: RouteType[]) => {
    return routes.map((route, idx) => {
      const key = route.path ?? `route-${idx}`;
      return (
        <Route key={key} path={route.path} element={<RouteWrapper {...route} />}>
          {route.children && generateRoutes(route.children)}
        </Route>
      );
    });
  }, []);

  return <Routes>{generateRoutes(mainRoutes)}</Routes>;
};

export default AppRoutes;
