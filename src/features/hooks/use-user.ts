import { userService } from "@/api/user/user.api";
import { useSafeInfiniteQueryResult } from "@/hooks/use-safe-query";
import { CursorQuery } from "@/types/query";

const userKeys = {
  all: ["users"] as const,
  list: (queryParams?: Omit<CursorQuery<string>, "cursor">) =>
    [...userKeys.all, "list", queryParams] as const,
};

export const useGetInfiniteUsers = (queryParams?: Omit<CursorQuery<string>, "cursor">) => {
  return useSafeInfiniteQueryResult({
    queryKey: userKeys.list(queryParams),
    fn: async (cursor?: string) => await userService.getUsers({ ...queryParams, cursor }),
    enabled: true,
  });
};

export const useSearchUsers = (
  queryParams?: Omit<CursorQuery<string>, "cursor"> & { keyword?: string },
) => {
  return useSafeInfiniteQueryResult({
    queryKey: [...userKeys.all, "search", queryParams],
    fn: async (cursor?: string) => {
      // delay 1s
      await new Promise((resolve) => setTimeout(resolve, 500));
      return await userService.searchUsers({ ...queryParams, cursor });
    },
    enabled: true,
  });
};
