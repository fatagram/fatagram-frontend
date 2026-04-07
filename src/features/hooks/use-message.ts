import { conversationService } from "@/api/conversation/conversation.api";
import { MessageDto } from "@/api/message/dto/message.dto";
import { messageService } from "@/api/message/message.api";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { useSafeInfiniteQueryResult } from "@/hooks/use-safe-query";
import { CursorQuery } from "@/types/query";
import { useMessageCacheMutations } from "./use-message-store";
import { useAuth } from "@/contexts";
import { MessageType } from "@/types/entities/message.type";

const messagesQueryKey = (
  conversationId: string,
  queryParams?: Omit<CursorQuery<number>, "cursor">,
) => ["messages", conversationId, queryParams] as const;

export const useMessages = (
  conversationId: string,
  queryParams?: Omit<CursorQuery<number>, "cursor">,
) => {
  return useSafeInfiniteQueryResult({
    queryKey: messagesQueryKey(conversationId, queryParams),
    fn: async (cursor?: number) => {
      return await conversationService.getMessages(conversationId, { ...queryParams, cursor });
    },
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  const { addMessageToCache } = useMessageCacheMutations();
  const { userId } = useAuth();
  return useResultFetcher(async (data: MessageDto) => {
    const randomId = crypto.randomUUID();
    addMessageToCache(
      data.conversationId!,
      {
        id: randomId,
        conversationId: data.conversationId!,
        clientTempId: randomId,
        senderId: userId!,
        content: data.content,
        createdAt: new Date(),
        status: "pending",
        isGroup: false,
        type: MessageType.Text,
      },
      true,
    );
    data.clientTempId = randomId;
    return await messageService.sendMessage(data);
  });
};
