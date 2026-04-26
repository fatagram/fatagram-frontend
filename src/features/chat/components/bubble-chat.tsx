import { Avatar } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import { useGetConversation } from "@/features/chat/hooks/use-conversation";
import { useCallback } from "react";
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
  const { data: conversationData } = useGetConversation(
    conversationId,
    undefined,
    !!conversationId,
  );
  const chatAvatar = tempUser ? tempUser.infos.avatar : conversationData?.avatarUrl || "";

  const handleOnClick = useCallback(async () => {
    toggleMinimize(conversationId);
  }, [toggleMinimize, conversationId]);

  const handleOnClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeChat(conversationId);
  };

  return (
    <div className={clsx("relative flex gap-4 group", className)} onClick={handleOnClick}>
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
