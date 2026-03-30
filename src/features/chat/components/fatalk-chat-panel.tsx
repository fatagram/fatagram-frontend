import { Text, Avatar, Skeleton, MiniButton } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { MessageList } from "./message";
import { useEffect, useRef, useState } from "react";
import { useGetConversation } from "@/features/hooks/use-conversation";
import { ChatInput } from "./chat-input";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { useTranslation } from "react-i18next";
import { NotFound } from "@/features/components/not-found";

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

  const {
    data: conversationData,
    isLoading: isLoadingConversation,
    isFetching: isFetchingConversation,
  } = useGetConversation(conversationId, undefined, true);

  useEffect(() => {
    if (conversationData) {
      setChatTitle(renderConversationName(conversationData));
      setChatAvatar(conversationData.avatarUrl || "");
    }
  }, [conversationData, renderConversationName]);

  const isLoadingHeader = isLoadingConversation || isFetchingConversation;

  const scrollRef = useRef<HTMLDivElement | null>(null);

  if (!isLoadingConversation && !isFetchingConversation && !conversationData) {
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
      </div>
    );
  }

  return (
    <div className={clsx("relative flex flex-col bg-bg-main overflow-hidden", className)}>
      <div className="flex items-center gap-3 px-4 h-[60px] bg-bg-main border-b border-gray-700/50 shrink-0">
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
        className="flex-1 overflow-y-auto px-4 py-2 bg-bg-main scrollbar-hide sm:scrollbar-default"
        ref={scrollRef}
      >
        <MessageList
          conversationId={conversationId}
          parentRef={scrollRef}
          isGroup={conversationData?.isGroup}
        />
      </div>

      <ChatInput className="!bg-bg-main h-auto p-4" conversationId={conversationId} />
    </div>
  );
};
