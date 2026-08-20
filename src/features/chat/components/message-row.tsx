import { ComponentProps } from "@/components/common/component-type";
import { MediaType, Message, MessageRenderType } from "@/types/entities/message.type";
import { User } from "@/types/entities/user.type";
import { Avatar, MiniButton, Text, Tooltip } from "@/components/atoms";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useEffect, useState, memo, useRef, useMemo } from "react";
import { useFormatTime } from "@/utils/time";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { useMessageStore } from "@/features/chat/hooks/use-conversation";
import {
  TextMessageItem,
  OnlyEmojiMessageItem,
  FileMessageItem,
  VideoMessageItem,
  AudioMessageItem,
  ImageStackMessageItem,
  SingleImageMessageItem,
  GifMessageItem,
} from "./messages/render";
import { useShallow } from "zustand/react/shallow";
import { useMobile } from "@/hooks/use-mobile";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Menu, MenuItem } from "@/components/ui/menu";
import { useDialog } from "@/contexts";
import { useLongPress } from "@/hooks/use-long-press";
import { UserOptionTrigger } from "./user-option-trigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faCircleExclamation,
  faCopy,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const EMPTY_VIEWERS: Array<{ userId: string; seenAt: string }> = [];

export interface MessageMeta {
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
}

interface MessageProps extends ComponentProps {
  message: Message;
  userId?: string;
  conversationId?: string;
  isGroup?: boolean;
  userInfo?: User;
  userProfileMap?: Record<string, User>;
  meta: MessageMeta;
}

interface MessageOptionsContentProps {
  messageContent?: string;
  isSheet?: boolean;
  onClose: () => void;
}

const MessageOptionsContent = memo(function MessageOptionsContent({
  messageContent,
  isSheet = false,
  onClose,
}: MessageOptionsContentProps) {
  const { t } = useTranslation();

  return (
    <div className={clsx("flex flex-col", isSheet ? "gap-2 pb-10 px-4" : "gap-2 min-w-[220px]")}>
      <Menu>
        <MenuItem
          icon={<FontAwesomeIcon icon={faCopy} />}
          title={t("common:conversations.messageOptions.copy")}
          rightElement={<div />}
          onClick={() => {
            navigator.clipboard.writeText(messageContent || "");
            onClose();
          }}
        />
      </Menu>
    </div>
  );
});

interface MessageContentProps {
  message: Message;
  meta: MessageMeta;
  conversationId?: string;
  hasDelayed: boolean;
  isFailed: boolean;
}

const MessageContent = memo(function MessageContent({
  message,
  meta,
  conversationId,
  hasDelayed,
  isFailed,
}: MessageContentProps) {
  const stackImage = useMemo(
    () => message.media?.filter((m) => m.type === MediaType.Image) ?? [],
    [message.media],
  );

  if (meta._isOnlyEmoji) {
    return <OnlyEmojiMessageItem isMyMessage={meta._isMyMessage} content={message.content} />;
  }

  if (meta._type === MessageRenderType.Text) {
    return (
      <TextMessageItem
        isMyMessage={meta._isMyMessage}
        isFailed={isFailed}
        messageBubbleShapeClass={meta._messageBubbleShapeClass}
        content={message.content}
        hasDelayed={hasDelayed}
      />
    );
  }

  if (meta._type === MessageRenderType.File) {
    return (
      <FileMessageItem
        isMyMessage={meta._isMyMessage}
        isFailed={isFailed}
        media={{
          url: message.media?.[0]?.url || "",
          metadata: {
            name: message.media?.[0]?.metadata?.filename,
            size: message.media?.[0]?.metadata?.size,
            mimeType: message.media?.[0]?.metadata?.mimeType,
          },
        }}
        messageBubbleShapeClass={meta._messageBubbleShapeClass}
        hasDelayed={hasDelayed}
      />
    );
  }

  if (meta._type === MessageRenderType.Video) {
    return (
      <VideoMessageItem
        media={{
          id: message.media?.[0]?.id || "",
          url: message.media?.[0]?.url || "",
        }}
        conversationId={conversationId!}
        messageBubbleShapeClass={meta._messageBubbleShapeClass}
      />
    );
  }

  if (meta._type === MessageRenderType.Audio) {
    return (
      <AudioMessageItem
        isMyMessage={meta._isMyMessage}
        isFailed={isFailed}
        media={{
          url: message.media?.[0]?.url || "",
        }}
        messageBubbleShapeClass={meta._messageBubbleShapeClass}
      />
    );
  }

  if (meta._type === MessageRenderType.Image) {
    if (stackImage.length > 1) {
      return (
        <ImageStackMessageItem
          isMyMessage={meta._isMyMessage}
          messageBubbleShapeClass={meta._messageBubbleShapeClass}
          stackImage={message.media}
          conversationId={conversationId!}
          hasDelayed={hasDelayed}
        />
      );
    }
    if (stackImage.length === 1) {
      return (
        <SingleImageMessageItem
          image={{
            id: stackImage[0].id || "",
            url: stackImage[0].url || "",
            width: stackImage[0].metadata?.width,
            height: stackImage[0].metadata?.height,
          }}
          messageBubbleShapeClass={meta._messageBubbleShapeClass}
          conversationId={conversationId!}
          hasDelayed={hasDelayed}
        />
      );
    }
    return null;
  }

  if (meta._type === MessageRenderType.Gif) {
    return (
      <GifMessageItem
        gif={{
          id: message.media?.[0]?.id || "",
          url: message.media?.[0]?.url || "",
        }}
        messageBubbleShapeClass={meta._messageBubbleShapeClass}
        conversationId={conversationId!}
        hasDelayed={hasDelayed}
      />
    );
  }

  return null;
});

