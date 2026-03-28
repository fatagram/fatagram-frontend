import { Text, Avatar, Skeleton, MiniButton } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import { MessageList } from "./message";
import { useEffect, useRef, useState } from "react";
import { useGetConversation } from "@/features/hooks/use-conversation";
import { useChatStore } from "@/features/hooks/use-chat-store";
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
  const { registry } = useChatStore();
  const { renderConversationName } = useRenderConversationContent();

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

  useEffect(() => {
    if (tempUser) {
      setChatTitle(tempUser.infos.fullName);
      setChatAvatar(tempUser.infos.avatar);
    } else if (conversationData) {
      setChatTitle(renderConversationName(conversationData));
      setChatAvatar(conversationData.avatarUrl || "");
    }
  }, [tempUser, conversationData, renderConversationName]);

  const isLoadingHeader =
    isLoadingConversation || isFetchingConversation || isLoadingTempUser || isFetchingTempUser;

  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={clsx("relative flex flex-col bg-bg-main overflow-hidden", className)}>
      <div className="flex items-center gap-3 px-4 h-[60px] bg-bg-second border-b border-gray-700/50 shrink-0">
        {isLoadingHeader ? (
          <>
            <Skeleton sz="sm-3" variant="circle" className="w-10" />
            <Skeleton sz="sm-3" className="flex-1 max-w-[160px]" />
          </>
        ) : (
          <>
            {onTurnback && (
              <MiniButton sz="xs-3" onClick={onTurnback} className="block lg:hidden">
                <i className="fa-solid fa-arrow-left text-primary-400" />
              </MiniButton>
            )}
            <Avatar src={chatAvatar} alt="Avatar" sz="xs-2" />
            <Text sz="md-1" weight="bold" className="flex-1 text-text-main">
              {chatTitle}
            </Text>
            <div className="flex items-center gap-1">
              <MiniButton sz="xs-3">
                <i className="fa-solid fa-phone text-primary-400" />
              </MiniButton>
              <MiniButton sz="xs-3">
                <i className="fa-solid fa-video text-primary-400" />
              </MiniButton>
              <MiniButton sz="xs-3">
                <i className="fa-solid fa-circle-info text-primary-400" />
              </MiniButton>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 bg-bg-seventh" ref={scrollRef}>
        {tempTargetId ? (
          <div className="flex flex-col justify-center items-center h-full text-center px-4">
            <div className="relative mb-4">
              <Avatar src={chatAvatar} alt="Avatar" sz="md-1" />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black" />
            </div>
            <Text sz="md-1" weight="bold" className="text-white">
              {chatTitle}
            </Text>
            <Text sz="sm-1" className="text-gray-400 mt-1">
              Hai bạn chưa có tin nhắn nào
            </Text>
            <div className="mt-5 px-4 py-2 bg-gray-700/30 rounded-full">
              <Text sz="sm-1" className="text-gray-300">
                Gửi lời chào đầu tiên 👋
              </Text>
            </div>
          </div>
        ) : null}
        <MessageList
          conversationId={conversationId}
          parentRef={scrollRef}
          isGroup={conversationData?.isGroup}
        />
      </div>

      <ChatInput className="h-auto p-4" conversationId={conversationId} receiverId={tempTargetId} />
    </div>
  );
};
