import { Text, Avatar } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { MediaType, MessageType } from "@/types/entities/message.type";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { isSystemMessage } from "../helpers/conversation-helpers";
import { useFormatTime } from "@/utils/time";
import { useAuth } from "@/contexts";
import { Conversation } from "@/types/entities/conversation.type";

interface ChatItemProps extends ComponentProps {
  conversation: Conversation;
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

  const unreadCount = conversation.unreadMessageCount || 0;
  const isUnread = unreadCount > 0;
  const isOtherUserRead =
    conversation.otherLastSeenMessageSeq &&
    conversation.lastMessage?.sequenceNumber &&
    conversation.otherLastSeenMessageSeq >= conversation.lastMessage.sequenceNumber;
  const unreadLabel = unreadCount > 99 ? "99+" : String(unreadCount);

  const { userId } = useAuth();

  const renderMessagePreview = () => {
    if (unreadCount > 1) {
      return `Bạn có ${unreadLabel} tin nhắn chưa đọc`;
    }

    if (!lastMessage) {
      return t("common:conversations.noMessagesYet");
    }

    if (isSystemMessage(lastMessage.type || MessageType.System)) {
      return renderSystemMessage(lastMessage);
    }

    const senderName =
      userId === lastMessage.senderId ? t("common:conversations.you") : lastMessage.senderFullName;

    switch (lastMessage.type) {
      case MessageType.Text:
        return `${senderName}: ${lastMessage.content}`;
      case MessageType.Media:
        if (lastMessage.media && lastMessage.media.some((m) => m.type === MediaType.Image)) {
          return `${senderName}: ${t("common:conversations.sentImageMessage", { count: lastMessage.media.length })}`;
        }
        return `${senderName}: ${t("common:conversations.sentMediaMessage")}`;
      default:
        return "";
    }
  };

  return (
    <div
      key={conversation.id}
      className={clsx(
        "group flex gap-3 p-3 pl-0 sm:pl-3 my-1 rounded-xl transition-all duration-300 ease-out",
        "cursor-pointer select-none",
        conversation.id === currentConversationId
          ? "bg-bg-third"
          : isUnread
            ? "bg-primary-500/[0.04] hover:bg-bg-third/60"
            : "hover:bg-bg-third/60",
      )}
      onClick={() => onClick()}
    >
      <div className="relative shrink-0">
        <Avatar
          src={conversation.avatarUrl ?? ""}
          alt="Conversation Avatar"
          sz="md"
          className="group-hover:scale-105 transition-transform duration-300 border border-bg-fourth/30"
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0 justify-between py-[2px]">
        <div className="flex justify-between items-baseline gap-2">
          <Text
            sz="sm"
            weight={isUnread ? "bold" : "medium"}
            className={clsx(
              "line-clamp-1 truncate max-w-full font-semibold",
              isUnread ? "text-text-main" : "text-text-main/90",
            )}
          >
            {renderConversationName(conversation)}
          </Text>
          <span
            className={clsx(
              "text-xs shrink-0 font-normal",
              isUnread ? "text-primary-500 font-semibold" : "text-text-secondary",
            )}
          >
            {formatTime(conversation.lastMessage?.createdAt ?? "")}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2 mt-1">
          <Text
            sz="xs"
            className={clsx(
              "truncate max-w-full leading-normal",
              isUnread ? "text-text-main font-semibold" : "text-text-third",
            )}
          >
            {renderMessagePreview()}
          </Text>

          <div className="shrink-0 flex items-center justify-end min-w-[20px]">
            {Boolean(isUnread) === true ? (
              <div
                aria-hidden
                className={clsx(
                  "w-[18px] h-[18px] rounded-full bg-primary-500 flex items-center justify-center shadow-sm",
                )}
              >
                <span className="text-[10px] font-bold text-white leading-none">{unreadLabel}</span>
              </div>
            ) : !conversation.isGroup && isOtherUserRead && !isUnread ? (
              <Avatar
                sz="xs"
                src={conversation.avatarUrl || ""}
                alt="seen"
                className="opacity-80 border border-bg-fourth/50 shadow-sm"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
