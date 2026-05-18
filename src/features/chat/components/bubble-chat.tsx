import { Avatar, Tooltip } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import { useGetConversation } from "@/features/chat/hooks/use-conversation";
import { useConversationStore } from "../services/conversation-manager";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useChatStore } from "../hooks/use-floating-chat";

interface BubbleChatProps extends ComponentProps {
  conversationId: string;
}

export const BubbleChat: React.FC<BubbleChatProps> = ({ className, conversationId }) => {
  const { toggleMinimize, closeChat, registry } = useChatStore(
    useShallow((state) => ({
      toggleMinimize: state.toggleMinimize,
      closeChat: state.closeChat,
      registry: state.registry,
    })),
  );

  const chat = registry[conversationId];
  const tempTargetId = chat?.type === "temp" ? chat.targetId : undefined;
  const { data: tempUser } = useGetUserProfile(tempTargetId);
  const { renderConversationName } = useRenderConversationContent();
  const { data: conversationData } = useGetConversation(
    conversationId,
    undefined,
    !!conversationId,
  );
  const conversationFromStore = useConversationStore(
    useCallback(
      (state) => state.conversations.find((c) => c.id === conversationId),
      [conversationId],
    ),
  );
  const conversation = conversationFromStore || conversationData;
  const chatAvatar = tempUser ? tempUser.infos.avatar : conversation?.avatarUrl || "";

  const chatName = useMemo(() => {
    if (tempUser) return tempUser.infos.fullName;
    if (conversation) return renderConversationName(conversation);
    return "Cuộc trò chuyện";
  }, [tempUser, conversation, renderConversationName]);

  const lastMessageText = useMemo(() => {
    const lastMessage = conversation?.lastMessage;
    if (!lastMessage) return "Chưa có tin nhắn";
    const sender = lastMessage.senderFullName ? `${lastMessage.senderFullName}: ` : "";
    if (lastMessage.type === "System") return "Thông báo hệ thống";
    if (lastMessage.type === "Media") return `${sender}[Hình ảnh/Media]`;
    return `${sender}${lastMessage.content || "Tin nhắn mới"}`;
  }, [conversation?.lastMessage]);

  const handleOnClick = useCallback(async () => {
    toggleMinimize(conversationId);
  }, [toggleMinimize, conversationId]);

  const handleOnClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeChat(conversationId);
  };

  const tooltipContent = (
    <div className="flex flex-col text-left">
      <div className="text-xs font-semibold text-text-main truncate max-w-[176px]">{chatName}</div>
      <div className="text-[11px] text-text-third truncate mt-[2px] max-w-[176px] leading-normal font-normal">
        {lastMessageText}
      </div>
    </div>
  );

  return (
    <div className={clsx("relative flex gap-4 group", className)} onClick={handleOnClick}>
      <Tooltip position="left" content={tooltipContent} className="relative">
        <Avatar
          sz="md"
          alt="Avatar"
          src={chatAvatar}
          className={clsx(
            "shadow-lg shadow-bg-second hover:shadow-bg-fourth",
            "hover:scale-105 cursor-pointer hover:brightness-95 transition-all duration-200",
            "border-2 border-bg-ninth",
            "active:scale-95",
          )}
        />
      </Tooltip>
      <button
        className={clsx(
          "absolute opacity-0 group-hover:opacity-100 bg-gray-500 !duration-100 top-[-20%] right-[-20%]",
          "w-7 h-7 rounded-full flex items-center justify-center text-white",
          "hover:bg-gray-600 transition-colors",
        )}
        onClick={handleOnClose}
      >
        <i className="fa-solid fa-xmark" />
      </button>
    </div>
  );
};

interface BubbleChatListProps extends ComponentProps {}

export const BubbleChatList: React.FC<BubbleChatListProps> = ({ className }) => {
  const minimizedIds = useChatStore((state) => state.minimizedIds);
  return (
    <div className={clsx("flex gap-4 flex-col", className)}>
      {minimizedIds.map((id) => (
        <BubbleChat key={id} conversationId={id} />
      ))}
    </div>
  );
};
