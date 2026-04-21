import { CursorResult } from "@/api/common/result";
import { MessageResponseDto } from "@/api/message/dto/message.dto";
import { conversationService } from "@/api/conversation/conversation.api";
import { useAuth } from "@/contexts/auth-context";
import {
  createSafeQueryOptions,
  SafeQueryCallbacks,
  useSafeInfiniteQueryResult,
  useSafeQueryResult,
} from "@/hooks/use-safe-query";
import { CursorQuery } from "@/types/query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ConversationDto } from "@/api/conversation/dto/conversation.dto";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { useSnackbar } from "@/contexts";
import { create } from "zustand";
import { useMemo } from "react";

const conversationKeys = {
  list: (queryParams?: Omit<CursorQuery<string>, "cursor">) =>
    ["conversations", queryParams] as const,
  detail: (conversationId: string) => ["conversation", conversationId] as const,
  withUser: (targetId: string) => ["conversation", "with", targetId] as const,
};

const conversationDetailQueryOptions = (conversationId: string) =>
  createSafeQueryOptions<ConversationDto>({
    queryKey: conversationKeys.detail(conversationId),
    fn: async () => await conversationService.getConversation(conversationId),
  });

export const useFetchConversationWith = () => {
  return useResultFetcher(
    async (targetId: string) => await conversationService.getConversationWith(targetId),
  );
};

export const useGetConversation = (
  conversationId: string,
  config?: SafeQueryCallbacks<any>,
  enabled?: boolean,
) => {
  return useSafeQueryResult({
    queryKey: conversationKeys.detail(conversationId),
    fn: async () => await conversationService.getConversation(conversationId),
    enabled: enabled ?? false,
    options: config,
  });
};

export const useCreateGroupConversation = () => {
  const { showSnackbar } = useSnackbar();
  return useResultFetcher(
    async ({ participantIds, name }: { participantIds: string[]; name?: string | null }) => {
      return await conversationService.createGroupConversation(participantIds, name);
    },
    {
      onError: (error) => {
        showSnackbar(error?.code ?? "Tạo cuộc trò chuyện nhóm thất bại", "error");
      },
    },
  );
};

export const useMarkConversationAsRead = () => {
  return useResultFetcher(
    async ({ conversationId, messageSeq }: { conversationId: string; messageSeq: number }) => {
      var r = await conversationService.markAsSeen(conversationId, messageSeq);
      return r;
    },
  );
};

export const useLocalMarkAsRead = () => {
  const { markAsRead } = useConversationCacheMutations();
  return (conversationId: string, messageSeq: number) => {
    markAsRead(conversationId, messageSeq);
  };
};

export const useGetPariticipantsSeen = (conversationId: string) => {
  return useSafeQueryResult({
    queryKey: ["conversation", conversationId, "participantsSeen"],
    fn: async () => await conversationService.getParticipantsSeen(conversationId),
    enabled: !!conversationId,
    options: {
      onSuccess: (data) => {
        console.log("Participants seen data: ", data);
        useMessageStore
          .getState()
          .setBulkParticipantsSeen(conversationId, data.participantsSeenInfo);
      },
    },
  });
};

export const useConversations = (queryParams?: Omit<CursorQuery<string>, "cursor">) => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const queryOptions = useMemo(
    () => ({
      onSuccess: (data: any) => {
        const conversations = data.items;
        if (conversations.length > 0) {
          const lastMessageSeqs: Record<string, number> = {};
          conversations.forEach((conv: ConversationDto) => {
            if (conv.lastMessage) {
              lastMessageSeqs[conv.id] = conv.lastMessage.sequenceNumber;
            }
            const key = ["conversation", "unread-count", conv.id];
            const serverCount = conv.unreadMessageCount ?? 0;
            queryClient.setQueryData(key, (oldCount: number | undefined) => {
              const currentCount = oldCount ?? 0;
              return Math.max(currentCount, serverCount);
            });
          });
          useMessageStore.getState().setBulkLastMessages(lastMessageSeqs);
        }
      },
    }),
    [queryClient],
  );

  return useSafeInfiniteQueryResult({
    queryKey: conversationKeys.list(queryParams),
    fn: async (cursor?: string) =>
      await conversationService.getConversations({ ...queryParams, cursor }),
    enabled: !!userId,
    staleTime: Infinity,
    options: queryOptions,
  });
};

