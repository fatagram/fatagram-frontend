import { CursorResult } from "@/api/common/result";
import { conversationService } from "@/api/conversation/conversation.api";
import { useAuth } from "@/contexts/auth-context";
import {
  SafeQueryResultOptions,
  useSafeInfiniteQueryResult,
  useSafeQueryResult,
} from "@/hooks/use-safe-query";
import { CursorQuery } from "@/types/query";
import { useQueryClient } from "@tanstack/react-query";

const conversationKeys = {
  list: (queryParams?: Omit<CursorQuery<string>, "cursor">) =>
    ["conversations", queryParams] as const,
  detail: (conversationId: string) => ["conversation", conversationId] as const,
  withUser: (targetId: string) => ["conversation", "with", targetId] as const,
};

export const useGetConversationWith = (targetId: string, config?: SafeQueryResultOptions<any>) => {
  return useSafeQueryResult({
    queryKey: conversationKeys.withUser(targetId),
    fn: async () => await conversationService.getConversationWith(targetId),
    enabled: false,
    options: config,
  });
};

export const useGetConversation = (conversationId: string) => {
  return useSafeQueryResult({
    queryKey: conversationKeys.detail(conversationId),
    fn: async () => {
      const res = await conversationService.getConversation(conversationId);
      console.log("Fetched conversation data:", res);
      return res;
    },
    enabled: !!conversationId,
  });
};

export const useConversations = (queryParams?: Omit<CursorQuery<string>, "cursor">) => {
  const { userId } = useAuth();

  return useSafeInfiniteQueryResult({
    queryKey: conversationKeys.list(queryParams),
    fn: async (cursor?: string) => {
      return await conversationService.getConversations({ ...queryParams, cursor });
    },
    enabled: !!userId,
  });
};

type ConversationPage<TCursor = string> = {
  pages: Array<CursorResult<any, TCursor>>;
  pageParams: unknown[];
};

export const useConversationCacheMutations = () => {
  const queryClient = useQueryClient();

  const pushConversationToTop = (conversationId: string) => {
    queryClient.setQueriesData<ConversationPage>({ queryKey: conversationKeys.list() }, (old) => {
      if (!old?.pages?.length) {
        return {
          pages: [
            {
              items: [{ id: conversationId }],
              nextCursor: undefined,
              hasNext: false,
            },
          ],
          pageParams: [undefined],
        };
      }

      // Delete the conversatiom from its current conversation
      const newPages = old.pages.map((page) => ({
        ...page,
        items: page.items.filter((c) => c.id !== conversationId),
      }));
      // Add the conversation to the top of the first page
      newPages[0] = {
        ...newPages[0],
        items: [{ id: conversationId }, ...newPages[0].items],
      };
      return { ...old, pages: newPages };
    });
  };

  return {
    pushConversationToTop,
  };
};
