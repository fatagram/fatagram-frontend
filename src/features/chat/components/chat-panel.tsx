import { Text, Avatar, Skeleton, Button } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import {
  useGetConversation,
  useLocalMarkAsRead,
  useMarkConversationAsRead,
} from "@/features/chat/hooks/use-conversation";
import { useTranslation } from "react-i18next";
import { NotFound } from "@/features/components/not-found";
import { useNavigate } from "react-router-dom";
import { useAppHub } from "@/features/hub/use-app-hub";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { MessageList, MessageListHandle } from "./message";
import { convManager, useConversationStore } from "../services/conversation-manager";
import { TypingIndicator } from "./messages/typing";
import { ChatInput } from "./chat-input";
import { useChatStore } from "../hooks/use-floating-chat";

interface Props extends ComponentProps {
  conversationId: string;
  onTurnback?: () => void;
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
  onClickTitle?: () => void;
}

export const ChatPanel: React.FC<Props> = ({
  className,
  conversationId,
  headerRight,
  headerLeft,
  onClickTitle,
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

  const conv = conversationData ?? convManager.getConversation(conversationId);

  const navigate = useNavigate();

  const isLoadingHeader =
    isLoadingConversation || isFetchingConversation || (isPendingConversation && !conversationData);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const messageListRef = useRef<MessageListHandle | null>(null);

  useEffect(() => {
    if (conv) {
      setChatTitle(renderConversationName(conv));
      setChatAvatar(conv.avatarUrl ?? "");
    }
  }, [conv]);

  useEffect(() => {
    if (!conv?.id) return;

    const handleUserInteract = async () => {
      if (!document.hasFocus()) return;
      setFocusOn(conv.id);
      const lastMsgSeq =
        useConversationStore.getState().lastMessageSequenceMap[conv.id] ||
        conversationData?.lastMessageNumber;
      const myLastSeenSeq = useConversationStore.getState().userSeenMap[conv.id] || 0;

      if (!lastMsgSeq) return;
      if (lastMsgSeq <= myLastSeenSeq) return;

      markAsReadLocal(conv.id, lastMsgSeq);
      await markAsRead({
        conversationId: conv.id,
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
      setFocusOn(conv.id);
      const lastMsgSeq =
        useConversationStore.getState().lastMessageSequenceMap[conv.id] ||
        conv.lastMessage?.sequenceNumber;
      const myLastSeenSeq = useConversationStore.getState().userSeenMap[conv.id] || 0;

      if (!lastMsgSeq) return;
      if (lastMsgSeq <= myLastSeenSeq) return;

      markAsReadLocal(conv.id, lastMsgSeq);
      await markAsRead({
        conversationId: conv.id,
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
            {headerLeft}
            <Avatar className="shrink-0" src={chatAvatar} alt="Avatar" sz="sm" />
            <Text
              sz="md"
              weight="bold"
              className={clsx(
                "mr-1 flex-1 text-text-main truncate ",
                onClickTitle && "transition-all duration-100 cursor-pointer py-2",
                onClickTitle && "hover:bg-black/10 rounded-lg active:scale-[98%]",
              )}
              onClick={onClickTitle}
            >
              {chatTitle}
            </Text>
            <div className="mr-auto">{headerRight}</div>
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
