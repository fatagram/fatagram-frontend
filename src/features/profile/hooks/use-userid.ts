import { userProfileService } from "@/api/user/user-profile.api";
import { useSafeQueryResult } from "@/hooks/use-safe-query";

export const useUserId = (userParam: string) => {
  return useSafeQueryResult({
    queryKey: ["user-profile-id", userParam],
    fn: async () => await userProfileService.getUserId(userParam),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!userParam,
    retry: 1,
  });
};
