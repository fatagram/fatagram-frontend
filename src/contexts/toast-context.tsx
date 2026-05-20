import { Button, Text } from "@/components/atoms";
import NotificationFactory from "@/features/notifications/components/notification-factory";
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

// Toast item type
interface ToastItem {
  id: string;
  type: "notification" | "error";
  payload: any;
  duration?: number;
}

// Toast context type
export interface ToastContextType {
  pushToast: (item: ToastItem) => void;
}

// Toast manager props
interface ToastManagerProps {
  className?: string;
  children?: React.ReactNode;
}

// Toast context
export const ToastContext = React.createContext<ToastContextType>({
  pushToast: () => {},
});

// Toast manager
const ToastManager: React.FC<ToastManagerProps> = React.memo(function ToastManager({
  className,
  children,
}) {
  const [toast, setToast] = React.useState<ToastItem | null>(null); // Current toast item
  const [_timer, setTimer] = React.useState<NodeJS.Timeout | null>(null); // Toast timer

  const navigate = useNavigate();

  // Push a new toast
  const pushToast = React.useCallback((item: ToastItem) => {
    setTimer((prevTimer) => {
      if (prevTimer) {
        clearTimeout(prevTimer);
      }
      return null;
    });

    setToast(item);

    const newTimer = setTimeout(() => {
      setToast(null);
    }, item.duration || 3000);

    setTimer(newTimer);
  }, []);

  const value = React.useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div
          className={`animate-slide-partial-from-left fixed bottom-8 left-8 rounded-2xl shadow-2xl
                    bg-bg-second max-w-full z-50
                     ${className}`}
        >
          {toast.type === "notification" ? (
            <div className="px-4 py-4 flex flex-col gap-4">
              <Text weight="bold">New notification</Text>
              <NotificationFactory
                notificationDto={toast.payload.notificationDto}
                onClick={() => navigate(toast.payload.notificationDto.link)}
              />
            </div>
          ) : (
            <div>More</div>
          )}
          <Button
            sz="sm"
            variant="third"
            className="absolute top-2 right-2"
            onClick={() => setToast(null)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>
      )}
    </ToastContext.Provider>
  );
});

export const ToastProvider = React.memo(function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastManager>{children}</ToastManager>;
});

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
