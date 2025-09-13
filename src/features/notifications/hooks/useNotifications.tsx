import { notificationService } from "@/api/notification/notification.api"
import { useQuery } from "@tanstack/react-query"
import { useDispatch } from "react-redux";
import { loadMoreNotifications, setNotifications } from "../stores/notificationsSlice";
import { useEffect } from "react";

const useNotifications = ({
    page = 1,
    pageSize = 10
} : {
    page?: number;
    pageSize?: number;
}) => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ["notifications", page],
        queryFn: async () => {
            const res = await notificationService.getNotifications(page, pageSize);
            await new Promise(resolve => setTimeout(resolve, 1500));
            if (page === 1) dispatch(setNotifications(res.data ?? {notifications: [], unreadCount: 0}));
            else if (res.data) dispatch(loadMoreNotifications(res.data.notifications));
            return res.data;
        },
        staleTime: 1000 * 60 * 5, 
        enabled: true,
    })
}

export default useNotifications;