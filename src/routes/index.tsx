import React, { useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import { mainRoutes } from "./routes/main.routes";
import RouteType from "./interface/route-type";
import RouteWrapper from "./components/routes/route-wrapper";
import { AliveScope } from "react-activation";

const AppRoutes: React.FC = () => {
  const generateRoutes = useCallback((routes: RouteType[]) => {
    return routes.map((route, idx) => {
      const key = route.path ?? `route-${idx}`;
      return (
        <Route
          key={key}
          path={route.path}
          element={<RouteWrapper {...route} />}
        >
          {route.children && generateRoutes(route.children)}
        </Route>
      );
    });
  }, []);

  return (
    <AliveScope>
      <Routes>{generateRoutes(mainRoutes)}</Routes>
    </AliveScope>
  );
};

export default AppRoutes;
