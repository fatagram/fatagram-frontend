import { conversationService } from "@/api/conversation/conversation.api";
import { MessageMediaDto } from "@/api/message/dto/message.dto";
import { useSafeInfiniteQueryResult } from "@/hooks/use-safe-query";
import { MediaType } from "@/types/entities/message.type";
import { useMemo } from "react";

export const conversationMediaKeys = {
  list: (conversationId: string, types?: MediaType[]) =>
    ["conversation-media", conversationId, types] as const,
};

export const useConversationMedia = (
  conversationId: string,
  options?: {
    types?: MediaType[];
    limit?: number;
  },
) => {
  const { types, limit = 30 } = options || {};

  const query = useSafeInfiniteQueryResult<MessageMediaDto, number>({
    queryKey: conversationMediaKeys.list(conversationId, types),
    fn: async (cursor?: number) => {
      return await conversationService.getConversationMedia(conversationId, {
        types,
        cursor,
        limit,
      });
    },
    enabled: !!conversationId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const mediaList = useMemo(() => {
    if (!query.data?.pages) return [];
    return query.data.pages.flatMap((page) => page.items || []);
  }, [query.data?.pages]);

  return {
    ...query,
    mediaList,
  };
};
