import { Text, Avatar, MiniButton, Skeleton } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import { MessageList } from "./message";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  useGetConversation,
  useLocalMarkAsRead,
  useMarkConversationAsRead,
  useMessageStore,
} from "@/features/chat/hooks/use-conversation";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { ChatInput } from "./chat-input";
import { useTranslation } from "react-i18next";
import { useChatStore } from "../hooks/use-floating-chat";

interface ChatWindowProps extends ComponentProps {
  conversationId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ className, conversationId }) => {
  const [chatTitle, setChatTitle] = useState("");
  const [chatAvatar, setChatAvatar] = useState("");

  const { toggleMinimize, closeChat, registry } = useChatStore(
    useShallow((state) => ({
      toggleMinimize: state.toggleMinimize,
      closeChat: state.closeChat,
      registry: state.registry,
    })),
  );
  const { renderConversationName } = useRenderConversationContent();
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const { fetch: markAsRead } = useMarkConversationAsRead();
  const markAsReadLocal = useLocalMarkAsRead();
  const lastMessageSeq = useMessageStore((state) => state.lastMessageMap[conversationId]);

  const setFocusOn = useChatStore((state) => state.setFocusOn);

  const chat = registry[conversationId];
  const tempTargetId = chat?.type === "temp" ? chat.targetId : undefined;
  const {
    data: tempUser,
    isLoading: isLoadingTempUser,
    isFetching: isFetchingTempUser,
  } = useGetUserProfile(tempTargetId);

  const {
    data: conversationData,
    isLoading: isLoadingConversation,
    isFetching: isFetchingConversation,
  } = useGetConversation(conversationId, undefined, !tempTargetId);

  const isLoadingHeader =
    isLoadingConversation || isFetchingConversation || isLoadingTempUser || isFetchingTempUser;

  const handleMarkAsReadOnFocus = useCallback(async () => {
    if (!conversationData?.id || !document.hasFocus()) return;

    setFocusOn(conversationData.id);

    const lastMsgSeq = lastMessageSeq || conversationData?.lastMessageNumber;
    const myLastSeenSeq = conversationData.myLastSeenMessageSeq || 0;

    if (!lastMsgSeq) return;
    if (lastMsgSeq <= myLastSeenSeq) return;

    markAsReadLocal(conversationData.id, lastMsgSeq);
    await markAsRead({
      conversationId: conversationData.id,
      messageSeq: lastMsgSeq,
    });
  }, [
    conversationData?.id,
    conversationData?.lastMessage?.sequenceNumber,
    lastMessageSeq,
    markAsRead,
    markAsReadLocal,
    setFocusOn,
  ]);

  useEffect(() => {
    if (!conversationData?.id) return;

    const handleUserInteract = () => {
      void handleMarkAsReadOnFocus();
    };

    const handleWindowFocus = () => {
      const activeEl = document.activeElement;
      const insidePanel =
        (activeEl && panelRef.current?.contains(activeEl)) ||
        (activeEl && scrollRef.current?.contains(activeEl));
      if (!insidePanel) return;
      void handleMarkAsReadOnFocus();
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setFocusOn(null);
      }
    };

    const handleWindowBlur = () => {
      setFocusOn(null);
    };

    const messageArea = scrollRef.current;
    if (messageArea) {
      messageArea.addEventListener("click", handleUserInteract);
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      if (messageArea) {
        messageArea.removeEventListener("click", handleUserInteract);
      }
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [conversationData?.id, handleMarkAsReadOnFocus, setFocusOn]);

  useEffect(() => {
    if (tempUser) {
      setChatTitle(tempUser.infos.fullName);
      setChatAvatar(tempUser.infos.avatar);
    } else if (conversationData) {
      setChatTitle(renderConversationName(conversationData));
      setChatAvatar(conversationData.avatarUrl || "");
    }
  }, [tempUser, conversationData, renderConversationName]);

  const handleOnClose = useCallback(() => {
    setFocusOn(null);
    closeChat(conversationId);
  }, [closeChat, conversationId, setFocusOn]);

  const handleOnMinimum = useCallback(() => {
    setFocusOn(null);
    toggleMinimize(conversationId);
  }, [conversationId, setFocusOn, toggleMinimize]);

  return (
    <div
      className={clsx(
        "w-[330px] h-[450px] bg-bg-main rounded-xl overflow-hidden shadow-lg flex flex-col",
        "shadow-xl",
        className,
      )}
      ref={panelRef}
    >
      <div className="flex items-center px-4 h-[13%] bg-bg-second">
        {isLoadingHeader ? (
          <>
            <Skeleton sz="md" variant="circle" className="w-8" />
            <Skeleton sz="md" className="ml-2 flex-1" />
          </>
        ) : (
          <>
            <Avatar src={chatAvatar} alt="Avatar" sz="sm" />
            <Text
              sz="sm"
              weight="bold"
              className={clsx(
                "ml-2 text-text-main flex-1 rounded-md px-2 py-3",
                "hover:bg-bg-fourth cursor-pointer transition-all duration-200",
                "active:scale-[0.98] active:opacity-80 truncate",
              )}
            >
              {chatTitle}
            </Text>
          </>
        )}
        <MiniButton sz="sm" onClick={handleOnMinimum}>
          <i className="fas fa-minus"></i>
        </MiniButton>
        <MiniButton sz="sm" onClick={handleOnClose}>
          <i className="fa-solid fa-xmark"></i>
        </MiniButton>
      </div>

      <div className="flex-1 min-h-0 flex flex-col bg-bg-second">
        {tempTargetId ? (
          <div className="flex flex-col justify-center items-center h-full text-center px-4">
            <div className="relative mb-3">
              <Avatar src={chatAvatar} alt="Avatar" sz="sm" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
            </div>

            <Text sz="sm" weight="bold" className="text-white">
              {chatTitle}
            </Text>

            <Text sz="sm" className="text-gray-400 mt-1">
              Hai bạn chưa có tin nhắn nào
            </Text>

            <div className="mt-4 px-3 py-2 bg-gray-700/30 rounded-full">
              <Text sz="sm" className="text-gray-300">
                Gửi lời chào đầu tiên 👋
              </Text>
            </div>
          </div>
        ) : null}
        {!tempTargetId && (
          <MessageList
            key={conversationId}
            conversationId={conversationId}
            isGroup={conversationData?.isGroup}
            className="h-full w-full"
            lastSeen={
              <div className="flex flex-col justify-center items-center h-full text-center px-4">
                <div className="relative mb-4">
                  <Avatar src={conversationData?.avatarUrl || ""} alt="Avatar" sz="md" />
                </div>
                <Text sz="sm" weight="bold">
                  {chatTitle}
                </Text>
                <Text sz="xs" wrap="whitespace-normal">
                  {t("common:conversations:privacyDescription")}
                </Text>
              </div>
            }
          />
        )}
      </div>

      <ChatInput
        className="shrink-0 !bg-bg-main py-2 pr-1"
        conversationId={!tempTargetId ? conversationId : undefined}
        correlationId={tempTargetId ? conversationId : undefined}
        receiverId={tempTargetId}
        onFocus={tempTargetId ? undefined : () => void handleMarkAsReadOnFocus()}
      />
    </div>
  );
};
