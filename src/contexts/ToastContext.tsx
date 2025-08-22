import Button from "@/components/common/ui/Button";
import Text from "@/components/common/ui/Text";
import NotificationFactory from "@/features/notifications/components/NotificationFactory";
import React from "react";
import { useNavigate } from "react-router-dom";

// Toast item type
interface ToastItem {
    id: string;
    type: "notification" | "error"
    payload: any;
    duration?: number;
}

// Toast context type
interface ToastContextType {
    pushToast: (item: ToastItem) => void;
}

// Toast manager props
interface ToastManagerProps {
    className?: string,
    children?: React.ReactNode;
}

// Toast context
const ToastContext = React.createContext<ToastContextType>({
    pushToast: () => {}
})

// Toast manager
const ToastManager: React.FC<ToastManagerProps> = ({
    className,
    children
}) => {

    const [toast, setToast] = React.useState<ToastItem | null>(null); // Current toast item
    const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null); // Toast timer

    const navigate = useNavigate(); 

    // Push a new toast
    const pushToast = (item: ToastItem) => {
        if (timer) {
            clearTimeout(timer);
        }
        setToast(item);
        const newTimer = setTimeout(() => {
            setToast(null);
        }, item.duration || 3000);
        setTimer(newTimer);
    }

    return (
        <ToastContext.Provider value={{ pushToast }}>
            {children}
            {toast && (
                <div className={`animate-left-to-right fixed bottom-8 left-8 rounded-lg shadow-2xl
                    bg-[var(--main-bg-color)] text-[var(--text-color)] max-w-full z-50
                     ${className}`}>
                    {
                        toast.type === "notification" ? (
                            <div className="px-4 py-4 flex flex-col gap-4">
                                <Text weight="bold">New notification</Text>
                                <NotificationFactory notificationDto={toast.payload.notificationDto}
                                    onClick={() => navigate(toast.payload.notificationDto.link)}/>
                            </div>
                        ) : (
                            <div>More</div>
                        )
                    }
                    <Button size="sm-1" variant="third" className="absolute top-2 right-2" onClick={() => setToast(null)}>
                        <i className="fa-solid fa-xmark"></i>
                    </Button>
                </div>
            )}
        </ToastContext.Provider>
    )
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ToastManager>
            {children}
        </ToastManager>
    );
};

export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

