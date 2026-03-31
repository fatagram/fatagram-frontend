import { useMessageCacheMutations } from "@/features/hooks/use-message-store";
import { MessageResponseDto } from "@/api/message/dto/message.dto";
import { useChatStore } from "@/features/hooks/use-chat-store";
import { useAppHub } from "@/features/hub/use-app-hub";
import { SocketMessage } from "@/api/common/socket-message";
import { useConversationCacheMutations, useMessageStore } from "@/features/hooks/use-conversation";
import { SeenDto } from "@/api/conversation/dto/conversation.dto";
import { useAuth } from "@/contexts";
import { useLocation, useNavigate } from "react-router-dom";

export function MessageListener() {
  const { addMessageToCache } = useMessageCacheMutations();
  const { pushConversationToTop, updateConversationInCache } = useConversationCacheMutations();
  const { setParticipantsSeen } = useMessageStore();
  const { userId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useAppHub<MessageResponseDto>((message: SocketMessage<MessageResponseDto>) => {
    if (message.event !== "NewMessage") return;
    const data = message.payload;
    const conversationId = data.conversationId;

    if (data.correlationId && useChatStore.getState().registry[data.correlationId]) {
      useChatStore.getState().replaceChat(data.correlationId, conversationId);
    } else {
      const queryParams = new URLSearchParams(location.search);
      const currentTempId = queryParams.get("tempId");
      if (useChatStore.getState().registry["temp-" + data.senderId]) {
        useChatStore.getState().replaceChat("temp-" + data.senderId, conversationId);
      } else if (location.pathname === "/fatalk/temp" && currentTempId === data.senderId) {
        navigate(`/fatalk/${conversationId}`, { replace: true });
      }
      useChatStore
        .getState()
        .openChat(conversationId, { type: "conversation", conversationId: conversationId });
    }
    useMessageStore.getState().setLastMessage(conversationId, data.id);

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

    const data = message.payload;
    const conversationId = data.conversationId;
    const otherUserId = data.userId;

    setParticipantsSeen(conversationId, data.userId, {
      messageId: data.messageId,
      seenAt: data.seenAt,
    });

    if (otherUserId !== userId) {
      updateConversationInCache(conversationId, (conv) => ({
        ...conv,
        otherLastSeenMessageId: data.messageId,
      }));
    } else {
      updateConversationInCache(conversationId, (conv) => ({
        ...conv,
        myLastSeenMessageId: data.messageId,
      }));
    }
  });

  return null;
}

export default MessageListener;
