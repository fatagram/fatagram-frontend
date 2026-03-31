import { ComponentProps } from "@/components/common/component-type";
import { Message } from "@/types/entities/message.type";
import { Avatar, Text } from "@/components/atoms";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useEffect, useState, memo, useMemo } from "react";
import { useGetUserProfile, useGetUserProfileForChat } from "@/features/hooks/use-user-profile";
import { useFormatTime } from "@/utils/format-time";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { isSystemMessage } from "../helpers/conversation-helpers";
import { useMessageStore } from "@/features/hooks/use-conversation";

interface MessageProps extends ComponentProps {
  message: Message;
  isMyMessage?: boolean;
  messages: Message[];
  userId?: string;
  conversationId?: string;
  index: number;
  isGroup?: boolean;
  ref: React.RefObject<HTMLDivElement | null> | null;
}

const MessageRowComponent: React.FC<MessageProps> = ({
  message,
  index,
  userId,
  conversationId,
  messages,
  isGroup,
  className,
  ref,
}) => {
  const { t } = useTranslation();
  const [hasDelayed, setHasDelayed] = useState(false);
  const { data: userInfo } = useGetUserProfile(message.senderId!);
  const { getDiffBetween, formatTime, formatSmartTimestamp } = useFormatTime();
  const { renderSystemMessage } = useRenderConversationContent();
  const isPending = message.status === "pending";
  const isFailed = message.status === "failed";
  const isSystem = isSystemMessage(message.type);
  const { messageUserSeenMap } = useMessageStore();
  const seenBy = useMemo(
    () => messageUserSeenMap?.[conversationId || ""]?.[message.id || ""] || [],
    [messageUserSeenMap, conversationId, message.id],
  );

  const isShowTime =
    index === messages.length - 1 ||
    isSystemMessage(messages[index + 1]?.type) ||
    getDiffBetween(message.createdAt, messages[index + 1]?.createdAt, "minute") > 30;
  const isPrevMessageShowTime =
    index === 0 || getDiffBetween(message.createdAt, messages[index - 1]?.createdAt, "minute") > 30;
  const isLastMessageInGroup =
    index === messages.length - 1 ||
    messages[index + 1]?.senderId !== message.senderId ||
    isShowTime;
  const isFirstMessageInGroup =
    index === 0 || messages[index - 1]?.senderId !== message.senderId || isPrevMessageShowTime;
  const isOnlyMessageInGroup = isFirstMessageInGroup && isLastMessageInGroup;
  const isMyMessage = message.senderId === userId;

  const isShowName = isLastMessageInGroup && !isMyMessage && isGroup;
  const hasAvatar = isFirstMessageInGroup;

  const isFooterVisible = index === 0 && isMyMessage;

  useEffect(() => {
    if (isPending) {
      setTimeout(() => {
        setHasDelayed(true);
      }, 2000);
    }
  }, [isPending]);

  if (isSystem) {
    return (
      <div className="flex justify-center w-full my-2">
        <Text sz="sm" className="opacity-80">
          {renderSystemMessage(message)}
        </Text>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex flex-col",
        isLastMessageInGroup ? "mt-[0.5rem]" : "mt-0",
        index === 0 ? "mb-[0.5rem]" : "mb-0",
        className,
      )}
      ref={ref}
    >
      {isShowTime && (
        <Text sz="xs" className="text-center my-2">
          {formatSmartTimestamp(message.createdAt)}
        </Text>
      )}
      <div
        className={clsx(
          "flex gap-2 w-full",
          isMyMessage ? "flex-row-reverse" : "flex-row",
          hasDelayed && "opacity-50",
        )}
      >
        {!isMyMessage && (
          <Avatar
            className={clsx(
              "flex-shrink-0 self-end",
              isMyMessage && "order-2",
              !hasAvatar && "invisible",
            )}
            src={userInfo?.infos.avatar}
            alt="Avatar"
            sz="sm"
          />
        )}
        <div className={clsx("flex flex-col", "max-w-[75%]")}>
          {isShowName && (
            <Text
              sz="xs"
              className={clsx("mb-1", isMyMessage ? "text-right mr-1" : "text-left ml-1")}
            >
              {userInfo?.infos.fullName ?? <span className="invisible">_</span>}
            </Text>
          )}
          <div
            className={clsx(
              "px-3 py-1 break-words rounded-xl shadow-sm relative max-w-full",
              isMyMessage ? (isFailed ? "bg-primary-800" : "bg-primary-600") : "bg-bg-fourth",
              isFailed && "border-red-500 border-2 opacity-50",
              isMyMessage ? "rounded-l-2xl self-end" : "rounded-r-2xl self-start",
              isOnlyMessageInGroup && "!rounded-2xl",
              isLastMessageInGroup && (isMyMessage ? "rounded-br-none" : "rounded-bl-none"),
              isFirstMessageInGroup && (isMyMessage ? "rounded-tr-none" : "rounded-tl-none"),
              !isFirstMessageInGroup &&
                !isLastMessageInGroup &&
                (isMyMessage
                  ? "rounded-tr-none rounded-br-none"
                  : "rounded-tl-none rounded-bl-none"),
            )}
          >
            <Text
              sz="sm"
              wrap="whitespace-pre-wrap"
              weight="regular"
              className={clsx(isMyMessage ? "text-white " : "text-text-main")}
            >
              {message.content}
            </Text>
            {hasDelayed && (
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-2 h-2 aspect-square animate-spin rounded-full border-[1.5px] border-gray-300 border-t-transparent"></div>
              </div>
            )}
          </div>
          {(seenBy?.length === 0 || (seenBy.length === 1 && seenBy[0].userId === userId)) && (
            <div
              className={clsx(
                "flex items-center justify-end mr-2 overflow-hidden transition-all duration-200",
                isFooterVisible ? "h-[15px] mt-1" : "h-0 mt-0",
              )}
            >
              {isFooterVisible && !isFailed && !isPending && (
                <Text sz="xs">
                  {t("conversations.sent")}{" "}
                  {getDiffBetween(message.createdAt, new Date(), "second") > 60 && (
                    <Text sz="xs">{formatTime(message.createdAt)}</Text>
                  )}
                </Text>
              )}
            </div>
          )}
        </div>
        {isFailed && (
          <div className="flex items-center justify-center">
            <i className="fa-solid fa-circle-exclamation text-red-500"></i>
          </div>
        )}
      </div>
      {seenBy?.length > 0 && !(seenBy.length === 1 && seenBy[0].userId === userId) && (
        <div className="flex justify-end gap-1 mt-1">
          {seenBy.map((seenInfo) => {
            if (seenInfo.userId === userId) return null;
            return <MiniAvatar key={seenInfo.userId} uid={seenInfo.userId} />;
          })}
        </div>
      )}
    </div>
  );
};

export const MiniAvatar = memo(({ uid }: { uid: string }) => {
  const { data: userInfo } = useGetUserProfileForChat(uid);
  return <Avatar sz="xs" src={userInfo?.infos.avatar} alt="mini" />;
});

export const MessageRow = memo(MessageRowComponent);
