import { Avatar, MiniButton } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useChatStore } from "../../hooks/use-chat-store";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import { useGetConversation } from "@/features/hooks/use-conversation";

interface BubbleChatProps extends ComponentProps {
  conversationId: string;
}

export const BubbleChat: React.FC<BubbleChatProps> = ({ className, conversationId }) => {
  const { toggleMinimize, closeChat, registry } = useChatStore();

  const chat = registry[conversationId];
  const tempTargetId = chat?.type === "temp" ? chat.targetId : undefined;
  const { data: tempUser } = useGetUserProfile(tempTargetId!);
  const { data: conversationData } = useGetConversation(conversationId);

  const chatAvatar = tempUser ? tempUser.infos.avatar : conversationData?.avatarUrl || "";

  const handleOnClick = () => {
    toggleMinimize(conversationId);
  };

  const handleOnClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeChat(conversationId);
  };

  return (
    <div className={clsx("relative flex gap-4 group", className)} onClick={handleOnClick}>
      <Avatar
        sz="sm-2"
        alt="Avatar"
        src={chatAvatar}
        className={clsx(
          "shadow-lg shadow-bg-second hover:shadow-bg-fourth",
          "hover:scale-105 cursor-pointer hover:brightness-95 transition-all duration-200",
          "border-2 border-bg-ninth",
          "active:scale-95",
        )}
      />
      <MiniButton
        sz="xs-2"
        className="absolute opacity-0 group-hover:opacity-100 bg-gray-500 !duration-100 top-[-20%] right-[-20%]"
        onClick={handleOnClose}
      >
        <i className="fa-solid fa-xmark" />
      </MiniButton>
    </div>
  );
};

interface BubbleChatListProps extends ComponentProps {}

export const BubbleChatList: React.FC<BubbleChatListProps> = ({ className }) => {
  const { minimizedIds } = useChatStore();
  return (
    <div className={clsx("flex gap-4 flex-col", className)}>
      {minimizedIds.map((id) => (
        <BubbleChat key={id} conversationId={id} />
      ))}
    </div>
  );
};
