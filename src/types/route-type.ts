import { JSX } from "react";

export default interface RouteType {
  element: JSX.Element;
  children?: RouteType[];
  path?: string;
  keepAlive?: boolean;
  index?: boolean;
  hasParams?: boolean;
  type?: "public" | "private" | "auth";
}
