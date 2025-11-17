// src/components/routes/RouteWrapper.tsx
import React from "react";
// import { KeepAlive } from "react-activation";
import GuestOnlyRoute from "./guest-only-route";
import UserOnlyRoute from "./user-only-route";

interface RouteWrapperProps {
  type?: "private" | "auth" | "public";
  keepAlive?: boolean;
  path?: string;
  element: React.ReactNode;
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({
  type,
  // keepAlive,
  // path,
  element,
}) => {
  // let wrapped = keepAlive ? (
  //   <KeepAlive name={path}>{element}</KeepAlive>
  // ) : (
  //   element
  // );

  let wrapped = element;

  if (type === "private") wrapped = <UserOnlyRoute>{wrapped}</UserOnlyRoute>;
  else if (type === "auth")
    wrapped = <GuestOnlyRoute>{wrapped}</GuestOnlyRoute>;

  return <>{wrapped}</>;
};

export default RouteWrapper;
