import { ConversationDto } from "@/api/conversation/dto/conversation.dto";
import { Text, Avatar } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { MessageType } from "@/types/entities/message.type";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { isSystemMessage } from "../helpers/conversation-helpers";
import { useFormatTime } from "@/utils/format-time";
import { useAuth } from "@/contexts";
import { useUnreadMessageCountCache } from "@/features/hooks/use-conversation";

interface ChatItemProps extends ComponentProps {
  conversation: ConversationDto;
  isActive?: boolean;
  onClick: () => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({ conversation, onClick }) => {
  const lastMessage = conversation.lastMessage;
  const location = useLocation();
  const currentConversationId = location.pathname.split("/").pop();

  const { t } = useTranslation();
  const { renderConversationName, renderSystemMessage } = useRenderConversationContent();
  const { formatTime } = useFormatTime();

  const unreadCount = useUnreadMessageCountCache(conversation.id);
  const isUnread = unreadCount > 0;
  const isOtherUserRead =
    conversation.otherLastSeenMessageSeq &&
    conversation.lastMessage?.sequenceNumber &&
    conversation.otherLastSeenMessageSeq >= conversation.lastMessage.sequenceNumber;
  const unreadLabel = unreadCount > 99 ? "99+" : String(unreadCount);

  const { userId } = useAuth();

  return (
    <div
      key={conversation.id}
      className={clsx(
        "flex gap-2 px-1 py-3",
        "hover:bg-bg-fourth rounded-lg transition-colors",
        "cursor-pointer",
        conversation.id === currentConversationId && "bg-bg-fourth",
      )}
      onClick={() => onClick()}
    >
      <Avatar src={conversation.avatarUrl ?? ""} alt="Conversation Avatar" sz="md" />
      <div className="flex flex-col gap-1 min-w-0 justify-center">
        <Text
          sz="sm"
          weight={isUnread ? "bold" : "regular"}
          className={clsx("line-clamp-1 truncate max-w-full")}
        >
          {renderConversationName(conversation)}
        </Text>
        <div className="flex items-center opacity-80">
          <Text sz="xs" className="truncate max-w-full" weight={isUnread ? "bold" : "regular"}>
            {unreadCount > 1
              ? `Bạn có ${unreadLabel} tin nhắn chưa đọc`
              : lastMessage
                ? isSystemMessage(lastMessage?.type || MessageType.System)
                  ? renderSystemMessage(lastMessage)
                  : userId === lastMessage?.senderId
                    ? t("common:conversations.you") + ": " + lastMessage?.content
                    : lastMessage?.senderFullName + ": " + lastMessage?.content
                : "Unknown"}
          </Text>
          <Text sz="xs" className="mx-2 shrink-0" weight={isUnread ? "bold" : "regular"}>
            •
          </Text>
          <Text sz="xs" className="shrink-0" weight={isUnread ? "bold" : "regular"}>
            {formatTime(conversation.lastMessage?.createdAt ?? "")}
          </Text>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-end gap-2">
        {!conversation.isGroup && isOtherUserRead && !isUnread ? (
          <Avatar sz="xs" src={conversation.avatarUrl || ""} alt={"seen"} className="my-auto" />
        ) : null}

        {Boolean(isUnread) === true && (
          <div aria-hidden className={clsx("w-2 h-2 rounded-full", "my-auto", "bg-primary-500")} />
        )}
      </div>
    </div>
  );
};