export const useGetDeltaConversations = () => {
  const { data } = useConversations();
  const { mergeDeltaConversations } = useConversationCacheMutations();

  const fetcher = useResultFetcher(
    async (since: Date) => await conversationService.getDeltaConversations(since),
  );

  const fetcherDelta = async () => {
    const lastActiveAt = data?.pages[0]?.items[0]?.lastMessage?.createdAt;
    return await fetcher.fetch(lastActiveAt ?? new Date(0), {
      onSuccess: (data) => {
        mergeDeltaConversations(data ?? []);
      },
    });
  };

  return { fetcherDelta };
};

type ConversationPage<TCursor = string> = {
  pages: Array<CursorResult<any, TCursor>>;
  pageParams: unknown[];
};

export const useConversationCacheMutations = () => {
  const queryClient = useQueryClient();

  const updateDetailCache = (
    conversationId: string,
    updateFn: (conv: ConversationDto) => ConversationDto,
  ) => {
    const detailKey = conversationKeys.detail(conversationId);
    queryClient.setQueryData(detailKey, (oldDetail: ConversationDto | undefined) => {
      if (!oldDetail) return oldDetail;
      return updateFn(oldDetail);
    });
  };

  const updateConversationInCache = (
    conversationId: string,
    updateFn: (conv: ConversationDto) => ConversationDto,
  ) => {
    const listKey = conversationKeys.list();
    queryClient.setQueryData(listKey, (oldData: ConversationPage) => {
      if (!oldData || !oldData.pages.length) return oldData;

      const newPages = oldData.pages.map((page) => ({
        ...page,
        items: page.items.map((item) => (item.id === conversationId ? updateFn(item) : item)),
      }));

      return {
        ...oldData,
        pages: newPages,
      };
    });

    updateDetailCache(conversationId, updateFn);
  };

  const markAsRead = async (conversationId: string, messageSeq: number) => {
    updateConversationInCache(conversationId, (conv) => ({
      ...conv,
      myLastSeenMessageSeq: messageSeq,
      unreadMessageCount: 0,
    }));
  };

  const pushConversationToTop = async (
    conversationId: string,
    lastMessage?: MessageResponseDto,
  ) => {
    const listKey = conversationKeys.list();
    const currentData = queryClient.getQueryData<ConversationPage>(listKey);
    let existedConv: ConversationDto | null = null;

    if (currentData) {
      for (const page of currentData.pages) {
        const found = page.items.find((item) => item.id === conversationId);
        if (found) {
          existedConv = { ...found, lastMessage: lastMessage || found.lastMessage };
          break;
        }
      }
    }

    if (!existedConv) {
      const fetched = await queryClient.fetchQuery(conversationDetailQueryOptions(conversationId));
      if (!fetched) return;
      existedConv = { ...fetched, lastMessage: lastMessage || fetched.lastMessage };
    }

    // Keep the detail cache in sync too. `ChatWindow` reads from `conversationKeys.detail`.
    queryClient.setQueryData(conversationKeys.detail(conversationId), existedConv);

    queryClient.setQueryData(listKey, (oldData: ConversationPage) => {
      if (!oldData || !oldData.pages.length) return oldData;

      const newPages = oldData.pages.map((page) => ({
        ...page,
        items: page.items.filter((item) => item.id !== conversationId),
      }));

      newPages[0] = {
        ...newPages[0],
        items: [existedConv!, ...newPages[0].items],
      };

      return {
        ...oldData,
        pages: newPages,
      };
    });
  };

  const mergeDeltaConversations = (deltaConvs: ConversationDto[]) => {
    const listKey = conversationKeys.list();

    queryClient.setQueryData(listKey, (oldData: ConversationPage | undefined) => {
      if (!oldData || deltaConvs.length === 0) return oldData;

      const deltaMap = new Map(deltaConvs.map((c) => [c.id, c]));
      const mergedItemsMap = new Map();

      let newPages = oldData.pages.map((page) => {
        const remainingItems = page.items.filter((item) => {
          if (deltaMap.has(item.id)) {
            mergedItemsMap.set(item.id, { ...item, ...deltaMap.get(item.id) });
            return false;
          }
          return true;
        });
        return { ...page, items: remainingItems };
      });

      const topItems = deltaConvs.map((delta) =>
        mergedItemsMap.has(delta.id) ? mergedItemsMap.get(delta.id) : delta,
      );

      if (newPages.length > 0) {
        const orderedTopItems = [...topItems].reverse();

        newPages[0] = {
          ...newPages[0],
          items: [...orderedTopItems, ...newPages[0].items],
        };
      }

      return { ...oldData, pages: newPages };
    });
  };

  return { mergeDeltaConversations, pushConversationToTop, updateConversationInCache, markAsRead };
};

