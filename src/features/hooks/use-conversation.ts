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

export const useGetConversationWith = (
  targetId: string,
  config?: SafeQueryResultOptions<any>,
  enabled: boolean = true,
) => {
  return useSafeQueryResult({
    queryKey: conversationKeys.withUser(targetId),
    fn: async () => await conversationService.getConversationWith(targetId),
    enabled: enabled,
    options: config,
  });
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
        console.log("Failed to create group conversation:", error);
        showSnackbar(error?.code ?? "Tạo cuộc trò chuyện nhóm thất bại", "error");
      },
    },
  );
};

export const useMarkConversationAsRead = () => {
  return useResultFetcher(
    async ({ conversationId, messageId }: { conversationId: string; messageId: string }) => {
      return await conversationService.markAsRead(conversationId, messageId);
    },
  );
};

export const useConversations = (queryParams?: Omit<CursorQuery<string>, "cursor">) => {
  const { userId } = useAuth();

  return useSafeInfiniteQueryResult({
    queryKey: conversationKeys.list(queryParams),
    fn: async (cursor?: string) =>
      await conversationService.getConversations({ ...queryParams, cursor }),
    enabled: !!userId,
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

  return { pushConversationToTop, updateConversationInCache };
};
