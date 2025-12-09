import { userProfileService } from "@/api/user/user-profile.api";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { useQueryClient } from "@tanstack/react-query";

export const useSelectAvatar = (targetId: string) => {
  const queryClient = useQueryClient();
  return useResultFetcher(userProfileService.UploadAvatar, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", "avatar", targetId],
      });
    },
  });
};
