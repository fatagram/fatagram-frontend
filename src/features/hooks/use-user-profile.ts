import { userProfileService } from "@/api/user/user-profile.api";
import { useSafeQueryResult } from "@/hooks/use-safe-query";
import { User } from "@/types/entities/user.type";

export const useGetUserProfile = (userId: string) => {
  return useSafeQueryResult<User>({
    queryKey: ["user", "profile", userId],
    fn: () => userProfileService.getHeaderProfile(userId),
    enabled: !!userId,
  });
};

export const useGetUserFullName = (userId: string) => {
  return useSafeQueryResult<User>({
    queryKey: ["user", "full-name", userId],
    fn: () => userProfileService.getUserFullName(userId),
    enabled: !!userId,
  });
};

export const useGetUserAvatar = (userId: string) => {
  return useSafeQueryResult<User>({
    queryKey: ["user", "avatar", userId],
    fn: () => userProfileService.getUserAvatar(userId),
    enabled: !!userId,
  });
};

export const useGetUserBackground = (userId: string) => {
  return useSafeQueryResult<User>({
    queryKey: ["user", "background", userId],
    fn: () => userProfileService.getUserBackground(userId),
    enabled: !!userId,
  });
};

export const useGetUserUrlName = (userId: string) => {
  return useSafeQueryResult<User>({
    queryKey: ["user", "url-name", userId],
    fn: () => userProfileService.getUserUrlName(userId),
    enabled: !!userId,
  });
};

export const useUserProfile = (userId: string) => {
  const { data: profile } = useGetUserProfile(userId);
  const { data: fullName } = useGetUserFullName(userId);
  const { data: avatar } = useGetUserAvatar(userId);
  const { data: background } = useGetUserBackground(userId);
  const { data: urlName } = useGetUserUrlName(userId);

  return {
    profile,
    fullName,
    avatar,
    background,
    urlName,
  };
};
