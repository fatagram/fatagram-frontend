import { userProfileService } from "@/api/user/user-profile.api";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { useSafeQueryResult } from "@/hooks/use-safe-query";
import { useQueryClient } from "@tanstack/react-query";

const profileQueryKey = (userId: string) => ["user", "profile", userId];
const avatarQueryKey = (userId: string) => ["user", "avatar", userId];
const backgroundQueryKey = (userId: string) => ["user", "background", userId];
const profileDetailsQueryKey = (userId: string) => ["user", "profile", "details", userId];

export const useOnboarding = () => {
  const queryClient = useQueryClient();
  return useResultFetcher(userProfileService.completeOnboarding, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", "profile"],
      });
    },
  });
};

export const useGetUserProfile = (userId?: string) => {
  return useSafeQueryResult({
    queryKey: profileQueryKey(userId ?? ""),
    fn: async () =>
      await userProfileService.getProfile(
        userId!,
        "id,firstName,lastName,middleName,fullName,nickname,avatar,background,urlName",
      ),
    enabled: !!userId,
  });
};

export const useGetUserAvatar = (userId: string) => {
  return useSafeQueryResult({
    queryKey: avatarQueryKey(userId),
    fn: async () => await userProfileService.getProfile(userId, "avatar"),
    enabled: !!userId,
  });
};

export const useGetUserBackground = (userId: string) => {
  return useSafeQueryResult({
    queryKey: backgroundQueryKey(userId),
    fn: async () => await userProfileService.getProfile(userId, "background"),
    enabled: !!userId,
  });
};

export const useGetUserProfileDetails = (userId: string) => {
  return useSafeQueryResult({
    queryKey: profileDetailsQueryKey(userId),
    fn: async () => await userProfileService.getProfile(userId, "bio,description"),
    enabled: !!userId,
  });
};

export const useUpdateName = (userId: string) => {
  const qc = useQueryClient();

  return useResultFetcher(
    ({
      firstName,
      middleName,
      lastName,
    }: {
      firstName: string;
      middleName?: string | null;
      lastName: string;
    }) =>
      userProfileService.updateName({
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
      }),
    {
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: profileQueryKey(userId),
        });
      },
    },
  );
};

export const useUpdateUrlName = (userId: string) => {
  const qc = useQueryClient();

  return useResultFetcher(userProfileService.updateUrlName, {
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: profileQueryKey(userId),
      });
    },
  });
};

export const useUpdateNickname = (userId: string) => {
  const qc = useQueryClient();

  return useResultFetcher(
    ({ nickname }: { nickname: string }) =>
      userProfileService.updateNickname({
        nickname: nickname,
      }),
    {
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: profileQueryKey(userId),
        });
      },
    },
  );
};

export const useUpdateProfile = (userId: string) => {
  const qc = useQueryClient();

  return useResultFetcher((data: any) => userProfileService.updateProfile(data), {
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: profileQueryKey(userId),
      });
      qc.invalidateQueries({
        queryKey: profileDetailsQueryKey(userId),
      });
    },
  });
};

export const useSelectBackground = (userId: string) => {
  const qc = useQueryClient();

  return useResultFetcher(userProfileService.uploadBackground, {
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: backgroundQueryKey(userId),
      });
    },
  });
};

export const useSelectAvatar = (userId: string) => {
  const qc = useQueryClient();

  return useResultFetcher(userProfileService.uploadAvatar, {
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: avatarQueryKey(userId),
      });
    },
  });
};
