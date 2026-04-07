import { ComponentProps } from "@/components/common/component-type";
import { Message } from "@/types/entities/message.type";
import { Avatar, Text } from "@/components/atoms";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useEffect, useState, memo, useMemo } from "react";
import { useFormatTime } from "@/utils/format-time";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { isSystemMessage } from "../helpers/conversation-helpers";
import { useMessageStore } from "@/features/hooks/use-conversation";
import { useGetUserProfiles } from "@/features/hooks/use-user-profile";

interface MessageProps extends ComponentProps {
  message: Message;
  prevMessage?: Message;
  nextMessage?: Message;
  isMyMessage?: boolean;
  userId?: string;
  conversationId?: string;
  index: number;
  isGroup?: boolean;
  userInfo?: any;
  ref: React.RefObject<HTMLDivElement | null> | null;
}

const MessageRowComponent: React.FC<MessageProps> = ({
  message,
  prevMessage,
  nextMessage,
  index,
  userId,
  conversationId,
  isGroup,
  className,
  userInfo,
  ref,
}) => {
  const { t } = useTranslation();
  const [hasDelayed, setHasDelayed] = useState(false);
  const { getDiffBetween, formatTime, formatSmartTimestamp } = useFormatTime();
  const { renderSystemMessage } = useRenderConversationContent();
  const isPending = message.status === "pending";
  const isFailed = message.status === "failed";
  const isSystem = isSystemMessage(message.type);
  const { messageUserSeenMap } = useMessageStore();
  const seenBy = useMemo(
    () => messageUserSeenMap?.[conversationId || ""]?.[message.sequenceNumber || 0] || [],
    [messageUserSeenMap, conversationId, message.sequenceNumber],
  );

  const isShowTime =
    !prevMessage ||
    isSystemMessage(prevMessage.type) ||
    getDiffBetween(message.createdAt, prevMessage.createdAt, "minute") > 30;
  const isPrevMessageShowTime =
    nextMessage && getDiffBetween(message.createdAt, nextMessage.createdAt, "minute") > 30;
  const isLastMessageInGroup =
    !prevMessage || prevMessage.senderId !== message.senderId || isShowTime;
  const isFirstMessageInGroup =
    !nextMessage || nextMessage.senderId !== message.senderId || isPrevMessageShowTime;
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
            src={userInfo?.avatar}
            alt="Avatar"
            sz="sm"
          />
        )}
        <div className={clsx("flex flex-col", "max-w-[75%]")}>
          {isShowName && (
            <Text
              sz="xs"
              className={clsx(
                "mb-1 min-h-[1rem]",
                isMyMessage ? "text-right mr-1" : "text-left ml-1",
              )}
            >
              {userInfo?.fullName}
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
            return (
              <MiniAvatar key={seenInfo.userId} uid={seenInfo.userId} seenAt={seenInfo.seenAt} />
            );
          })}
        </div>
      )}
    </div>
  );
};

export const MiniAvatar = memo(({ uid, seenAt }: { uid: string; seenAt: string }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { formatSmartTimestamp } = useFormatTime();
  const { userProfileMap } = useGetUserProfiles([uid]);

  const userInfo = userProfileMap[uid];

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Avatar sz="xs" src={userInfo?.avatar} alt="mini" />
      {showTooltip && (
        <div className="absolute right-full mr-2 -top-7 px-2 py-1 bg-bg-main text-text-main text-xs rounded shadow-md z-50 whitespace-nowrap border border-border-main">
          <div className="font-semibold">{userInfo?.fullName}</div>
          <div className="text-xs opacity-75">{formatSmartTimestamp(seenAt)}</div>
        </div>
      )}
    </div>
  );
});

export const MessageRow = memo(MessageRowComponent);
