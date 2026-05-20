import { usePageTransition } from "@/hooks/use-page-transition";
import { Outlet } from "react-router-dom";
import clsx from "clsx";

export const PageTransition = () => {
  const { key, enterClass } = usePageTransition();

  return (
    <div
      key={key}
      className={clsx("flex-1 flex flex-col", enterClass)}
    >
      <Outlet />
    </div>
  );
};
