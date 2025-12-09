import { userProfileService } from "@/api/user/user-profile.api";
import { useQuery } from "@tanstack/react-query";

export function useUserId(userParam: string) {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["user-profile-id", userParam],
    queryFn: async () => {
      try {
        const response = await userProfileService.getUserId(userParam);
        if (response.success) {
          return {
            userId: response.data?.id,
            userExist: true,
          };
        }
        return {
          userId: undefined,
          userExist: false,
        };
      } catch (error) {
        console.error("Error fetching userId:", error);
        return {
          userId: undefined,
          userExist: false,
        };
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!userParam,
    retry: 1,
  });

  return {
    userId: data?.userId,
    userExist: isError ? false : data?.userExist,
    isLoading,
    isFetching,
  };
}
