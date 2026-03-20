import { conversationService } from "@/api/conversation/conversation.api";
import { MessageDto } from "@/api/message/dto/message.dto";
import { messageService } from "@/api/message/message.api";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { useSafeInfiniteQueryResult } from "@/hooks/use-safe-query";
import { CursorQuery } from "@/types/query";

const messagesQueryKey = (
  conversationId: string,
  queryParams?: Omit<CursorQuery<string>, "cursor">,
) => ["messages", conversationId, queryParams] as const;

export const useMessages = (
  conversationId: string,
  queryParams?: Omit<CursorQuery<string>, "cursor">,
) => {
  return useSafeInfiniteQueryResult({
    queryKey: messagesQueryKey(conversationId, queryParams),
    fn: async (cursor?: string) => {
      return await conversationService.getMessages(conversationId, { ...queryParams, cursor });
    },
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  return useResultFetcher((data: MessageDto) =>
    messageService.sendMessage({
      conversationId: data.conversationId,
      content: data.content,
      receiverId: data.receiverId,
    }),
  );
};
