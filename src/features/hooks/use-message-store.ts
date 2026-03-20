import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { CursorResult } from "@/api/common/result";
import { MessageDto, MessageResponseDto } from "@/api/message/dto/message.dto";

// Message query keys helper (kept in sync with useMessages)
export const messageKeys = {
  list: (conversationId: string, params?: unknown) => ["messages", conversationId, params] as const,
};

type MessagePages<TCursor = string> = {
  pages: Array<CursorResult<MessageResponseDto, TCursor>>;
  pageParams: unknown[];
};

export function useMessageCacheMutations() {
  const queryClient = useQueryClient();

  const addMessageToCache = useCallback(
    (conversationId: string, message: MessageResponseDto, isDescending: boolean = true) => {
      queryClient.setQueriesData<MessagePages>(
        { queryKey: ["messages", conversationId] },
        (old) => {
          if (!old?.pages?.length) {
            return {
              pages: [
                {
                  items: [message],
                  nextCursor: undefined,
                  hasNext: false,
                },
              ],
              pageParams: [undefined],
            } as MessagePages;
          }

          // Với DESC: pages[0] = newest, pages[n] = oldest
          // Với ASC: pages[0] = oldest, pages[n] = newest
          const targetPageIndex = isDescending ? 0 : old.pages.length - 1;
          const targetPage = old.pages[targetPageIndex];

          // Avoid duplicates
          if (targetPage.items.some((m) => m.id === message.id)) return old;

          const newPages = [...old.pages];
          newPages[targetPageIndex] = {
            ...targetPage,
            items: isDescending ? [message, ...targetPage.items] : [...targetPage.items, message],
          };

          return {
            ...old,
            pages: newPages,
          } as MessagePages;
        },
      );
    },
    [queryClient],
  );

  const updateMessageInCache = useCallback(
    (conversationId: string, messageId: string, updater: (old: MessageDto) => MessageDto) => {
      queryClient.setQueriesData<MessagePages>(
        { queryKey: ["messages", conversationId] },
        (old) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((m) => (m.id === messageId ? updater(m) : m)),
            })),
          } as MessagePages;
        },
      );
    },
    [queryClient],
  );

  const removeMessageFromCache = useCallback(
    (conversationId: string, messageId: string) => {
      queryClient.setQueriesData<MessagePages>(
        { queryKey: ["messages", conversationId] },
        (old) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((m) => m.id !== messageId),
            })),
          } as MessagePages;
        },
      );
    },
    [queryClient],
  );

  return { addMessageToCache, updateMessageInCache, removeMessageFromCache };
}
