import { ComponentProps } from "@/components/common/component-type";
import { MediaType, Message, MessageType } from "@/types/entities/message.type";
import { Avatar, Text } from "@/components/atoms";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useEffect, useState, memo, useRef } from "react";
import { useFormatTime } from "@/utils/format-time";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { isSystemMessage } from "../helpers/conversation-helpers";
import { useMessageStore } from "@/features/hooks/use-conversation";
import { formatFileSize } from "@/utils/format-file-size";
import { AudioMessage } from "./messages/audio-message";
import { VideoMessage } from "./messages/video-message";
import { useMediaViewer } from "../context/media-viewer-context";

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
  };
}

const PendingIndicator = () => (
  <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
    <div className="w-2 h-2 aspect-square animate-spin rounded-full border-[1.5px] border-gray-300 border-t-transparent"></div>
  </div>
);

const MessageRowComponent: React.FC<MessageProps> = ({
  message,
  userId,
  conversationId,
  isGroup,
  className,
  userInfo,
  userProfileMap,
  meta,
}) => {
  const { t } = useTranslation();
  const [hasDelayed, setHasDelayed] = useState(false);
  const { getDiffBetween, formatTime, formatSmartTimestamp } = useFormatTime();
  const { renderSystemMessage } = useRenderConversationContent();
  const { onOpen: openMediaViewer } = useMediaViewer();
  const isPending = message.status === "pending";
  const isFailed = message.status === "failed";
  const isSystem = isSystemMessage(message.type);
  const timeoutRef = useRef<number | null>(null);
  const seenBy = useMessageStore((state) => {
    const convId = conversationId || "";
    const messageSeq = message.sequenceNumber || 0;
    return state.messageUserSeenMap?.[convId]?.[messageSeq] ?? EMPTY_VIEWERS;
  });

  const isShowName = meta._isLastInGroup && !meta._isMyMessage && isGroup;
  const hasAvatar = meta._isFirstInGroup;

  const isFooterVisible = meta._isLastMessage && meta._isMyMessage;
  const isTextMessage = message.type === MessageType.Text;
  const isMediaMessage = message.type === MessageType.Media;
  const isImageMessage =
    isMediaMessage && message.media?.some((media) => media.type === MediaType.Image);
  const isVideoMessage =
    isMediaMessage && message.media?.some((media) => media.type === MediaType.Video);
  const isAudioMessage =
    isMediaMessage && message.media?.some((media) => media.type === MediaType.Audio);
  const isFileMessage =
    isMediaMessage && message.media?.some((media) => media.type === MediaType.File);

  const stackImage = message.media?.filter((media) => media.type === MediaType.Image) || [];

  const isOnlyEmoji =
    isTextMessage &&
    message.content.trim() !== "" &&
    (() => {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      const segments = [...segmenter.segment(message.content.trim())].map((s) => s.segment);

      return (
        segments.length < 6 &&
        segments.every((char) =>
          /\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}/u.test(char),
        )
      );
    })();

  const renderOnlyEmojiMessage = () => (
    <div className={clsx("text-4xl", meta._isMyMessage ? "text-white" : "text-text-main")}>
      {message.content}
    </div>
  );

  const renderTextMessage = () => (
    <div
      className={clsx(
        "px-3 py-2 break-words rounded-xl shadow-sm relative max-w-full",
        meta._isMyMessage ? (isFailed ? "bg-primary-800" : "bg-primary-600") : "bg-bg-fourth",
        isFailed && "border-red-500 border-2 opacity-50",
        meta._messageBubbleShapeClass,
      )}
    >
      <Text
        sz="md"
        wrap="whitespace-pre-wrap"
        weight="regular"
        className={clsx(meta._isMyMessage ? "text-white " : "text-text-main")}
      >
        {message.content}
      </Text>
      {hasDelayed && <PendingIndicator />}
    </div>
  );

  const renderFileMessage = () => (
    <div
      className={clsx(
        "relative flex px-4 py-3 rounded-xl items-center gap-3",
        "max-w-full",
        meta._isMyMessage ? (isFailed ? "bg-primary-800" : "bg-primary-600") : "bg-bg-fourth",
        meta._messageBubbleShapeClass,
      )}
    >
      <div className="flex-shrink-0">
        <i
          className={clsx(
            "fa-solid fa-file text-2xl",
            meta._isMyMessage ? "text-text-reverse-main" : "text-text-main",
          )}
        ></i>
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        {" "}
        <Text
          className={clsx(
            "underline cursor-pointer break-all leading-tight",
            meta._isMyMessage ? "text-text-reverse-main" : "text-text-main",
          )}
          onClick={() => window.open(message.media?.[0].url, "_blank")}
          wrap="whitespace-pre-wrap"
        >
          {message.media?.[0].metadata?.name || t("conversations.file")}
        </Text>
        <Text
          className={clsx(
            "text-[10px] text-muted-foreground mt-1",
            meta._isMyMessage ? "text-text-reverse-main" : "text-text-main",
          )}
        >
          {message.media?.[0].metadata?.size
            ? formatFileSize(message.media?.[0].metadata?.size)
            : "Unknown size"}
        </Text>
      </div>
      <button
        className="flex-shrink-0 hover:text-primary transition-colors ml-1"
        onClick={() => {
          const anchor = document.createElement("a");
          anchor.href = message.media?.[0].url || "";
          anchor.download = message.media?.[0].metadata?.name || "file";
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
        }}
      >
        <i
          className={clsx(
            "fa-solid fa-download",
            meta._isMyMessage ? "text-text-reverse-main" : "text-text-main",
          )}
        />
      </button>

      {hasDelayed && <PendingIndicator />}
    </div>
  );

  const renderVideoMessage = () => (
    <VideoMessage
      onFrameClick={() => {
        openMediaViewer({
          id: message.media?.[0].id || "",
          url: message.media?.[0].url!,
          type: MediaType.Video,
          conversationId: conversationId!,
        });
      }}
      onFullscreenToggle={() => {
        openMediaViewer({
          id: message.media?.[0].id || "",
          url: message.media?.[0].url!,
          type: MediaType.Video,
          conversationId: conversationId!,
        });
      }}
      className={meta._messageBubbleShapeClass}
      url={message.media?.[0].url!}
    />
  );

  const renderAudioMessage = () => (
    <AudioMessage
      className={clsx(
        meta._isMyMessage ? (isFailed ? "bg-primary-800" : "bg-primary-600") : "bg-bg-fourth",
        meta._messageBubbleShapeClass,
      )}
      url={message.media?.[0].url!}
      isMyMessage={meta._isMyMessage}
    />
  );

  const renderImageStackMessage = () => (
    <div
      className={clsx(
        "relative h-[200px] w-[110px] flex items-center justify-center cursor-pointer",
        meta._isMyMessage ? "self-end mr-4" : "self-start ml-4",
        meta._messageBubbleShapeClass,
        "[&>img:last-child]:opacity-100",
        "[&>img:nth-last-child(2)]:opacity-80",
        "[&>img:nth-last-child(3)]:opacity-60",
      )}
      onClick={() => {
        openMediaViewer({
          id: stackImage[stackImage.length - 1].id || "",
          url: stackImage[stackImage.length - 1].url,
          type: MediaType.Image,
          conversationId: conversationId!,
        });
      }}
    >
      {stackImage[0] && (
        <img
          src={stackImage[0].url}
          alt="Image 1"
          className={clsx(
            "absolute w-[130px] h-[130px] object-cover shadow-sm rounded-xl",
            "rotate-[-12deg] -translate-x-3 translate-y-1 z-10 transition-transform",
          )}
        />
      )}

      {stackImage[1] && (
        <img
          src={stackImage[1].url}
          alt="Image 2"
          className={clsx(
            "absolute w-[130px] h-[130px] object-cover rounded-xl shadow-md",
            "rotate-[8deg] translate-x-2 -translate-y-1 z-20 transition-transform",
          )}
        />
      )}

      {stackImage[2] && (
        <img
          src={stackImage[2].url}
          alt="Image 3"
          className={clsx(
            "absolute w-[130px] h-[130px] object-cover rounded-xl shadow-lg",
            "rotate-0 z-30 border-2 border-white/50",
          )}
        />
      )}
      {hasDelayed && <PendingIndicator />}
    </div>
  );

  const renderSingleImageMessage = () => (
    <div
      className={clsx("relative rounded-2xl h-fit overflow-hidden", meta._messageBubbleShapeClass)}
    >
      <img
        src={stackImage[0].url}
        alt="Image 1"
        className="w-[200px] h-[200px] object-cover cursor-pointer"
        onClick={() => {
          openMediaViewer({
            id: stackImage[0].id || "",
            url: stackImage[0].url,
            type: MediaType.Image,
            conversationId: conversationId!,
          });
        }}
      />
      {hasDelayed && <PendingIndicator />}
    </div>
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
              !hasAvatar && "invisible",
            )}
            src={message.senderAvatarUrl}
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
                meta._isMyMessage ? "text-right mr-1" : "text-left ml-1",
              )}
            >
              {userInfo?.fullName}
            </Text>
          )}
          {isOnlyEmoji ? renderOnlyEmojiMessage() : null}
          {isTextMessage && !isOnlyEmoji && renderTextMessage()}
          {isFileMessage && renderFileMessage()}
          {isVideoMessage && renderVideoMessage()}
          {isAudioMessage && renderAudioMessage()}
          {isImageMessage && stackImage.length > 1 && renderImageStackMessage()}
          {isImageMessage && stackImage.length === 1 && renderSingleImageMessage()}
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
