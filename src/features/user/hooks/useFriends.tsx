import { friendshipService } from "@/api/user/friendship.api";
import { useQuery } from "@tanstack/react-query"

const useFriends = ({
    userId = "",
    keyword,
    page = 1,
    pageSize = 10
} : {
    userId?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
}) => {

    return useQuery({
        queryKey: ["friends", userId, keyword, page, pageSize],
        queryFn: async () => {
            const res = await friendshipService.GetFriends(userId, page, pageSize, keyword);
            return res.data;
        },
        staleTime: 1000 * 60 * 5, 
        enabled: true
    })
}

export default useFriends;