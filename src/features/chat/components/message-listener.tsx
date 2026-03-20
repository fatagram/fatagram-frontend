import { useMessageCacheMutations } from "@/features/hooks/use-message-store";
import { useMessageHub } from "../hubs/use-message-hub";
import { MessageResponseDto } from "@/api/message/dto/message.dto";

export function MessageListener() {
  const { addMessageToCache } = useMessageCacheMutations();

  useMessageHub((data: MessageResponseDto) => {
    console.log("Received new message via MessageHub with data:", data);
    const conversationId = data.conversationId;
    addMessageToCache(conversationId, data, true);
  });

  return null;
}

export default MessageListener;
