import Transition, { AnimationLib } from "@/components/ui/utils/transition";
import React, { createContext, useCallback, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faTriangleExclamation, faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons";

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
  const durationAnim = 300;

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

  // Icon mapping
  const getIcon = (type: SnackbarType) => {
    switch (type) {
      case "success":
        return <FontAwesomeIcon icon={faCircleCheck} className="text-green-500" />;
      case "error":
        return <FontAwesomeIcon icon={faCircleXmark} className="text-red-500" />;
      case "warning":
        return <FontAwesomeIcon icon={faTriangleExclamation} className="text-yellow-500" />;
      case "info":
      default:
        return <FontAwesomeIcon icon={faCircleInfo} className="text-blue-500" />;
    }
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Transition
        className="fixed bottom-6 right-6 z-50"
        animation={AnimationLib.SlideRightToLeft}
        show={visibleSnackbar}
        duration={durationAnim}
      >
        <div
          className={`px-4 py-3 rounded-lg shadow-lg
                     bg-bg-fourth 
                     flex items-center gap-3
                     min-w-[300px] max-w-[500px]`}
        >
          {getIcon(displaySnackbar?.type ?? "info")}
          <span className="text-text-main flex-1">{displaySnackbar?.message}</span>
          <button
            onClick={() => setVisibleSnackbar(false)}
            className="text-text-third hover:text-text-main transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} />
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
