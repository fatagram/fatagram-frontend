import { userProfileService } from "@/api/user/user-profile.api";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { useQueryClient } from "@tanstack/react-query";

export const useSelectBackground = (targetId: string) => {
  const queryClient = useQueryClient();
  return useResultFetcher(userProfileService.UploadBackground, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", "background", targetId],
      });
    },
  });
};
