import { NotificationDto } from "@/api/notification/dto/notification.dto";
import Text from "@/components/common/ui/Text";
import NotificationMenu from "@/features/notifications/components/NotificationMenu/NotificationMenu";
import { setInNotificationPage, setShowNotification } from "@/features/notifications/stores/notificationsSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

type NotificationPageProps = {

}

const NotificationPage: React.FC<NotificationPageProps> = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setInNotificationPage(true));
        return () => {
            dispatch(setInNotificationPage(false));
            dispatch(setShowNotification(false));
        }
    }, [])

    return (
        <div className="relative flex items-start justify-center w-full sm:mt-20 mt-16">
            <NotificationMenu className="max-h-[800px] max-w-[600px] w-full px-2 py-4 pb-2 mx-4"/>
        </div>
    )
} 

export default NotificationPage;