import { conversationService } from "@/api/conversation/conversation.api";
import { MessageDto } from "@/api/message/dto/message.dto";
import { messageService } from "@/api/message/message.api";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { useSafeInfiniteQueryResult } from "@/hooks/use-safe-query";
import { CursorQuery } from "@/types/query";

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
  return useResultFetcher(async (data: MessageDto) => {
    return await messageService.sendMessage(data);
  });
};