interface MessageActionsProps {
  isMyMessage: boolean;
  copied: boolean;
  onCopy: () => void;
  onShowOptions: () => void;
}

const MessageActions = memo(function MessageActions({
  isMyMessage,
  copied,
  onCopy,
  onShowOptions,
}: MessageActionsProps) {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        "opacity-0 group-hover:opacity-100 transition-opacity flex items-center px-1 gap-1",
        isMyMessage ? "mr-1" : "ml-1",
      )}
    >
      <MiniButton
        sz="sm"
        className="!w-7 !h-7 !min-w-0 !p-0 bg-bg-second hover:bg-bg-third shadow-sm"
        onClick={onCopy}
        title={t("common:conversations.messageOptions.copy")}
      >
        <FontAwesomeIcon
          icon={copied ? faCheck : faCopy}
          className={clsx(
            "text-[10px] transition-all duration-200",
            copied ? "text-primary-500 scale-125 opacity-100" : "opacity-60",
          )}
        />
      </MiniButton>

      <MiniButton
        sz="sm"
        className="!w-7 !h-7 !min-w-0 !p-0 bg-bg-second hover:bg-bg-third shadow-sm"
        onClick={onShowOptions}
      >
        <FontAwesomeIcon icon={faEllipsis} className="text-[10px] opacity-60" />
      </MiniButton>
    </div>
  );
});

interface MessageSeenFooterProps {
  message: Message;
  meta: MessageMeta;
  userId?: string;
  seenBy: Array<{ userId: string; seenAt: string }>;
  userProfileMap?: Record<string, User>;
}

const MessageSeenFooter = memo(function MessageSeenFooter({
  message,
  meta,
  userId,
  seenBy,
  userProfileMap,
}: MessageSeenFooterProps) {
  const { t } = useTranslation();
  const { formatTime } = useFormatTime();
  const isFooterVisible = meta._isLastMessage && meta._isMyMessage;
  const hasSeenByOther =
    seenBy.length > 1 || (seenBy.length === 1 && seenBy[0].userId !== userId);

  if (!isFooterVisible && !hasSeenByOther) {
    return null;
  }

  return (
    <div className="flex justify-end items-center gap-1 m-1">
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
  );
});

