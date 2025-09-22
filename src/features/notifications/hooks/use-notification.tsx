import { notificationService } from "@/api/notification/notification.api"
import { useQuery } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux";
import { loadNotifications } from "../stores/notification-slice";

const useNotifications = () => {
    const dispatch = useDispatch();
    const { pageSize, cursorId } = useSelector((state: any) => state.notifications);

    return useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await notificationService.getNotifications(cursorId, pageSize);
            dispatch(loadNotifications(res.data as any));
            return res.data;
        },
        staleTime: 1000 * 60 * 5, 
        enabled: true,
    })
}

export default useNotifications;