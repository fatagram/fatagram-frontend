import { userProfileService } from "@/api/user/user-profile.api";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { useSafeQueryResult } from "@/hooks/use-safe-query";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

const USER_PROFILE_BASE_KEY = ["user", "profile"] as const;
const FULL_PROFILE_FIELDS =
  "id,firstName,lastName,middleName,fullName,nickname,avatar,background,urlName";
const SUMMARY_PROFILE_FIELDS = "id,fullName,avatar,urlName";
const DETAILS_PROFILE_FIELDS = "bio,description";

const normalizeFields = (fields: string) =>
  fields
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean)
    .sort()
    .join(",");

const userProfilePrefixKey = (userId: string) => ["user", "profile", userId] as const;
const profileQueryKey = (userId: string, fields: string) =>
  ["user", "profile", userId, normalizeFields(fields)] as const;

export const useOnboarding = () => {
  const queryClient = useQueryClient();
  return useResultFetcher(userProfileService.completeOnboarding, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_PROFILE_BASE_KEY,
      });
    },
  });
};

export const useGetUserProfile = (userId?: string) => {
  return useSafeQueryResult({
    queryKey: profileQueryKey(userId ?? "", FULL_PROFILE_FIELDS),
    fn: async () => await userProfileService.getProfile(userId!, FULL_PROFILE_FIELDS),
    enabled: !!userId,
  });
};

export const useGetUserProfiles = (userIds: string[]) => {
  const normalizedUserIds = useMemo(
    () => [...new Set(userIds.filter(Boolean))].sort(),
    [userIds.join(",")],
  );

  const queries = useQueries({
    queries: normalizedUserIds.map((id) => ({
      queryKey: profileQueryKey(id, SUMMARY_PROFILE_FIELDS),
      queryFn: async () => {
        return await userProfileService.getProfile(id, SUMMARY_PROFILE_FIELDS);
      },
      enabled: !!id,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);

  const userProfileMap = useMemo(
    () =>
      Object.fromEntries(
        queries
          .filter((q) => q.data?.data?.infos)
          .map((q) => [(q.data?.data?.infos as any).id, q.data?.data?.infos]),
      ),
    [queries],
  );

  return { userProfileMap, isLoading };
};

export const useGetUserAvatar = (userId: string) => {
  return useSafeQueryResult({
    queryKey: profileQueryKey(userId, "avatar"),
    fn: async () => await userProfileService.getProfile(userId, "avatar"),
    enabled: !!userId,
  });
};

export const useGetUserBackground = (userId: string) => {
  return useSafeQueryResult({
    queryKey: profileQueryKey(userId, "background,backgroundMetadata"),
    fn: async () => await userProfileService.getProfile(userId, "background,backgroundMetadata"),
    enabled: !!userId,
  });
};

export const useGetUserProfileDetails = (userId: string) => {
  return useSafeQueryResult({
    queryKey: profileQueryKey(userId, DETAILS_PROFILE_FIELDS),
    fn: async () => await userProfileService.getProfile(userId, DETAILS_PROFILE_FIELDS),
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
          queryKey: userProfilePrefixKey(userId),
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
        queryKey: userProfilePrefixKey(userId),
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
          queryKey: userProfilePrefixKey(userId),
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
        queryKey: userProfilePrefixKey(userId),
      });
    },
  });
};

export const useSelectBackground = (userId: string) => {
  const qc = useQueryClient();

  return useResultFetcher(
    async (data: { file: File; metadata: any }) =>
      await userProfileService.uploadBackground(data.file, data.metadata),
    {
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: userProfilePrefixKey(userId),
        });
      },
    },
  );
};

export const useSelectAvatar = (userId: string) => {
  const qc = useQueryClient();

  return useResultFetcher(userProfileService.uploadAvatar, {
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: userProfilePrefixKey(userId),
      });
    },
  });
};
