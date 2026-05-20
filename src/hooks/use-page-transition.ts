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

  const currentPath = location.pathname;

  if (prevPathRef.current !== currentPath) {
    const direction: TransitionDirection = getTransitionDirection(prevPathRef.current, currentPath);
    prevPathRef.current = currentPath;
    enterClassRef.current = direction !== "none" ? getPageEnterClass(direction) : "";
  }

  return {
    key: currentPath,
    enterClass: enterClassRef.current,
  };
};
