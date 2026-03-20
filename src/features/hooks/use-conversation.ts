import { conversationService } from "@/api/conversation/conversation.api";
import { SafeQueryResultOptions, useSafeQueryResult } from "@/hooks/use-safe-query";

const conversationQueryKey = (targetId: string) => ["conversation", "with", targetId];

export const useGetConversationWith = (targetId: string, config?: SafeQueryResultOptions<any>) => {
  return useSafeQueryResult({
    queryKey: conversationQueryKey(targetId),
    fn: async () => await conversationService.getConversationWith(targetId),
    enabled: false,
    options: config,
  });
};

export const useGetConversation = (conversationId: string) => {
  return useSafeQueryResult({
    queryKey: ["conversation", conversationId],
    fn: async () => {
      const res = await conversationService.getConversation(conversationId);
      console.log("Fetched conversation data:", res);
      return res;
    },
    enabled: !!conversationId,
  });
};
