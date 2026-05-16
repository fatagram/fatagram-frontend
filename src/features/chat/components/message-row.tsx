import { ComponentProps } from "@/components/common/component-type";
import { MediaType, Message, MessageRenderType } from "@/types/entities/message.type";
import { Avatar, MiniButton, Text } from "@/components/atoms";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useEffect, useState, memo, useRef, useMemo } from "react";
import { useFormatTime } from "@/utils/time";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { useMessageStore } from "@/features/chat/hooks/use-conversation";
import {
  renderAudioMessage,
  renderFileMessage,
  renderGifMessage,
  renderImageStackMessage,
  renderOnlyEmojiMessage,
  renderSingleImageMessage,
  renderTextMessage,
  renderVideoMessage,
} from "./messages/render";
import { useShallow } from "zustand/react/shallow";
import { useMobile } from "@/hooks/use-mobile";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Menu, MenuItem } from "@/components/ui/menu";
import { useDialog } from "@/contexts";
import { useLongPress } from "@/hooks/use-long-press";
import { UserOptionTrigger } from "./user-option-trigger";

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
    _shouldAnimate: boolean;
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
  const isMobile = useMobile();
  const { openDialog, closeDialog } = useDialog();
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [copied, setCopied] = useState(false);

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
  const hasSeenByOther = seenBy?.length > 1 || (seenBy.length === 1 && seenBy[0].userId !== userId);

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

  const MessageOptionsContent = ({ isSheet = false }: { isSheet?: boolean }) => (
    <div
      className={clsx("flex flex-col", isSheet ? "gap-2 pb-10 px-4" : "gap-2 p-2 min-w-[220px]")}
    >
      <Menu>
        <MenuItem
          icon="fa-solid fa-copy"
          title={t("common:conversations.messageOptions.copy")}
          onClick={() => {
            navigator.clipboard.writeText(message.content || "");
            isSheet ? setShowOptionsSheet(false) : closeDialog();
          }}
        />
      </Menu>
    </div>
  );

  const handleShowOptions = () => {
    if (isMobile) {
      setShowOptionsSheet(true);
    } else {
      openDialog({
        title: "",
        content: <MessageOptionsContent />,
      });
    }
  };

  const longPressProps = useLongPress(() => {
    if (isMobile) handleShowOptions();
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    handleShowOptions();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          "flex gap-2 w-full group relative",
          meta._isMyMessage ? "flex-row-reverse" : "flex-row",
          hasDelayed && "opacity-50",
        )}
      >
        {!meta._isMyMessage && (
          <div className="flex self-end relative">
            <UserOptionTrigger
              user={{
                userId: message.senderId!,
                fullName: userInfo?.fullName,
                avatarUrl: message.senderAvatarUrl,
              }}
            >
              <Avatar
                className={clsx(
                  "flex-shrink-0 hover:scale-110 active:scale-95 transition-transform",
                  !meta._isShowAvatar && "invisible",
                )}
                src={message.senderAvatarUrl}
                alt="Avatar"
                sz="sm"
              />
            </UserOptionTrigger>
          </div>
        )}
        <div
          className={clsx(
            "flex flex-col select-none",
            "max-w-[75%] active:scale-[0.98] transition-transform cursor-pointer",
            meta._shouldAnimate && "bubble",
            meta._isMyMessage ? "me" : "them",
          )}
          {...longPressProps}
          onContextMenu={handleContextMenu}
        >
          {meta._isShowName && (
            <UserOptionTrigger
              user={{
                userId: message.senderId!,
                fullName: userInfo?.fullName,
                avatarUrl: message.senderAvatarUrl,
              }}
            >
              <Text
                sz="xs"
                className={clsx(
                  "mb-1 min-h-[1rem] hover:text-primary-500 transition-colors inline-block w-full",
                  meta._isMyMessage ? "text-right mr-1" : "text-left ml-1",
                )}
              >
                {userInfo?.fullName}
              </Text>
            </UserOptionTrigger>
          )}
          <BottomSheet
            open={showOptionsSheet}
            onOpenChange={setShowOptionsSheet}
            title={t("common:conversations.messageOptions.copy")}
            trigger={<div className="hidden" />}
          >
            <MessageOptionsContent isSheet />
          </BottomSheet>
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
          {meta._type === MessageRenderType.Gif &&
            renderGifMessage(
              {
                id: message.media?.[0]?.id || "",
                url: message.media?.[0]?.url || "",
              },
              meta._messageBubbleShapeClass,
              conversationId!,
              hasDelayed,
            )}
        </div>

        {!isMobile && (
          <div
            className={clsx(
              "opacity-0 group-hover:opacity-100 transition-opacity flex items-center px-1 gap-1",
              meta._isMyMessage ? "mr-1" : "ml-1",
            )}
          >
            <MiniButton
              sz="sm"
              className="!w-7 !h-7 !min-w-0 !p-0 bg-bg-second hover:bg-bg-third shadow-sm"
              onClick={handleCopy}
              title={t("common:conversations.messageOptions.copy")}
            >
              <i
                className={clsx(
                  "fa-solid text-[10px] transition-all duration-200",
                  copied ? "fa-check text-primary-500 scale-125 opacity-100" : "fa-copy opacity-60",
                )}
              ></i>
            </MiniButton>

            <MiniButton
              sz="sm"
              className="!w-7 !h-7 !min-w-0 !p-0 bg-bg-second hover:bg-bg-third shadow-sm"
              onClick={handleShowOptions}
            >
              <i className="fa-solid fa-ellipsis text-[10px] opacity-60"></i>
            </MiniButton>
          </div>
        )}

        {isFailed && (
          <div className="flex items-center justify-center">
            <i className="fa-solid fa-circle-exclamation text-red-500"></i>
          </div>
        )}
      </div>
      {(isFooterVisible || hasSeenByOther) && (
        <div className="flex justify-end items-center m-1">
          {!hasSeenByOther && (
            <Text sz="xs">
              {t("conversations.sent")}{" "}
              {meta._isOlderThanOneMinute && <Text sz="xs">{formatTime(message.createdAt)}</Text>}
            </Text>
          )}
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

export const SystemMessageRow = memo(({ message, meta }: { message: Message; meta: any }) => {
  const { renderSystemMessage } = useRenderConversationContent();
  const { formatSmartTimestamp } = useFormatTime();
  return (
    <div className="flex flex-col items-center w-full my-2">
      {meta?._isShowTime && (
        <Text sz="xs" className="text-center my-2">
          {formatSmartTimestamp(message.createdAt)}
        </Text>
      )}
      <Text sz="sm" className="opacity-80 text-center px-10" wrap="whitespace-normal">
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
