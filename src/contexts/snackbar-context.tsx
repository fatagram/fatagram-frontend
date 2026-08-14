import Transition, { AnimationLib } from "@/components/ui/utils/transition";
import React, { createContext, useCallback, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCircleXmark,
  faTriangleExclamation,
  faCircleInfo,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export type SnackbarType = "success" | "error" | "warning" | "info";

export interface SnackbarItem {
  id: string;
  message: string;
  type: SnackbarType;
  duration?: number;
}

export interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType, duration?: number) => void;
}

export const SnackbarContext = createContext<SnackbarContextType>({
  showSnackbar: () => {},
});

interface SnackbarProviderProps {
  children: React.ReactNode;
}

export const SnackbarProvider = React.memo(function SnackbarProvider({
  children,
}: SnackbarProviderProps) {
  const [visibleSnackbar, setVisibleSnackbar] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [displaySnackbar, setDisplaySnackbar] = useState<SnackbarItem | null>(null);
  const durationAnim = 250;

  const showSnackbar = useCallback(
    (message: string, type: SnackbarType = "info", duration: number = 3000) => {
      // Clear existing timer
      if (timer) {
        clearTimeout(timer);
      }

      const id = Date.now().toString();
      const newSnackbar = { id, message, type, duration: duration };
      setVisibleSnackbar(true);
      setDisplaySnackbar(newSnackbar); // Update display immediately

      // Auto hide after duration
      const newTimer = setTimeout(() => {
        setVisibleSnackbar(false);
        // Keep displaySnackbar for exit animation, clear after animation completes
        setTimeout(() => setDisplaySnackbar(null), durationAnim);
      }, duration);

      setTimer(newTimer);
    },
    [timer],
  );

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar]);

  // Icon mapping - simple and harmonious with web theme
  const getIcon = (type: SnackbarType) => {
    switch (type) {
      case "success":
        return <FontAwesomeIcon icon={faCheck} className="text-primary-500 text-sm flex-shrink-0" />;
      case "error":
        return <FontAwesomeIcon icon={faCircleXmark} className="text-red-500 text-sm flex-shrink-0" />;
      case "warning":
        return <FontAwesomeIcon icon={faTriangleExclamation} className="text-yellow-500 text-sm flex-shrink-0" />;
      case "info":
      default:
        return <FontAwesomeIcon icon={faCircleInfo} className="text-primary-500 text-sm flex-shrink-0" />;
    }
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Transition
        className="fixed z-[9999] bottom-4 inset-x-4 sm:inset-x-auto sm:bottom-6 sm:right-6 flex justify-center sm:block pointer-events-none"
        animation={AnimationLib.ToastSlideUp}
        show={visibleSnackbar}
        duration={durationAnim}
      >
        <div
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
          className="px-4 py-3 rounded-xl shadow-lg border border-bg-fourth/80 bg-bg-fourth text-text-main flex items-center gap-3 w-full max-w-[440px] pointer-events-auto select-none"
        >
          {getIcon(displaySnackbar?.type ?? "info")}
          <span className="text-sm font-medium text-text-main flex-1 break-words leading-snug">
            {displaySnackbar?.message}
          </span>
          <button
            onClick={() => setVisibleSnackbar(false)}
            className="hidden sm:flex items-center justify-center w-6 h-6 rounded-md text-text-third hover:text-text-main hover:bg-bg-third/60 transition-colors ml-1 flex-shrink-0 cursor-pointer"
            title="Close"
          >
            <FontAwesomeIcon icon={faXmark} className="text-xs" />
          </button>
        </div>
      </Transition>
    </SnackbarContext.Provider>
  );
});

export function useSnackbar() {
  const context = React.useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
}
