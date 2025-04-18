import React from "react";

export default interface RouteType {
    element: React.ReactNode;
    children?: RouteType[];
    path?: string;
}