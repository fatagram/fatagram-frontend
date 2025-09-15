import { NotificationDto } from "@/api/notification/dto/notification.dto";
import React, { use } from "react";
import { useTranslation } from "react-i18next";
import useNotifications from "../../hooks/useNotifications";
import { useToast } from "@/contexts/ToastContext";
import { useNotificationHub } from "@/features/notifications/hubs/useNotificationHub";
import NotificationFactory from "../NotificationFactory";
import { useNavigate } from "react-router";
import { notificationService } from "@/api/notification/notification.api";
import Text from "@/components/common/ui/Text";
import Button from "@/components/common/ui/Button";
import NotificationSkeletonLoading from "../NotificationCards/NotificationSkeletonLoading";
import { useDispatch, useSelector } from "react-redux";
import { markAsRead, setCursorId, setShowFull } from "../../stores/notificationsSlice";

type NotificationMenuProps = {
    className?: string;
    onClick?: () => void;
    ref?: React.RefObject<HTMLDivElement | null>;
}

const NotificationMenu: React.FC<NotificationMenuProps> = ({
    className,
    onClick,
    ref
}) => {
    const { t } = useTranslation() as { t: (key: string, options?: any) => string };
    const dispatch = useDispatch();
    const { notifications, isInNotificationPage, cursorId, pageSize, isFull, isShowFull } = useSelector((state: any) => state.notifications ); 
    const navigate = useNavigate();

    const loaderRef = React.useRef<HTMLLIElement>(null);

    const { isLoading } = useNotifications({
        cursorId: cursorId,
        pageSize: pageSize
    });


    React.useEffect(() => {
        if (!loaderRef.current || isFull) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                dispatch(setCursorId(notifications[notifications.length - 1]?.id || ""));
                // console.log("Load more notifications, page:", page + 1);
            }
        });

        observer.observe(loaderRef.current); 
        return () => observer.disconnect(); 
    }, [loaderRef, isShowFull, isFull]);

    return (
        <div className={`bg-[var(--main-bg-color)] shadow-xl rounded-xl 
                            flex flex-col gap-2 ${className}`}
                        ref={ref}>
            <Text size="lg-1" weight="bold" className="px-2">{t("notifications:notifications.title")}</Text>
            {
                notifications && notifications.length > 0 ?
                    <ul className="relative py-1 overflow-y-scroll scrollbar-none">
                        {
                            isShowFull ? notifications.map((notification: NotificationDto) => (
                                <li key={notification.id} className="px-2 py-2 hover:bg-[var(--second-bg-color)] rounded-lg 
                                    cursor-pointer"
                                >
                                    <NotificationFactory notificationDto={notification}
                                        onClick={async () => {
                                            navigate(notification.link || "/");
                                            // notification.isRead = true;
                                            dispatch(markAsRead(notification.id));
                                            await notificationService.markAsRead(notification.id);
                                            onClick?.();
                                        }} />
                                </li>
                            )) : 
                            notifications.slice(0, 5).map((notification: NotificationDto) => (
                                <li key={notification.id} className="px-2 py-2 hover:bg-[var(--second-bg-color)] rounded-lg 
                                    cursor-pointer"
                                >
                                    <NotificationFactory notificationDto={notification}
                                        onClick={async () => {
                                            navigate(notification.link || "/");
                                            // notification.isRead = true;
                                            dispatch(markAsRead(notification.id));
                                            await notificationService.markAsRead(notification.id);
                                            onClick?.();
                                        }} />
                                </li>
                            ))
                        }
                        {isLoading && [...Array(2)].map((_, i) => (
                            <li key={`skeleton-${i}`} className="mt-1">
                                <NotificationSkeletonLoading />
                            </li>
                        ))}
                        {!isShowFull ? 
                            <li className="mt-2">
                                <Button size="sm-1" variant="secondary" className="w-full"
                                    onClick={() => {
                                        dispatch(setShowFull(true));
                                }}>
                                    {t("notifications:notifications.showMore")}
                                </Button>
                            </li> :
                            <li ref={loaderRef}/>
                        } 
                    </ul> : 
                    <>
                        { !isLoading ? <div className="flex items-center justify-center h-40">
                            {t("notifications:notifications.no-notifications")}
                        </div> : 
                        <div className="flex flex-col px-2 py-2 gap-3">
                            <NotificationSkeletonLoading />
                            <NotificationSkeletonLoading />
                            <NotificationSkeletonLoading />
                            <NotificationSkeletonLoading />
                            <NotificationSkeletonLoading />
                        </div>}
                    </>
            }

            { !isInNotificationPage && <div className="absolute right-4"
                onClick={() => navigate("/notifications")}
            >
                <Text size="sm-1" className="text-single-main cursor-pointer underline">
                    Mở thông báo
                </Text>
            </div> }
        </div>
    )
}

export default NotificationMenu