import { CursorResult } from "@/api/common/result";
import { MessageResponseDto } from "@/api/message/dto/message.dto";
import { conversationService } from "@/api/conversation/conversation.api";
import { useAuth } from "@/contexts/auth-context";
import {
  createSafeQueryOptions,
  SafeQueryResultOptions,
  useSafeInfiniteQueryResult,
  useSafeQueryResult,
} from "@/hooks/use-safe-query";
import { CursorQuery } from "@/types/query";
import { useQueryClient } from "@tanstack/react-query";
import { ConversationDto } from "@/api/conversation/dto/conversation.dto";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { useSnackbar } from "@/contexts";
import { create } from "zustand";

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

// export const useGetConversationWith = (
//   targetId: string,
//   config?: SafeQueryResultOptions<any>,
//   enabled: boolean = true,
// ) => {
//   return useSafeQueryResult({
//     queryKey: conversationKeys.withUser(targetId),
//     fn: async () => await conversationService.getConversationWith(targetId),
//     enabled: enabled,
//     options: config,
//   });
// };

export const useFetchConversationWith = () => {
  return useResultFetcher(
    async (targetId: string) => await conversationService.getConversationWith(targetId),
  );
};

export const useGetConversation = (
  conversationId: string,
  config?: SafeQueryResultOptions<any>,
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
    async ({ conversationId, messageId }: { conversationId: string; messageId: string }) =>
      await conversationService.markAsRead(conversationId, messageId),
  );
};

export const useLocalMarkAsRead = () => {
  const { markAsRead } = useConversationCacheMutations();
  return (conversationId: string, messageId: string) => {
    markAsRead(conversationId, messageId);
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
  });
};

export const useConversations = (queryParams?: Omit<CursorQuery<string>, "cursor">) => {
  const { userId } = useAuth();

  return useSafeInfiniteQueryResult({
    queryKey: conversationKeys.list(queryParams),
    fn: async (cursor?: string) =>
      await conversationService.getConversations({ ...queryParams, cursor }),
    enabled: !!userId,
    options: {
      onSuccess: (data) => {
        const conversations = data.items;
        if (conversations.length > 0) {
          const lastMessageIds: Record<string, string> = {};
          conversations.forEach((conv) => {
            if (conv.lastMessage) {
              lastMessageIds[conv.id] = conv.lastMessage.id;
            }
          });
          useMessageStore.getState().setBulkLastMessages(lastMessageIds);
        }
      },
    },
  });
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

  const markAsRead = async (conversationId: string, messageId: string) => {
    updateConversationInCache(conversationId, (conv) => ({
      ...conv,
      myLastSeenMessageId: messageId,
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

  return { pushConversationToTop, updateConversationInCache, markAsRead };
};

interface MessageState {
  lastMessageMap: Record<string, string>;
  messageUserSeenMap?: Record<string, Record<string, { userId: string; seenAt: string }[]>>;
  setLastMessage: (conversationId: string, messageId: string) => void;
  setBulkLastMessages: (data: Record<string, string>) => void;
  setParticipantsSeen: (
    conversationId: string,
    userId: string,
    participantSeen: { messageId: string; seenAt: string },
  ) => void;
  setBulkParticipantsSeen: (
    conversationId: string,
    data: Record<string, { messageId: string; seenAt: string }>,
  ) => void;
}

interface ViewerInfo {
  userId: string;
  seenAt: string;
}

export const useMessageStore = create<MessageState>((set) => ({
  lastMessageMap: {},
  messageUserSeenMap: {},
  setLastMessage: (conversationId, messageId) =>
    set((state) => ({
      lastMessageMap: {
        ...state.lastMessageMap,
        [conversationId]: messageId,
      },
    })),
  setBulkLastMessages: (data) =>
    set(() => ({
      lastMessageMap: data,
    })),
  setParticipantsSeen: (conversationId, userId, participantSeen) => {
    set((state) => {
      const rawConvMap = state.messageUserSeenMap?.[conversationId] || {};
      const currentConvMap = JSON.parse(JSON.stringify(rawConvMap));

      Object.keys(currentConvMap).forEach((mId) => {
        currentConvMap[mId] = currentConvMap[mId].filter((v: any) => v.userId !== userId);
        if (currentConvMap[mId].length === 0) {
          delete currentConvMap[mId];
        }
      });

      const newMsgId = participantSeen.messageId;
      if (!currentConvMap[newMsgId]) {
        currentConvMap[newMsgId] = [];
      }

      if (!currentConvMap[newMsgId].some((v: any) => v.userId === userId)) {
        currentConvMap[newMsgId].push({
          userId,
          seenAt: participantSeen.seenAt,
        });
      }

      return {
        messageUserSeenMap: {
          ...state.messageUserSeenMap,
          [conversationId]: currentConvMap,
        },
      };
    });
  },
  setBulkParticipantsSeen: (conversationId, data) => {
    set((state) => {
      const newConvMap: Record<string, ViewerInfo[]> = {};
      if (!data)
        return {
          messageUserSeenMap: { ...state.messageUserSeenMap, [conversationId]: {} },
        };
      Object.entries(data).forEach(([userId, seenInfo]) => {
        if (!newConvMap[seenInfo.messageId]) {
          newConvMap[seenInfo.messageId] = [];
        }
        newConvMap[seenInfo.messageId].push({
          userId,
          seenAt: seenInfo.seenAt,
        });
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
