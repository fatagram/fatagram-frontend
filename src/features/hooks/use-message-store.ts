import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { CursorResult } from "@/api/common/result";
import { Message } from "@/types/entities/message.type";

// Message query keys helper (kept in sync with useMessages)
export const messageKeys = {
  list: (conversationId: string, params?: unknown) => ["messages", conversationId, params] as const,
};

type MessagePages<TCursor = string> = {
  pages: Array<CursorResult<Message, TCursor>>;
  pageParams: unknown[];
};

export function useMessageCacheMutations() {
  const queryClient = useQueryClient();

  const addMessageToCache = useCallback(
    (conversationId: string, message: Message, isDescending: boolean = true) => {
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
            };
          }

          // Với DESC: pages[0] = newest, pages[n] = oldest
          // Với ASC: pages[0] = oldest, pages[n] = newest
          const targetPageIndex = isDescending ? 0 : old.pages.length - 1;
          const targetPage = old.pages[targetPageIndex];

          // Avoid duplicates
          for (const item of targetPage.items) {
            if (item.id === message.id) return old;
            if (item.clientTempId && item.clientTempId === message.clientTempId) {
              const newPages = {
                ...targetPage,
                items: targetPage.items.map((m) =>
                  m.clientTempId === message.clientTempId ? message : m,
                ),
              };
              return {
                ...old,
                pages: [newPages, ...old.pages.slice(1)],
              };
            }
          }

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
    (conversationId: string, messageId: string, updater: (old: Message) => Message) => {
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
