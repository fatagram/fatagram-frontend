import { friendshipService } from "@/api/user/friendship.api";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { useSafeInfiniteQueryResult, useSafeQueryResult } from "@/hooks/use-safe-query";
import { CursorQuery } from "@/types/query";

export const useSentFriendRequest = () => {
  return useResultFetcher(friendshipService.SendAddFriendRequest);
};

export const useCancelFriendRequest = () => {
  return useResultFetcher(friendshipService.CancelAddFriendRequest);
};

export const useAcceptFriendRequest = () => {
  return useResultFetcher(friendshipService.AcceptAddFriendRequest);
};

export const useDeclineFriendRequest = () => {
  return useResultFetcher(friendshipService.DeclineAddFriendRequest);
};

export const useUnfriend = () => {
  return useResultFetcher(friendshipService.Unfriend);
};

export const useListFriendRequests = (queryParams?: Omit<CursorQuery<string>, "cursor">) => {
  return useSafeInfiniteQueryResult({
    queryKey: ["friendship", "friend-requests", queryParams],
    fn: (cursor?: string) => friendshipService.GetFriendRequests({ ...queryParams, cursor }),
    enabled: true,
  });
};

export const useGetNumberOfFriends = (userId: string) => {
  return useSafeQueryResult({
    queryKey: ["friendship", "number-of-friends", userId],
    fn: () => friendshipService.GetNumberOfFriends(userId),
    enabled: !!userId,
  });
};
