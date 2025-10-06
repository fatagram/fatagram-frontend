import { userProfileService } from "@/api/user/user-profile.api";
import { useQuery } from "@tanstack/react-query";

export function useUserId(userParam: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-profile-id", userParam],
    queryFn: async () => {
      const response = await userProfileService.GetProfile(userParam, "id");
      console.log("Fetch userId for", userParam, response);
      if (response.success) {
        return {
          userId: response.data.infos.id,
          userExist: true,
        };
      }
      return {
        userId: undefined,
        userExist: false,
      };
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
  }
};