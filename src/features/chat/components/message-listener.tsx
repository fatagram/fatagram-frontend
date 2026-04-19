import { useMessageCacheMutations } from "@/features/hooks/use-message-store";
import { MessageResponseDto } from "@/api/message/dto/message.dto";
import { useChatStore } from "@/features/hooks/use-chat-store";
import { SocketMessage } from "@/api/common/socket-message";
import {
  useConversationCacheMutations,
  useLocalMarkAsRead,
  useMarkConversationAsRead,
  useMessageStore,
  useUnreadMessageCountCacheMutations,
} from "@/features/hooks/use-conversation";
import { SeenDto } from "@/api/conversation/dto/conversation.dto";
import { useAuth } from "@/contexts";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useRef } from "react";

export type MessageHubEvent = SocketMessage<MessageResponseDto | SeenDto>;

export function useMessageListenerHandler() {
  const { addMessageToCache } = useMessageCacheMutations();
  const { pushConversationToTop, updateConversationInCache } = useConversationCacheMutations();
  const { setUnreadCount, setUnreadCountForConversation } = useUnreadMessageCountCacheMutations();
  const { setParticipantsSeen } = useMessageStore();
  const { userId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { fetch: markAsRead } = useMarkConversationAsRead();
  const markAsReadLocal = useLocalMarkAsRead();
  const autoReadMessageKeysRef = useRef<Set<string>>(new Set());

  const createAutoReadKey = (conversationId: string, messageSeq: number) =>
    `${conversationId}:${messageSeq}`;

  const handleNewMessage = useCallback(
    async (message: SocketMessage<MessageResponseDto>) => {
      const data = message.payload;
      const conversationId = data.conversationId;
      const isOwnMessage = data.senderId === userId;

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
      useMessageStore.getState().setLastMessage(conversationId, data.sequenceNumber);

      addMessageToCache(conversationId, data, true);
      pushConversationToTop(conversationId, data);

      if (data.senderId === userId) {
        updateConversationInCache(conversationId, (conv) => ({
          ...conv,
          myLastSeenMessageSeq: data.sequenceNumber,
        }));

        markAsReadLocal(conversationId, data.sequenceNumber);
        try {
          await markAsRead({
            conversationId,
            messageSeq: data.sequenceNumber,
          });
        } catch {
          // ignore mark-as-read errors for own messages
        }
      }

      const { focusOnId: currentFocusId, activeIds, minimizedIds } = useChatStore.getState();
      const isActiveChat = activeIds.includes(conversationId);
      const isMinimizedChat = minimizedIds.includes(conversationId);
      const isDisplayedChat = isActiveChat && !isMinimizedChat;
      const isDocumentFocused = document.hasFocus();

      // Set unreadcount
      if (currentFocusId !== conversationId || !isDisplayedChat || !isDocumentFocused) {
        if (!isOwnMessage) {
          if (data.shouldIncreaseUnreadCount) {
            setUnreadCount((prev) => prev + 1);
          }
          setUnreadCountForConversation(conversationId, (prev) => prev + 1);
        }
      } else if (!isOwnMessage && isDisplayedChat && isDocumentFocused) {
        const autoReadKey = createAutoReadKey(conversationId, data.sequenceNumber);
        autoReadMessageKeysRef.current.add(autoReadKey);
        markAsReadLocal(conversationId, data.sequenceNumber);
        try {
          await markAsRead({
            conversationId: conversationId,
            messageSeq: data.sequenceNumber,
          });
        } catch {
          autoReadMessageKeysRef.current.delete(autoReadKey);
        }
      }
    },
    [
      addMessageToCache,
      location.pathname,
      location.search,
      markAsRead,
      markAsReadLocal,
      navigate,
      pushConversationToTop,
      setUnreadCount,
      setUnreadCountForConversation,
      updateConversationInCache,
      userId,
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
        updateConversationInCache(conversationId, (conv) => ({
          ...conv,
          otherLastSeenMessageSeq: data.messageSeq,
        }));
      } else {
        updateConversationInCache(conversationId, (conv) => ({
          ...conv,
          myLastSeenMessageSeq: data.messageSeq,
        }));
        const autoReadKey = createAutoReadKey(conversationId, data.messageSeq);
        const isAutoReadAck = autoReadMessageKeysRef.current.has(autoReadKey);

        if (isAutoReadAck) {
          autoReadMessageKeysRef.current.delete(autoReadKey);
        }

        if (data.shouldDecreaseUnreadCount && !isAutoReadAck) {
          setUnreadCount((prev) => prev - 1);
        }
        setUnreadCountForConversation(conversationId, (_prev) => 0);
      }
    },
    [
      setParticipantsSeen,
      setUnreadCount,
      setUnreadCountForConversation,
      updateConversationInCache,
      userId,
    ],
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
        default:
          break;
      }
    },
    [handleNewMessage, handleSeenMessage],
  );
}

export default useMessageListenerHandler;