export const useGetUnreadMessageCount = () => {
  const { userId } = useAuth();
  return useSafeQueryResult({
    queryKey: ["conversation", "unread-count", userId],
    fn: async () => await conversationService.getUnreadCount(),
  });
};

type UpdateCountFn = (prev: number) => number;

export const useUnreadMessageCountCacheMutations = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const setUnreadCount = (update: UpdateCountFn) => {
    const key = ["conversation", "unread-count", userId];

    queryClient.setQueryData<number>(key, (oldCount) => {
      const currentCount = oldCount ?? 0;
      const newCount = update(currentCount);
      return Math.max(0, newCount);
    });
  };

  const setUnreadCountForConversation = (conversationId: string, update: UpdateCountFn) => {
    const key = ["conversation", "unread-count", conversationId];

    queryClient.setQueryData<number>(key, (oldCount) => {
      const currentCount = oldCount ?? 0;
      const newCount = update(currentCount);
      return Math.max(0, newCount);
    });
  };

  const getUnreadCountForConversation = (conversationId: string) => {
    const key = ["conversation", "unread-count", conversationId];
    return queryClient.getQueryData<number>(key) ?? 0;
  };

  return { setUnreadCount, setUnreadCountForConversation, getUnreadCountForConversation };
};

export const useUnreadMessageCountCache = (conversationId: string) => {
  const { data: unreadCount } = useQuery({
    queryKey: ["conversation", "unread-count", conversationId],
    queryFn: () => {
      return 0;
    },
    enabled: !!conversationId,
    staleTime: Infinity,
    initialData: 0,
  });
  return unreadCount ?? 0;
};

interface MessageState {
  lastMessageMap: Record<string, number>;
  messageUserSeenMap?: Record<string, Record<number, { userId: string; seenAt: string }[]>>;
  setLastMessage: (conversationId: string, messageSeq: number) => void;
  setBulkLastMessages: (data: Record<string, number>) => void;
  setParticipantsSeen: (
    conversationId: string,
    userId: string,
    participantSeen: { sequenceNumber: number; seenAt: string },
  ) => void;
  setBulkParticipantsSeen: (
    conversationId: string,
    data: Record<string, { sequenceNumber: number; seenAt: string }>,
  ) => void;
}

interface ViewerInfo {
  userId: string;
  seenAt: string;
}

