import { usePageTransition } from "@/hooks/use-page-transition";
import { Outlet } from "react-router-dom";
import clsx from "clsx";
import { useState } from "react";

export const PageTransition = () => {
  const { key, enterClass } = usePageTransition();
  const [finishedKey, setFinishedKey] = useState("");

  return (
    <div
      key={key}
      className={clsx("flex flex-col flex-1 min-h-0", key !== finishedKey && enterClass)}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) {
          setFinishedKey(key);
        }
      }}
    >
      <Outlet />
    </div>
  );
};
