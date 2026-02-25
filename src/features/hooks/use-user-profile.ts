import { userProfileService } from "@/api/user/user-profile.api";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { useSafeQueryResult } from "@/hooks/use-safe-query";
import { User } from "@/types/entities/user.type";
import { useQueryClient } from "@tanstack/react-query";

const profileQueryKey = (userId: string) => ["user", "profile", userId];
const profileDetailsQueryKey = (userId: string) => ["user", "profile", "details", userId];

export const useGetUserProfile = (userId: string) => {
  return useSafeQueryResult<User>({
    queryKey: profileQueryKey(userId),
    fn: () =>
      userProfileService.getProfile(
        userId,
        "id,firstName,lastName,middleName,fullName,nickname,avatar,background,urlName",
      ),
    enabled: !!userId,
  });
};

export const useGetUserProfileDetails = (userId: string) => {
  return useSafeQueryResult<User>({
    queryKey: profileDetailsQueryKey(userId),
    fn: () => userProfileService.getProfile(userId, "bio,description"),
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

  return useResultFetcher(
    ({ urlName }: { urlName: string }) =>
      userProfileService.updateUrlName({
        urlName: urlName,
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
        queryKey: profileQueryKey(userId),
      });
    },
  });
};

export const useSelectAvatar = (userId: string) => {
  const qc = useQueryClient();

  return useResultFetcher(userProfileService.uploadAvatar, {
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: profileQueryKey(userId),
      });
    },
  });
};