function MessageRowComponent({
  message,
  userId,
  conversationId,
  isGroup,
  className,
  userInfo,
  userProfileMap,
  meta,
}: Readonly<MessageProps>) {
  const { t } = useTranslation();
  const isMobile = useMobile();
  const { openDialog, closeDialog } = useDialog();
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTimestamp, setShowTimestamp] = useState(false);

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

  const handleShowOptions = () => {
    if (isMobile) {
      setShowOptionsSheet(true);
    } else {
      openDialog({
        title: t("common:conversations.messageOptions.title", "Tùy chọn"),
        content: (
          <MessageOptionsContent
            messageContent={message.content}
            onClose={closeDialog}
          />
        ),
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
        <div className="flex items-center justify-center w-full my-4 select-none">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-text-main/10" />
          <span className="mx-3 px-3 py-1 bg-bg-third/40 border border-bg-fourth/30 rounded-full text-[10px] font-medium tracking-wide text-text-secondary uppercase">
            {formatSmartTimestamp(message.createdAt)}
          </span>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-text-main/10" />
        </div>
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
              isGroup={isGroup}
              user={{
                userId: message.senderId!,
                fullName: userInfo?.fullName || "",
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
        <button
          type="button"
          className={clsx(
            "flex flex-col select-none text-left bg-transparent border-0 p-0",
            "max-w-[75%] active:scale-[0.98] transition-transform cursor-pointer",
            meta._shouldAnimate && "bubble",
            meta._isMyMessage ? "me items-end" : "them items-start",
          )}
          {...longPressProps}
          onContextMenu={handleContextMenu}
          onClick={() => setShowTimestamp((prev) => !prev)}
        >
          {meta._isShowName && (
            <UserOptionTrigger
              isGroup={isGroup}
              user={{
                userId: message.senderId!,
                fullName: userInfo?.fullName || "",
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
            <MessageOptionsContent
              isSheet
              messageContent={message.content}
              onClose={() => setShowOptionsSheet(false)}
            />
          </BottomSheet>
          <MessageContent
            message={message}
            meta={meta}
            conversationId={conversationId}
            hasDelayed={hasDelayed}
            isFailed={isFailed}
          />
          {showTimestamp && (
            <div
              className={clsx(
                "text-[10px] text-text-third mt-1 mx-2 select-none animate-slide-up-in overflow-hidden",
                meta._isMyMessage ? "text-right self-end" : "text-left self-start",
              )}
            >
              {formatTime(message.createdAt)}
            </div>
          )}
        </button>

        {!isMobile && (
          <MessageActions
            isMyMessage={meta._isMyMessage}
            copied={copied}
            onCopy={handleCopy}
            onShowOptions={handleShowOptions}
          />
        )}

        {isFailed && (
          <div className="flex items-center justify-center">
            <FontAwesomeIcon icon={faCircleExclamation} className="text-red-500" />
          </div>
        )}
      </div>
      <MessageSeenFooter
        message={message}
        meta={meta}
        userId={userId}
        seenBy={seenBy}
        userProfileMap={userProfileMap}
      />
    </div>
  );
}

export const SystemMessageRow = memo(
  ({ message, meta }: { message: Message; meta: MessageMeta }) => {
    const { renderSystemMessage } = useRenderConversationContent();
    const { formatSmartTimestamp } = useFormatTime();
    return (
      <div className="flex flex-col items-center w-full my-3">
        {meta?._isShowTime && (
          <div className="flex items-center justify-center w-full my-4 select-none">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-text-main/10" />
            <span className="mx-3 px-3 py-1 bg-bg-third/40 border border-bg-fourth/30 rounded-full text-[10px] font-medium tracking-wide text-text-secondary uppercase">
              {formatSmartTimestamp(message.createdAt)}
            </span>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-text-main/10" />
          </div>
        )}
        <div className="flex justify-center w-full my-1">
          <span className="inline-flex items-center justify-center px-4 py-1.5 bg-bg-third/20 border border-bg-fourth/10 backdrop-blur-sm rounded-full text-center text-xs text-text-secondary max-w-[80%] break-words shadow-sm">
            {renderSystemMessage(message)}
          </span>
        </div>
      </div>
    );
  },
);

export const MiniAvatar = memo(
  ({ uid, seenAt, userInfo }: { uid: string; seenAt: string; userInfo?: User }) => {
    const { formatSmartTimestamp } = useFormatTime();

    const tooltipContent = (
      <div className="flex flex-col text-left">
        <div className="font-semibold text-text-main text-xs">{userInfo?.fullName || uid}</div>
        <div className="text-[10px] text-text-third mt-[2px] leading-normal font-normal">
          {formatSmartTimestamp(seenAt)}
        </div>
      </div>
    );

    return (
      <Tooltip position="left" content={tooltipContent}>
        <Avatar sz="xs" src={userInfo?.avatar || ""} alt="mini" />
      </Tooltip>
    );
  },
);

export const MessageRow = memo(MessageRowComponent);
