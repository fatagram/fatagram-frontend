import { Text, Avatar, Skeleton, MiniButton, Button } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { MessageList, MessageListHandle } from "../../components/message";
import { useEffect, useRef, useState } from "react";
import {
  useGetConversation,
  useLocalMarkAsRead,
  useMarkConversationAsRead,
} from "@/features/chat/hooks/use-conversation";
import { ChatInput } from "../../components/chat-input";
import { useRenderConversationContent } from "../../hooks/use-render-conversation-content";
import { useTranslation } from "react-i18next";
import { NotFound } from "@/features/components/not-found";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../hooks/use-floating-chat";
import { useConversationStore } from "../../services/conversation-manager";
import Transition, { AnimationLib } from "@/components/ui/utils/transition";
import { useAppHub } from "@/features/hub/use-app-hub";
import { TypingIndicator } from "../../components/messages/typing";

interface FatalkChatPanelProps extends ComponentProps {
  conversationId: string;
  onTurnback?: () => void;
}

export const FatalkChatPanel: React.FC<FatalkChatPanelProps> = ({
  className,
  conversationId,
  onTurnback,
}) => {
  const [chatTitle, setChatTitle] = useState("");
  const [chatAvatar, setChatAvatar] = useState("");
  const { renderConversationName } = useRenderConversationContent();
  const { t } = useTranslation();

  const { fetch: markAsRead } = useMarkConversationAsRead();
  const markAsReadLocal = useLocalMarkAsRead();

  const setFocusOn = useChatStore((state) => state.setFocusOn);
  const { invoke, connectionState } = useAppHub();

  const {
    data: conversationData,
    isLoading: isLoadingConversation,
    isFetching: isFetchingConversation,
    isPending: isPendingConversation,
  } = useGetConversation(conversationId, undefined, true);

  const navigate = useNavigate();

  const isLoadingHeader =
    isLoadingConversation || isFetchingConversation || (isPendingConversation && !conversationData);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const messageListRef = useRef<MessageListHandle | null>(null);

  const unreadCount = useConversationStore((state) => state.totalUnreadCount);

  useEffect(() => {
    if (conversationData) {
      setChatTitle(renderConversationName(conversationData));
      setChatAvatar(conversationData.avatarUrl || "");
    }
  }, [conversationData, renderConversationName]);

  useEffect(() => {
    if (!conversationData?.id) return;

    const handleUserInteract = async () => {
      if (!document.hasFocus()) return;
      setFocusOn(conversationData.id);
      const lastMsgSeq =
        useConversationStore.getState().lastMessageSequenceMap[conversationData.id] ||
        conversationData.lastMessageNumber;
      const myLastSeenSeq = useConversationStore.getState().userSeenMap[conversationData.id] || 0;

      if (!lastMsgSeq) return;
      if (lastMsgSeq <= myLastSeenSeq) return;

      markAsReadLocal(conversationData.id, lastMsgSeq);
      await markAsRead({
        conversationId: conversationData.id,
        messageSeq: lastMsgSeq,
      });
    };

    const handleWindowFocus = async () => {
      if (!document.hasFocus()) return;
      const activeEl = document.activeElement;
      if (!panelRef.current && !scrollRef.current) return;
      const insidePanel =
        (activeEl && panelRef.current?.contains(activeEl)) ||
        (activeEl && scrollRef.current?.contains(activeEl));
      if (!insidePanel) return;

      // same logic as handleUserInteract
      setFocusOn(conversationData.id);
      const lastMsgSeq =
        useConversationStore.getState().lastMessageSequenceMap[conversationData.id] ||
        conversationData.lastMessageNumber;
      const myLastSeenSeq = useConversationStore.getState().userSeenMap[conversationData.id] || 0;

      if (!lastMsgSeq) return;
      if (lastMsgSeq <= myLastSeenSeq) return;

      markAsReadLocal(conversationData.id, lastMsgSeq);
      await markAsRead({
        conversationId: conversationData.id,
        messageSeq: lastMsgSeq,
      });
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
  }, [conversationData?.id, markAsRead, markAsReadLocal, setFocusOn]);

  useEffect(() => {
    return () => {
      setFocusOn(null);
    };
  }, [setFocusOn]);

  useEffect(() => {
    invoke("JoinConversation", conversationId);
    return () => {
      invoke("LeaveConversation", conversationId);
    };
  }, [conversationId, connectionState]);

  if (
    !isLoadingConversation &&
    !isFetchingConversation &&
    !isPendingConversation &&
    !conversationData
  ) {
    return (
      <div
        className={clsx(
          "flex flex-col items-center justify-center h-56 gap-4 animate-fade-in",
          "bg-bg-main sm:bg-bg-second h-full",
          className,
        )}
      >
        <NotFound
          icon="fa-regular fa-comments text-3xl"
          title={t("common:conversations:notFound")}
          description={t("common:conversations:notFoundMessage")}
        />
        <Button className="block sm:hidden" onClick={() => navigate("/fatalk")}>
          {t("common:conversations:turnBack")}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "relative flex flex-col bg-bg-main overflow-hidden overscroll-none",
        className,
      )}
      ref={panelRef}
    >
      <div
        className={clsx(
          "flex items-center gap-3 px-2 h-[60px] bg-bg-main border-b border-bg-fourth shrink-0",
          "sticky top-0",
        )}
      >
        {isLoadingHeader ? (
          <>
            <Skeleton sz="md" variant="circle" className="w-10" />
            <Skeleton sz="md" className="flex-1 max-w-[160px]" />
          </>
        ) : (
          <>
            {onTurnback && (
              <div className="flex items-center gap-1">
                <MiniButton sz="sm" onClick={onTurnback} className="block lg:hidden">
                  <i className="fa-solid fa-arrow-left text-primary-400" />
                </MiniButton>
                <Transition show={unreadCount > 0} animation={AnimationLib.Fade}>
                  <div className="rounded-full bg-primary-500 px-2 text-white">
                    <Text className="text-white" weight="bold">
                      {unreadCount}
                    </Text>
                  </div>
                </Transition>
              </div>
            )}
            <Avatar src={chatAvatar} alt="Avatar" sz="sm" />
            <Text sz="md" weight="bold" className="flex-1 text-text-main truncate">
              {chatTitle}
            </Text>
            {/* <div className="flex items-center gap-1">
              <MiniButton sz="sm">
                <i className="fa-solid fa-phone text-primary-400" />
              </MiniButton>
              <MiniButton sz="sm">
                <i className="fa-solid fa-video text-primary-400" />
              </MiniButton>
              <MiniButton sz="sm">
                <i className="fa-solid fa-circle-info text-primary-400" />
              </MiniButton>
            </div> */}
          </>
        )}
      </div>

      <div className="flex-1 py-2 bg-bg-main min-h-0" ref={scrollRef} data-chat-scrollable="true">
        <MessageList
          ref={messageListRef}
          key={conversationId}
          conversationId={conversationId}
          parentRef={scrollRef}
          isGroup={conversationData?.isGroup}
          lastSeen={
            <div className="flex flex-col justify-center items-center h-full text-center px-4">
              {isLoadingHeader ? (
                <>
                  <div className="relative mb-4">
                    <Skeleton variant="circle" sz="md" />
                  </div>
                  <Skeleton sz="sm" className="w-[150px] mb-2" />
                  <Skeleton sz="sm" className="w-[200px]" />
                </>
              ) : (
                <>
                  <div className="relative mb-4">
                    <Avatar src={conversationData?.avatarUrl || ""} alt="Avatar" sz="md" />
                  </div>
                  <Text sz="sm" weight="bold">
                    {chatTitle}
                  </Text>
                  <Text sz="xs" wrap="whitespace-normal">
                    {t("common:conversations:privacyDescription")}
                  </Text>
                </>
              )}
            </div>
          }
        />
      </div>

      <TypingIndicator conversationId={conversationId} />

      <ChatInput
        className="!bg-bg-main h-auto py-2 px-1 touch-none"
        conversationId={conversationId}
        onFocus={() => {
          if (!conversationData?.id || !document.hasFocus()) return;
          setFocusOn(conversationData.id);
          const lastMsgSeq = conversationData.lastMessage?.sequenceNumber;
          const myLastSeenSeq = conversationData.myLastSeenMessageSeq || 0;
          if (!lastMsgSeq) return;
          if (lastMsgSeq <= myLastSeenSeq) return;
          markAsReadLocal(conversationData.id, lastMsgSeq);
          void markAsRead({
            conversationId: conversationData.id,
            messageSeq: lastMsgSeq,
          });
        }}
      />
    </div>
  );
};
