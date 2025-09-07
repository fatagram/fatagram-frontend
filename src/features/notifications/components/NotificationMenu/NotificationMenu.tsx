import { NotificationDto } from "@/api/notification/dto/notification.dto";
import Badge from "@/components/common/ui/Badge/Badge";
import useClickOutside from "@/hooks/useClickOutside";
import React, { RefObject } from "react";
import useNotifications from "../../hooks/useNotifications";
import { ref } from "process";
import NotificationFactory from "../NotificationFactory";
import Text from "@/components/common/ui/Text";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { notificationService } from "@/api/notification/notification.api";
import { useNotificationHub } from "@/hubs/notification/useNotificationHub";
import { useToast } from "@/contexts/ToastContext";
import NotificationSkeletonLoading from "../NotificationCards/NotificationSkeletonLoading";
import Button from "@/components/common/ui/Button";

interface NotificationMenuProps {
}

const NotificationMenu: React.FC<NotificationMenuProps> = ({
}) => {
    const [showNotifications, setShowNotifications] = React.useState<boolean>(false);
    const [unreadCount, setUnreadCount] = React.useState<number>(0);
    const [notifications, setNotification] = React.useState<NotificationDto[]>([]);
    const [isShowFull, setIsShowFull] = React.useState<boolean>(false);
    const [page, setPage] = React.useState<number>(1);
    const [isFull, setIsFull] = React.useState<boolean>(false);

    const { t } = useTranslation() as { t: (key: string, options?: any) => string };

    // ToastContext (pushToast to show toast)
    const { pushToast } = useToast();

    // Refs for the menu and button
    const menuRef = React.useRef<HTMLDivElement>(null);
    const btnRef = React.useRef<HTMLDivElement>(null);
    const loaderRef = React.useRef<HTMLLIElement>(null);

    // Handle click outside to close the menu
    useClickOutside(menuRef as RefObject<HTMLDivElement>, btnRef as RefObject<HTMLDivElement>, () => {
        if (showNotifications) setShowNotifications(false);
    });

    const navigate = useNavigate();

    // Toggle notifications menu visibility
    const handleToggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const { isLoading, refetch } = useNotifications({
        page: page,
        pageSize: 5
    });

    React.useEffect(() => {
        const fetchData = async () => {
            const result = await refetch();
            if (page === 1) {
                setNotification(result.data?.notifications || []);
            } else {
                setNotification(prev => [...prev, ...(result.data?.notifications || [])]);
                if ((result.data?.notifications || []).length < 5) {
                    setIsFull(true);
                }
            }
            if (page === 1) {
                setUnreadCount(result.data?.unreadCount || 0);
            }
        };
        fetchData();
    }, [page]);

    const handleNewNotification = (data: NotificationDto) => {
        // console.log("New notification received:", data);
        if (data.type === "CancelNotification") {
            // If notification type is CancelNotification, remove it from the list
            setNotification(prevNotifications => prevNotifications.filter(n => n.id !== data.data.noticationId));
            if (!data.isRead) {
                setUnreadCount(prevCount => prevCount - 1);
            }
            return;
        }
        if (!isShowFull) {
            // Remove the oldest notification if we are not showing full notifications
            setNotification(prevNotifications => {
                if (prevNotifications.length >= 5) {
                    return [data, ...prevNotifications.slice(0, 4)];
                }
                return [data, ...prevNotifications];
            });
        }
        else {
            setNotification(prevNotifications => [data, ...prevNotifications]);
        }
        pushToast({
                id: data.id,
                type: "notification",
                payload: {
                    notificationDto: data
                },
                duration: 5000
            })
        setUnreadCount(prevCount => prevCount + 1);
    }

    useNotificationHub(handleNewNotification);

    React.useEffect(() => {
        if (!loaderRef.current || isFull) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setPage((prev) => prev + 1); 
            }
        });

        observer.observe(loaderRef.current); 
        return () => observer.disconnect(); 
    }, [loaderRef, isShowFull]);

    return (
        <div className="relative flex items-center justify-center">
            <Badge count={unreadCount} onClick={handleToggleNotifications} ref={btnRef}>
                <i className="fa-solid fa-bell"></i>
            </Badge>
            {showNotifications &&
                <div className="absolute sm:top-[120%] top-[108%] -right-[70px] sm:right-0 bg-[var(--main-bg-color)] shadow-xl rounded-xl 
                            sm:p-2 p-6 z-10 flex flex-col gap-2 min-w-[350px] max-h-[600px] 
                            min-h-[100px] sm:w-auto w-screen sm:h-auto h-screen"
                    ref={menuRef}>
                    <Text size="lg-1" weight="bold" className="px-2">{t("notifications:notifications.title")}</Text>
                    {!isLoading ? <>
                        {
                            notifications && notifications.length > 0 ?
                                <ul className="py-1 overflow-y-scroll scrollbar-none">
                                    {
                                        notifications.map((notification: NotificationDto, index: number) => (
                                            <li key={notification.id} className="px-2 py-2 hover:bg-[var(--second-bg-color)] rounded-lg 
                                                cursor-pointer"
                                            >
                                                <NotificationFactory notificationDto={notification}
                                                    onClick={async () => {
                                                        navigate(notification.link || "/");
                                                        setShowNotifications(false);
                                                        notification.isRead = true; 
                                                        setUnreadCount(prevCount => prevCount - 1);
                                                        await notificationService.markAsRead(notification.id);
                                                    }} />
                                            </li>
                                        ))
                                    }
                                    {!isShowFull ? 
                                        <li className="mt-2">
                                            <Button size="sm-1" variant="secondary" className="w-full"
                                                onClick={() => {
                                                setIsShowFull(true);
                                            }}>
                                                {t("notifications:notifications.showMore")}
                                            </Button>
                                        </li> :
                                        <li ref={loaderRef}/>
                                    } 
                                </ul> :
                                <div className="flex items-center justify-center h-40">
                                    {t("notifications:notifications.no-notifications")}
                                </div>
                        }
                    </> : 
                    <div className="flex flex-col gap-3">
                        {
                            [...Array(5)].map((index) => (
                                <NotificationSkeletonLoading key={index}/>
                            ))
                        }
                    </div>}
                </div>
            }
        </div>
    );
}
export default NotificationMenu;