import { useMessageCacheMutations } from "@/features/hooks/use-message-store";
import { MessageResponseDto } from "@/api/message/dto/message.dto";
import { useChatStore } from "@/features/hooks/use-chat-store";
import { useAppHub } from "@/features/hub/use-app-hub";
import { SocketMessage } from "@/api/common/socket-message";

export function MessageListener() {
  const { addMessageToCache } = useMessageCacheMutations();

  useAppHub<MessageResponseDto>((message: SocketMessage<MessageResponseDto>) => {
    if (message.event !== "NewMessage") return;
    const data = message.payload;
    console.log("Received new message via MessageHub with data:", data);
    const conversationId = data.conversationId;
    addMessageToCache(conversationId, data, true);
    console.log("Current chat registry:", useChatStore.getState().registry[data.senderId]);
    if (useChatStore.getState().registry[data.senderId]?.type === "temp") {
      useChatStore.getState().replaceChat(data.senderId, conversationId);
    }
  });

  return null;
}

export default MessageListener;
