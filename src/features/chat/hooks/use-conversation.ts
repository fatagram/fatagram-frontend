
import { conversationService } from "@/api/conversation/conversation.api";
import {
  SafeQueryCallbacks,
  useSafeInfiniteQueryResult,
  useSafeQueryResult,
} from "@/hooks/use-safe-query";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { useAuth } from "@/contexts";
import { convManager, useConversationStore } from "../services/conversation-manager";
import { useSnackbar } from "@/contexts/snackbar-context";
import { create } from "zustand";
import { CursorQuery } from "@/types/query";

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
    staleTime: Infinity, // Data is managed via Zustand store; no auto-refetch needed
    options: {
      onSuccess: (data) => {
        // Only hydrate store if the conversation is not already in memory
        const existing = convManager.getConversation(data.id);
        if (!existing) {
          convManager.updateConversation(data.id, {
            avatarUrl: data.avatarUrl,
            name: data.name,
            theme: data.theme,
            backgroundUrl: data.backgroundUrl,
            isPinned: data.isPinned,
            pinnedAt: data.pinnedAt,
          });
        }
        config?.onSuccess?.(data);
      },
    },
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
  const markAsRead = (conversationId: string, messageSeq: number) => {
    convManager.markAsSeen(conversationId, messageSeq);
  };
  return markAsRead;
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

export const useGetTotalUnreadCount = () => {
  const { userId } = useAuth();
  return useSafeQueryResult({
    queryKey: ["conversation", "totalUnreadCount"],
    fn: async () => await conversationService.getUnreadCount(),
    enabled: !!userId,
    options: {
      onSuccess: (data) => {
        useConversationStore.getState().setTotalUnreadCount(data);
      },
    },
  });
};

