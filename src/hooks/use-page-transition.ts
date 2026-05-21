import { useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  getTransitionDirection,
  getPageEnterClass,
  type TransitionDirection,
} from "@/utils/navigation-transition";

export const usePageTransition = () => {
  const location = useLocation();
  const prevPathRef = useRef<string>(location.pathname);
  const enterClassRef = useRef<string>("");
  const keyRef = useRef<string>(location.pathname);

  const currentPath = location.pathname;

  if (prevPathRef.current !== currentPath) {
    const direction: TransitionDirection = getTransitionDirection(prevPathRef.current, currentPath);
    prevPathRef.current = currentPath;
    if (direction !== "none") {
      enterClassRef.current = getPageEnterClass(direction);
      keyRef.current = currentPath;
    } else {
      enterClassRef.current = "";
    }
  }

  return {
    key: keyRef.current,
    enterClass: enterClassRef.current,
  };
};
