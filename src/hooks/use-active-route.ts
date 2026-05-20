import { useMatch, useResolvedPath, useLocation } from "react-router-dom";
import { create } from "zustand";
import { useEffect } from "react";

interface NavigationState {
  pendingPath: string | null;
  setPendingPath: (path: string | null) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  pendingPath: null,
  setPendingPath: (path) => set({ pendingPath: path }),
}));

export const useActiveRoute = (to: string, end: boolean = false) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end });
  const location = useLocation();
  const { pendingPath, setPendingPath } = useNavigationStore();

  useEffect(() => {
    if (pendingPath) {
      setPendingPath(null);
    }
  }, [location.pathname]);

  if (pendingPath) {
    const isPendingTarget = end
      ? pendingPath === resolved.pathname
      : pendingPath.startsWith(resolved.pathname);

    if (isPendingTarget) return true;
    return false;
  }

  return !!match;
};