export const useGetConversations = (queryParams?: Omit<CursorQuery<string>, "cursor">) => {
  const { userId } = useAuth();

  const infiniteQuery = useSafeInfiniteQueryResult({
    queryKey: CONVERSATION_KEYS.list(queryParams),
    fn: async (cursor?: string) => {
      return await conversationService.getConversations({
        ...queryParams,
        cursor,
      });
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    options: {
      onSuccess: (data) => {
        convManager.appendConversations(data.items, !data.nextCursor);
      },
    },
  });

  return infiniteQuery;
};

export const useSearchConversations = (queryParams: CursorQuery<string>) => {
  const infiniteQuery = useSafeInfiniteQueryResult({
    queryKey: ["conversations", "search", queryParams.keyword, queryParams.limit],
    fn: async (cursor?: string) => {
      return await conversationService.searchConversations({
        ...queryParams,
        cursor,
      });
    },
    enabled: !!queryParams.keyword,
    staleTime: 1000 * 60 * 5,
  });

  return infiniteQuery;
};

export const useGetDeltaConversations = () => {
  const fetcher = useResultFetcher(
    async (since: Date) => await conversationService.getDeltaConversations(since),
  );
  return fetcher;
};

export const useGetMessages = (
  conversationId: string,
  queryParams?: Omit<CursorQuery<number>, "cursor">,
) => {
  return useSafeInfiniteQueryResult({
    queryKey: ["conversation", conversationId, "messages", queryParams?.limit],
    fn: async (cursor?: number) => {
      return await conversationService.getMessages(conversationId, {
        ...queryParams,
        cursor,
      });
    },
    enabled: !!conversationId,
    staleTime: 0,
    gcTime: 0,
  });
};

export const useGetDeltaMessages = (conversationId: string) => {
  return useSafeQueryResult({
    queryKey: ["conversation", conversationId, "messages", "delta"],
    fn: async () => await conversationService.getDeltaMessages(conversationId, 0),
    enabled: !!conversationId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateConversationAvatar = (conversationId: string) => {
  return useResultFetcher(
    async (params: File | { file: File }) => {
      const file = params instanceof File ? params : params.file;
      return await conversationService.updateConversationAvatar(conversationId, file);
    },
    {
      onSuccess: () => {
        // Will be updated via local URL or SignalR event
      },
    },
  );
};

export const useUpdateConversationName = (conversationId: string) => {
  return useResultFetcher(
    async (params: string | { name: string }) => {
      const name = typeof params === "string" ? params : params.name;
      const res = await conversationService.updateConversationName(conversationId, name);
      if (res.success && conversationId && name) {
        convManager.updateConversation(conversationId, { name });
      }
      return res;
    },
  );
};

export const useUpdateConversationTheme = (conversationId: string) => {
  return useResultFetcher(
    async (params: { theme: string | null } | string | null) => {
      const theme =
        params !== null && typeof params === "object" && "theme" in params
          ? params.theme
          : (params as string | null);
      const res = await conversationService.updateConversationTheme(conversationId, theme);
      if (res.success && conversationId) {
        convManager.updateConversation(conversationId, { theme });
      }
      return res;
    },
  );
};

export const useUpdateConversationBackground = (conversationId: string) => {
  return useResultFetcher(
    async (params: { backgroundUrl: string | null } | string | null) => {
      const backgroundUrl =
        params !== null && typeof params === "object" && "backgroundUrl" in params
          ? params.backgroundUrl
          : (params as string | null);
      const res = await conversationService.updateConversationBackground(
        conversationId,
        backgroundUrl,
      );
      if (res.success && conversationId) {
        convManager.updateConversation(conversationId, { backgroundUrl });
      }
      return res;
    },
  );
};

export const useTogglePinConversation = (conversationId?: string) => {
  return useResultFetcher(
    async (targetConversationId?: string) => {
      const id =
        (typeof targetConversationId === "string" ? targetConversationId : null) || conversationId;
      if (!id) throw new Error("Conversation ID is required to toggle pin");
      const res = await conversationService.togglePin(id);
      if (res.success && typeof res.data === "boolean") {
        return {
          ...res,
          data: { isPinned: res.data, targetId: id },
        };
      }
      return {
        ...res,
        data: { isPinned: false, targetId: id },
      };
    },
    {
      onSuccess: (data) => {
        const id = data?.targetId || conversationId;
        const isPinned = data?.isPinned;
        if (id && typeof isPinned === "boolean") {
          convManager.togglePin(id, isPinned);
        }
      },
    },
  );
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
    participantsSeenInfo: Record<string, { sequenceNumber: number; seenAt: string }>,
  ) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  lastMessageMap: {},
  messageUserSeenMap: {},
  setLastMessage: (conversationId, messageSeq) => {
    set((state) => {
      return {
        lastMessageMap: {
          ...state.lastMessageMap,
          [conversationId]: messageSeq,
        },
      };
    });
  },
  setBulkLastMessages: (data) => {
    set((state) => {
      return {
        lastMessageMap: {
          ...state.lastMessageMap,
          ...data,
        },
      };
    });
  },
  setParticipantsSeen: (conversationId, userId, participantSeen) => {
    set((state) => {
      const convMap = state.messageUserSeenMap?.[conversationId] || {};
      const sequenceNumber = participantSeen.sequenceNumber;
      const seenAt = participantSeen.seenAt;

      const newConvMap = { ...convMap };

      for (const [seq, list] of Object.entries(newConvMap)) {
        const filteredList = list.filter((p) => p.userId !== userId);
        if (filteredList.length === 0) {
          delete newConvMap[Number(seq)];
        } else {
          newConvMap[Number(seq)] = filteredList;
        }
      }

      if (!newConvMap[sequenceNumber]) {
        newConvMap[sequenceNumber] = [];
      }

      newConvMap[sequenceNumber] = [...newConvMap[sequenceNumber], { userId, seenAt }];

      return {
        messageUserSeenMap: {
          ...state.messageUserSeenMap,
          [conversationId]: newConvMap,
        },
      };
    });
  },
  setBulkParticipantsSeen: (conversationId, participantsSeenInfo) => {
    set((state) => {
      const newConvMap: Record<number, { userId: string; seenAt: string }[]> = {};

      Object.entries(participantsSeenInfo).forEach(([userId, seenInfo]) => {
        const sequenceNumber = seenInfo.sequenceNumber;
        const seenAt = seenInfo.seenAt;

        if (!newConvMap[sequenceNumber]) {
          newConvMap[sequenceNumber] = [];
        }

        newConvMap[sequenceNumber].push({ userId, seenAt });
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
export const useGetParticipants = (conversationId: string, queryParams?: { limit?: number }) => {
  return useSafeInfiniteQueryResult({
    queryKey: ["conversation", conversationId, "participants"],
    fn: async (cursor?: string) => {
      return await conversationService.getParticipants(conversationId, {
        ...queryParams,
        cursor,
      });
    },
    enabled: !!conversationId,
  });
};