export const useMessageStore = create<MessageState>((set) => ({
  lastMessageMap: {},
  messageUserSeenMap: {},
  setLastMessage: (conversationId, messageSeq) =>
    set((state) => ({
      lastMessageMap: {
        ...state.lastMessageMap,
        [conversationId]: messageSeq,
      },
    })),
  setBulkLastMessages: (data) =>
    set((state) => ({
      lastMessageMap: {
        ...state.lastMessageMap,
        ...Object.entries(data).reduce(
          (acc, [convId, newSeq]) => {
            const currentSeq = state.lastMessageMap[convId];
            acc[convId] = currentSeq !== undefined ? Math.max(currentSeq, newSeq) : newSeq;
            return acc;
          },
          {} as Record<string, number>,
        ),
      },
    })),
  setParticipantsSeen: (conversationId, userId, participantSeen) => {
    set((state) => {
      const rawConvMap = state.messageUserSeenMap?.[conversationId] || {};
      const newMsgSeq = participantSeen.sequenceNumber;

      let previousSeq: number | undefined;
      for (const [messageSeq, viewers] of Object.entries(rawConvMap)) {
        if (viewers.some((viewer) => viewer.userId === userId)) {
          previousSeq = Number(messageSeq);
          break;
        }
      }

      if (previousSeq === newMsgSeq) {
        const existingAtNew = rawConvMap[newMsgSeq] || [];
        const existingViewer = existingAtNew.find((viewer) => viewer.userId === userId);
        if (existingViewer?.seenAt === participantSeen.seenAt) {
          return state;
        }
      }

      const nextConvMap: Record<number, ViewerInfo[]> = { ...rawConvMap };

      if (previousSeq !== undefined) {
        const reducedPrev = (rawConvMap[previousSeq] || []).filter(
          (viewer) => viewer.userId !== userId,
        );
        if (reducedPrev.length > 0) {
          nextConvMap[previousSeq] = reducedPrev;
        } else {
          delete nextConvMap[previousSeq];
        }
      }

      const currentAtNew = nextConvMap[newMsgSeq] ? [...nextConvMap[newMsgSeq]] : [];
      const existingIndex = currentAtNew.findIndex((viewer) => viewer.userId === userId);
      if (existingIndex >= 0) {
        currentAtNew[existingIndex] = { userId, seenAt: participantSeen.seenAt };
      } else {
        currentAtNew.push({ userId, seenAt: participantSeen.seenAt });
      }
      nextConvMap[newMsgSeq] = currentAtNew;

      return {
        messageUserSeenMap: {
          ...state.messageUserSeenMap,
          [conversationId]: nextConvMap,
        },
      };
    });
  },
  setBulkParticipantsSeen: (conversationId, data) => {
    set((state) => {
      if (!data) return state;

      const currentConvMap = state.messageUserSeenMap?.[conversationId] || {};

      const toTime = (value: string) => {
        const t = new Date(value).getTime();
        return Number.isFinite(t) ? t : 0;
      };

      const mergedByUser: Record<string, { sequenceNumber: number; seenAt: string }> = {};

      Object.entries(currentConvMap).forEach(([messageSeq, viewers]) => {
        viewers.forEach((viewer) => {
          const existing = mergedByUser[viewer.userId];
          if (!existing || toTime(viewer.seenAt) > toTime(existing.seenAt)) {
            mergedByUser[viewer.userId] = {
              sequenceNumber: Number(messageSeq),
              seenAt: viewer.seenAt,
            };
          }
        });
      });

      Object.entries(data).forEach(([userId, seenInfo]) => {
        const existing = mergedByUser[userId];
        if (!existing || toTime(seenInfo.seenAt) > toTime(existing.seenAt)) {
          mergedByUser[userId] = {
            sequenceNumber: Number(seenInfo.sequenceNumber),
            seenAt: seenInfo.seenAt,
          };
        }
      });

      const newConvMap: Record<number, ViewerInfo[]> = {};
      Object.entries(mergedByUser).forEach(([userId, seenInfo]) => {
        if (!newConvMap[seenInfo.sequenceNumber]) newConvMap[seenInfo.sequenceNumber] = [];
        newConvMap[seenInfo.sequenceNumber].push({ userId, seenAt: seenInfo.seenAt });
      });

      return {
        messageUserSeenMap: {
          ...state.messageUserSeenMap,
          [conversationId]: newConvMap,
        },
      };
    });
  },
}));

export const useMediaAroundAnchor = (conversationId: string, mediaId: string) => {
  return useSafeQueryResult({
    queryKey: ["conversation", conversationId, "media-around-anchor", mediaId],
    fn: async () => await conversationService.getMediaAroundAnchor(conversationId, mediaId, 10),
    enabled: !!conversationId && !!mediaId,
    staleTime: 0,
    gcTime: 0,
  });
};

export const useMediaAround = () => {
  return useResultFetcher(
    async (data: {
      conversationId: string;
      mediaId: string;
      config: { limit?: number; before?: boolean };
    }) => await conversationService.getMediaAround(data.conversationId, data.mediaId, data.config),
  );
};
