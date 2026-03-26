import { friendshipService } from "@/api/user/friendship.api";
import { useSafeQueryResult } from "@/hooks/use-safe-query";

export const useFriendshipStatus = (targetId: string) => {
  return useSafeQueryResult({
    queryKey: ["friendshipStatus", targetId],
    fn: async () => await friendshipService.GetFriendshipStatus(targetId),
    enabled: !!targetId,
    retry: 1,
  });
};
