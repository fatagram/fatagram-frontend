import { Text, Avatar, Skeleton, MiniButton } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { MessageList } from "./message";
import { useEffect, useRef, useState } from "react";
import { useGetConversation } from "@/features/hooks/use-conversation";
import { ChatInput } from "./chat-input";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";

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
          "relative flex flex-col items-center justify-center text-center px-6 py-10",
          className,
        )}
      >
        <div className="w-12 h-12 mb-3 rounded-full bg-bg-third flex items-center justify-center">
          <i className="fa-regular fa-comments text-text-main/60 text-lg"></i>
        </div>

        <Text sz="md" weight="bold" className="text-text-main">
          Conversation not found
        </Text>

        <Text sz="sm" className="text-text-main/60 mt-1">
          Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới
        </Text>
      </div>
    );
  }

  return (
    <div className={clsx("relative flex flex-col bg-bg-main overflow-hidden", className)}>
      <div className="flex items-center gap-3 px-4 h-[60px] bg-bg-second border-b border-gray-700/50 shrink-0">
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

      <div className="flex-1 overflow-y-auto px-4 py-2 bg-bg-seventh" ref={scrollRef}>
        <MessageList
          conversationId={conversationId}
          parentRef={scrollRef}
          isGroup={conversationData?.isGroup}
        />
      </div>

      <ChatInput className="h-auto p-4" conversationId={conversationId} />
    </div>
  );
};
