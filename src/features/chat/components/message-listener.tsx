import { useMessageCacheMutations } from "@/features/hooks/use-message-store";
import { MessageResponseDto } from "@/api/message/dto/message.dto";
import { useChatStore } from "@/features/hooks/use-chat-store";
import { useAppHub } from "@/features/hub/use-app-hub";
import { SocketMessage } from "@/api/common/socket-message";
import { useConversationCacheMutations } from "@/features/hooks/use-conversation";

export function MessageListener() {
  const { addMessageToCache } = useMessageCacheMutations();
  const { pushConversationToTop } = useConversationCacheMutations();

  useAppHub<MessageResponseDto>((message: SocketMessage<MessageResponseDto>) => {
    if (message.event !== "NewMessage") return;
    const data = message.payload;
    const conversationId = data.conversationId;

    if (useChatStore.getState().registry[data.senderId]?.type === "temp") {
      useChatStore.getState().replaceChat(data.senderId, conversationId);
    }

    addMessageToCache(conversationId, data, true);
    pushConversationToTop(conversationId, data);
  });

  return null;
}

export default MessageListener;
