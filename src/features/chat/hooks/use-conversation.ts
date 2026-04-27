import { conversationService } from "@/api/conversation/conversation.api";
import { useAuth } from "@/contexts/auth-context";
import {
  SafeQueryCallbacks,
  useSafeInfiniteQueryResult,
  useSafeQueryResult,
} from "@/hooks/use-safe-query";
import { CursorQuery } from "@/types/query";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { useSnackbar } from "@/contexts";
import { create } from "zustand";
import { convManager, useConversationStore } from "../services/conversation-manager";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const CONVERSATION_KEYS = {
  list: (queryParams?: Omit<CursorQuery<string>, "cursor">) =>
    ["conversations", queryParams] as const,
  detail: (conversationId: string) => ["conversation", conversationId] as const,
  withUser: (targetId: string) => ["conversation", "with", targetId] as const,
};

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
    queryKey: CONVERSATION_KEYS.detail(conversationId),
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
  return (conversationId: string, messageSeq: number) => {
    convManager.markAsSeen(conversationId, messageSeq);
  };
};

export const useGetPariticipantsSeen = (conversationId: string) => {
  return useSafeQueryResult({
    queryKey: ["conversation", conversationId, "participantsSeen"],
    fn: async () => await conversationService.getParticipantsSeen(conversationId),
    enabled: !!conversationId,
    options: {
      onSuccess: (data) => {
        useMessageStore
          .getState()
          .setBulkParticipantsSeen(conversationId, data.participantsSeenInfo);
      },
    },
    refetchOnMount: "always",
  });
};

export const useGetConversations = (queryParams?: Omit<CursorQuery<string>, "cursor">) => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const [isHydrated, setIsHydrated] = useState(false);
  const queryKey = useMemo(() => CONVERSATION_KEYS.list(queryParams), [queryParams]);

  useEffect(() => {
    const hydrateConversations = async () => {
      if (!userId || isHydrated) return;

      try {
        const localData = await convManager.getConversations();

        if (localData && localData.length > 0) {
          queryClient.setQueryData(queryKey, {
            pages: [{ items: localData, nextCursor: await convManager.getCursor() }],
            pageParams: [undefined],
          });
        }
      } finally {
        setIsHydrated(true);
      }
    };

    hydrateConversations();
  }, [queryKey, userId]);

  const infiniteQuery = useSafeInfiniteQueryResult({
    queryKey: CONVERSATION_KEYS.list(queryParams),
    fn: async (cursor?: string) => {
      return await conversationService.getConversations({
        ...queryParams,
        cursor,
      });
    },
    enabled: !!userId && isHydrated,
    staleTime: Infinity,
    options: {
      onSuccess: (data) => {
        convManager.appendConversations(data.items, !data.nextCursor);
      },
    },
  });

  return {
    ...infiniteQuery,
    isLoading: !isHydrated || infiniteQuery.isLoading,
  };
};

export const useGetDeltaConversations = () => {
  const fetcher = useResultFetcher(
    async (since: Date) => await conversationService.getDeltaConversations(since),
  );

  const fetcherDelta = async () => {
    const conversations = useConversationStore.getState().conversations;
    const lastConv = conversations[0];
    if (!lastConv) return;

    const since = lastConv?.lastActiveAt ? new Date(lastConv.lastActiveAt) : new Date(0);
    return await fetcher.fetch(since, {
      onSuccess: (data) => {
        if (!data || data?.length == 0) return;
        convManager.appendConversations(data, true);
      },
    });
  };

  return { fetcherDelta };
};

export const useGetTotalUnreadCount = () => {
  const { userId } = useAuth();
  return useSafeQueryResult({
    queryKey: ["conversation", "unread-count", userId],
    fn: async () => await conversationService.getUnreadCount(),
    options: {
      onSuccess: (data) => {
        convManager.setUnreadCount(data);
      },
    },
    refetchOnReconnect: true,
  });
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
