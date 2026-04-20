import { Text, Avatar, Skeleton, MiniButton, Button } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { MessageList, MessageListHandle } from "./message";
import { useEffect, useRef, useState } from "react";
import {
  useGetConversation,
  useLocalMarkAsRead,
  useMarkConversationAsRead,
  useMessageStore,
} from "@/features/hooks/use-conversation";
import { ChatInput } from "./chat-input";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { useTranslation } from "react-i18next";
import { NotFound } from "@/features/components/not-found";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "@/features/hooks/use-chat-store";

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
  const lastMessageSeq = useMessageStore((state) => state.lastMessageMap[conversationId]);

  const setFocusOn = useChatStore((state) => state.setFocusOn);

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

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const onResize = () => {
      const panel = panelRef.current;
      if (!panel) return;
      const keyboardHeight = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      if (keyboardHeight > 0) {
        const panelTop = panel.getBoundingClientRect().top;
        const newHeight = Math.max(0, vv.height - panelTop);
        panel.style.height = `${newHeight}px`;
        panel.style.maxHeight = `${newHeight}px`;
        requestAnimationFrame(() => {
          messageListRef.current?.scrollToBottom();
        });
      } else {
        panel.style.height = "";
        panel.style.maxHeight = "";
      }
    };

    vv.addEventListener("resize", onResize);
    return () => vv.removeEventListener("resize", onResize);
  }, []);

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
      const lastMsgSeq = lastMessageSeq || conversationData?.lastMessageNumber;
      const myLastSeenSeq = conversationData.myLastSeenMessageSeq || 0;
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

    return () => {
      if (messageArea) {
        messageArea.removeEventListener("click", handleUserInteract);
      }
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [conversationData?.id, lastMessageSeq, markAsRead, markAsReadLocal, setFocusOn]);

  useEffect(() => {
    return () => {
      setFocusOn(null);
    };
  }, [setFocusOn]);

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
          "bg-bg-main sm:bg-bg-second",
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
      className={clsx("relative flex flex-col bg-bg-main overflow-hidden", className)}
      ref={panelRef}
    >
      <div className="flex items-center gap-3 px-2 h-[60px] bg-bg-main border-b border-gray-700/50 shrink-0">
        {isLoadingHeader ? (
          <>
            <Skeleton sz="md" variant="circle" className="w-10" />
            <Skeleton sz="md" className="flex-1 max-w-[160px]" />
          </>
        ) : (
          <>
            {onTurnback && (
              <MiniButton sz="sm" onClick={onTurnback} className="block lg:hidden">
                <i className="fa-solid fa-arrow-left text-primary-400" />
              </MiniButton>
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

      <div
        className="flex-1 px-4 py-2 bg-bg-main min-h-0"
        ref={scrollRef}
        data-chat-scrollable="true"
      >
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

      <ChatInput
        className="!bg-bg-main h-auto py-2 px-1"
        conversationId={conversationId}
        onAfterSend={() => {
          requestAnimationFrame(() => {
            messageListRef.current?.scrollToBottom();
          });
        }}
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
