import { useMessageCacheMutations } from "@/features/hooks/use-message-store";
import { useMessageHub } from "../hubs/use-message-hub";
import { MessageResponseDto } from "@/api/message/dto/message.dto";
import { useChatStore } from "@/features/hooks/use-chat-store";

export function MessageListener() {
  const { addMessageToCache } = useMessageCacheMutations();

  useMessageHub((data: MessageResponseDto) => {
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
