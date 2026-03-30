import { useMessageCacheMutations } from "@/features/hooks/use-message-store";
import { MessageResponseDto } from "@/api/message/dto/message.dto";
import { useChatStore } from "@/features/hooks/use-chat-store";
import { useAppHub } from "@/features/hub/use-app-hub";
import { SocketMessage } from "@/api/common/socket-message";
import { useConversationCacheMutations } from "@/features/hooks/use-conversation";
import { SeenDto } from "@/api/conversation/dto/conversation.dto";
import { useAuth } from "@/contexts";

export function MessageListener() {
  const { addMessageToCache } = useMessageCacheMutations();
  const { pushConversationToTop, updateConversationInCache } = useConversationCacheMutations();
  const { userId } = useAuth();

  useAppHub<MessageResponseDto>((message: SocketMessage<MessageResponseDto>) => {
    if (message.event !== "NewMessage") return;
    const data = message.payload;
    const conversationId = data.conversationId;

    console.log("Received new message via hub:", data);
    console.log("Conversation ID:", conversationId);

    if (data.correlationId && useChatStore.getState().registry[data.correlationId]) {
      useChatStore.getState().replaceChat(data.correlationId, conversationId);
    } else {
      useChatStore
        .getState()
        .openChat(conversationId, { type: "conversation", conversationId: conversationId });
    }

    addMessageToCache(conversationId, data, true);
    pushConversationToTop(conversationId, data);

    if (data.senderId === userId) {
      updateConversationInCache(conversationId, (conv) => ({
        ...conv,
        myLastSeenMessageId: data.id,
      }));
    }
  });

  useAppHub<SeenDto>((message: SocketMessage<SeenDto>) => {
    if (message.event !== "SeenMessage") return;

    console.log("Received seen message via hub:", message.payload);

    const data = message.payload;
    const conversationId = data.conversationId;
    const otherUserId = data.userId;

    if (otherUserId !== userId) {
      updateConversationInCache(conversationId, (conv) => ({
        ...conv,
        otherLastSeenMessageId: data.messageId,
      }));
    } else {
      console.log(
        "Updating my last seen message ID in conversation cache:",
        conversationId,
        data.messageId,
      );
      updateConversationInCache(conversationId, (conv) => ({
        ...conv,
        myLastSeenMessageId: data.messageId,
      }));
    }
  });

  return null;
}

export default MessageListener;
