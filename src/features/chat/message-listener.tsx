import { MessageResponseDto } from "@/api/message/dto/message.dto";
import { SocketMessage } from "@/api/common/socket-message";
import {
  useLocalMarkAsRead,
  useMarkConversationAsRead,
  useMessageStore,
} from "@/features/chat/hooks/use-conversation";
import { SeenDto, TypingDto } from "@/api/conversation/dto/conversation.dto";
import { useAuth } from "@/contexts";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useChatStore } from "./hooks/use-floating-chat";
import { convManager } from "./services/conversation-manager";
import { useMessageCacheMutations } from "./hooks/use-message";
import { useTypingStore } from "./hooks/use-typing-store";
// import { messageManager } from "./services/message-manager";

export type MessageHubEvent = SocketMessage<MessageResponseDto | SeenDto | TypingDto>;

export function useMessageListenerHandler() {
  const { setParticipantsSeen } = useMessageStore();
  const { addMessageToCache } = useMessageCacheMutations();
  const { userId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { fetch: markAsRead } = useMarkConversationAsRead();
  const markAsReadLocal = useLocalMarkAsRead();
  const { addTypingUser, removeTypingUser, recordMessage } = useTypingStore();

  const handleNewMessage = useCallback(
    async (message: SocketMessage<MessageResponseDto>) => {
      const data = message.payload;
      const conversationId = data.conversationId;

      // If the message has a correlationId (temp conversation), replace the temp conversation with the real one
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

      // Set lastmessage for conversation
      // messageManager.setMessages([data]);
      addMessageToCache(conversationId, data);
      convManager.addNewMessage(conversationId, userId!, data, data.shouldIncreaseUnreadCount);

      if (data.senderId && data.senderId !== userId) {
        recordMessage(conversationId, data.senderId);
        removeTypingUser(conversationId, data.senderId);
      }

      const isFocusingThisConversation =
        document.hasFocus() && useChatStore.getState().focusOnId === conversationId;

      if (isFocusingThisConversation) {
        const messageSeq = data.sequenceNumber;
        markAsReadLocal(conversationId, messageSeq);
        await markAsRead({ conversationId, messageSeq });
      }
    },
    [
      location.pathname,
      location.search,
      markAsRead,
      markAsReadLocal,
      navigate,
      userId,
      removeTypingUser,
      recordMessage,
    ],
  );

  const handleSeenMessage = useCallback(
    (message: SocketMessage<SeenDto>) => {
      const data = message.payload;
      const conversationId = data.conversationId;
      const otherUserId = data.userId;

      setParticipantsSeen(conversationId, data.userId, {
        sequenceNumber: data.messageSeq,
        seenAt: data.seenAt,
      });

      if (otherUserId !== userId) {
        convManager.updateConversation(conversationId, {
          otherLastSeenMessageSeq: data.messageSeq,
        });
      } else {
        convManager.updateConversation(conversationId, {
          myLastSeenMessageSeq: data.messageSeq,
          unreadMessageCount: 0,
        });
      }

      if (data.shouldDecreaseUnreadCount) {
        convManager.updateUnreadCount("decrement");
      }
    },
    [setParticipantsSeen, userId],
  );

  const handleTypingEvent = useCallback(
    (message: SocketMessage<TypingDto>) => {
      const { userId: incomingUserId, conversationId } = message.payload;

      // Không xử lý nếu là chính mình (ignore self)
      if (incomingUserId === userId) return;

      if (message.event === "UserIsTyping") {
        addTypingUser(conversationId, incomingUserId);
      } else {
        removeTypingUser(conversationId, incomingUserId);
      }
    },
    [userId, addTypingUser, removeTypingUser],
  );

  return useCallback(
    async (message: MessageHubEvent) => {
      switch (message.event) {
        case "NewMessage":
          await handleNewMessage(message as SocketMessage<MessageResponseDto>);
          break;
        case "SeenMessage":
          handleSeenMessage(message as SocketMessage<SeenDto>);
          break;
        case "UserIsTyping":
        case "UserStoppedTyping":
          handleTypingEvent(message as SocketMessage<TypingDto>);
          break;
        default:
          break;
      }
    },
    [handleNewMessage, handleSeenMessage, handleTypingEvent],
  );
}

export default useMessageListenerHandler;
