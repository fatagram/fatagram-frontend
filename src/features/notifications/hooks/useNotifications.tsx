import { notificationService } from "@/api/notification/notification.api"
import { useQuery } from "@tanstack/react-query"

const useNotifications = ({
    page = 1,
    pageSize = 10
} : {
    page?: number;
    pageSize?: number;
}) => {

    return useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await notificationService.getNotifications(page, pageSize);
            return res.data;
        },
        staleTime: 1000 * 60 * 5, 
        enabled: false
    })
}

export default useNotifications;