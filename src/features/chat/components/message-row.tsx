import { ComponentProps } from "@/components/common/component-type";
import { MediaType, Message, MessageRenderType } from "@/types/entities/message.type";
import { Avatar, Text } from "@/components/atoms";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useEffect, useState, memo, useRef, useMemo } from "react";
import { useFormatTime } from "@/utils/time";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { useMessageStore } from "@/features/hooks/use-conversation";
import {
  renderAudioMessage,
  renderFileMessage,
  renderImageStackMessage,
  renderOnlyEmojiMessage,
  renderSingleImageMessage,
  renderTextMessage,
  renderVideoMessage,
} from "./messages/render";
import { useShallow } from "zustand/react/shallow";

const EMPTY_VIEWERS: Array<{ userId: string; seenAt: string }> = [];

interface MessageProps extends ComponentProps {
  message: Message;
  userId?: string;
  conversationId?: string;
  isGroup?: boolean;
  userInfo?: any;
  userProfileMap?: Record<string, any>;
  meta: {
    _isFirstInGroup: boolean;
    _isLastInGroup: boolean;
    _isOnlyOneInGroup: boolean;
    _isLastMessage: boolean;
    _isShowTime: boolean;
    _isShowAvatar: boolean;
    _isMyMessage: boolean;
    _messageBubbleShapeClass: string;
    _isOnlyEmoji: boolean;
    _type: MessageRenderType;
    _isShowName: boolean;
    _isOlderThanOneMinute: boolean;
  };
}

const MessageRowComponent: React.FC<MessageProps> = ({
  message,
  userId,
  conversationId,
  className,
  userInfo,
  userProfileMap,
  meta,
}) => {
  const { t } = useTranslation();
  const [hasDelayed, setHasDelayed] = useState(false);
  const { formatTime, formatSmartTimestamp } = useFormatTime();
  const isPending = message.status === "pending";
  const isFailed = message.status === "failed";
  const timeoutRef = useRef<number | null>(null);
  const seenBy = useMessageStore(
    useShallow(
      (state) =>
        state.messageUserSeenMap?.[conversationId || ""]?.[message.sequenceNumber || 0] ??
        EMPTY_VIEWERS,
    ),
  );

  const isFooterVisible = meta._isLastMessage && meta._isMyMessage;
  const isTextMessage = meta._type === MessageRenderType.Text;
  const stackImage = useMemo(
    () => message.media?.filter((m) => m.type === MediaType.Image) ?? [],
    [message.media],
  );

  useEffect(() => {
    if (!isPending) {
      setHasDelayed(false);
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      setHasDelayed(true);
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isPending]);

  return (
    <div
      className={clsx(
        "flex flex-col",
        meta._isLastInGroup ? "mt-[0.5rem]" : "mt-0",
        meta._isLastMessage ? "mb-[0.5rem]" : "mb-0",
        className,
      )}
    >
      {meta._isShowTime && (
        <Text sz="xs" className="text-center my-2">
          {formatSmartTimestamp(message.createdAt)}
        </Text>
      )}
      <div
        className={clsx(
          "flex gap-2 w-full",
          meta._isMyMessage ? "flex-row-reverse" : "flex-row",
          hasDelayed && "opacity-50",
        )}
      >
        {!meta._isMyMessage && (
          <Avatar
            className={clsx(
              "flex-shrink-0 self-end",
              meta._isMyMessage && "order-2",
              !meta._isShowAvatar && "invisible",
            )}
            src={message.senderAvatarUrl}
            alt="Avatar"
            sz="sm"
          />
        )}
        <div className={clsx("flex flex-col", "max-w-[75%]")}>
          {meta._isShowName && (
            <Text
              sz="xs"
              className={clsx(
                "mb-1 min-h-[1rem]",
                meta._isMyMessage ? "text-right mr-1" : "text-left ml-1",
              )}
            >
              {userInfo?.fullName}
            </Text>
          )}
          {meta._isOnlyEmoji ? renderOnlyEmojiMessage(meta._isMyMessage, message.content) : null}
          {isTextMessage &&
            !meta._isOnlyEmoji &&
            renderTextMessage(
              meta._isMyMessage,
              isFailed,
              meta._messageBubbleShapeClass,
              message.content,
              hasDelayed,
            )}
          {meta._type === MessageRenderType.File &&
            renderFileMessage(
              meta._isMyMessage,
              isFailed,
              {
                url: message.media?.[0]?.url || "",
                metadata: {
                  name: message.media?.[0]?.metadata?.filename,
                  size: message.media?.[0]?.metadata?.size,
                },
              },
              meta._messageBubbleShapeClass,
              hasDelayed,
            )}
          {meta._type === MessageRenderType.Video &&
            renderVideoMessage(
              {
                id: message.media?.[0]?.id || "",
                url: message.media?.[0]?.url || "",
              },
              conversationId!,
              meta._messageBubbleShapeClass,
            )}
          {meta._type === MessageRenderType.Audio &&
            renderAudioMessage(
              meta._isMyMessage,
              isFailed,
              {
                url: message.media?.[0]?.url || "",
              },
              meta._messageBubbleShapeClass,
            )}
          {meta._type === MessageRenderType.Image &&
            stackImage.length > 1 &&
            renderImageStackMessage(
              meta._isMyMessage,
              meta._messageBubbleShapeClass,
              message.media,
              conversationId!,
              hasDelayed,
            )}
          {meta._type === MessageRenderType.Image &&
            stackImage.length === 1 &&
            renderSingleImageMessage(
              {
                id: stackImage[0].id || "",
                url: stackImage[0].url || "",
              },
              meta._messageBubbleShapeClass,
              conversationId!,
              hasDelayed,
            )}
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
                  {meta._isOlderThanOneMinute && (
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
              <MiniAvatar
                key={seenInfo.userId}
                uid={seenInfo.userId}
                seenAt={seenInfo.seenAt}
                userInfo={userProfileMap?.[seenInfo.userId]}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export const SystemMessageRow = memo(({ message }: { message: Message }) => {
  const { renderSystemMessage } = useRenderConversationContent();
  return (
    <div className="flex justify-center w-full my-2">
      <Text sz="sm" className="opacity-80">
        {renderSystemMessage(message)}
      </Text>
    </div>
  );
});

export const MiniAvatar = memo(
  ({ uid, seenAt, userInfo }: { uid: string; seenAt: string; userInfo?: any }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const { formatSmartTimestamp } = useFormatTime();

    return (
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Avatar sz="xs" src={userInfo?.avatar} alt="mini" />
        {showTooltip && (
          <div className="absolute right-full mr-2 -top-7 px-2 py-1 bg-bg-main text-text-main text-xs rounded shadow-md z-50 whitespace-nowrap border border-border-main">
            <div className="font-semibold">{userInfo?.fullName || uid}</div>
            <div className="text-xs opacity-75">{formatSmartTimestamp(seenAt)}</div>
          </div>
        )}
      </div>
    );
  },
);

export const MessageRow = memo(MessageRowComponent);
