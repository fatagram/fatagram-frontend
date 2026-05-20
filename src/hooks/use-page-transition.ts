import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getTransitionDirection,
  getPageEnterClass,
  type TransitionDirection,
} from "@/utils/navigation-transition";

interface PageTransitionState {
  key: string;
  enterClass: string;
}

export const usePageTransition = () => {
  const location = useLocation();
  const prevPathRef = useRef<string>(location.pathname);
  const [state, setState] = useState<PageTransitionState>({
    key: location.pathname,
    enterClass: "",
  });

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const currentPath = location.pathname;

    if (prevPath === currentPath) return;

    const direction: TransitionDirection = getTransitionDirection(prevPath, currentPath);
    prevPathRef.current = currentPath;

    if (direction === "none") return;

    const enterClass = getPageEnterClass(direction);
    setState({ key: currentPath, enterClass });
  }, [location.pathname]);

  return state;
};
