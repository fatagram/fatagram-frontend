import clsx from "clsx";
import { Text } from "@/components/atoms";
import PendingIndicator from "./pending-indicator";
import { VideoMessage } from "./video-message";
import { useMediaViewer } from "../../context/media-viewer-context";
import { MediaType, MessageMedia } from "@/types/entities/message.type";
import { useTranslation } from "react-i18next";
import { formatFileSize } from "@/utils/file";
import { AudioMessage } from "./audio-message";

export const renderTextMessage = (
  isMyMessage: boolean,
  isFailed: boolean,
  messageBubbleShapeClass: string,
  content: string,
  hasDelayed: boolean,
) => {
  return (
    <div
      className={clsx(
        "px-3 py-2 break-words rounded-xl shadow-sm relative max-w-full",
        isMyMessage ? (isFailed ? "bg-primary-800" : "bg-primary-600") : "bg-bg-fourth",
        isFailed && "border-red-500 border-2 opacity-50",
        messageBubbleShapeClass,
      )}
    >
      <Text
        sz="md"
        wrap="whitespace-pre-wrap"
        weight="regular"
        className={clsx(isMyMessage ? "text-white " : "text-text-main")}
      >
        {content}
      </Text>
      {hasDelayed && <PendingIndicator />}
    </div>
  );
};

export const renderVideoMessage = (
  media: {
    id: string;
    url: string;
  },
  conversationId: string,
  messageBubbleShapeClass: string,
) => {
  const { onOpen: openMediaViewer } = useMediaViewer();

  return (
    <VideoMessage
      onFrameClick={() => {
        openMediaViewer({
          id: media.id,
          url: media.url,
          type: MediaType.Video,
          conversationId: conversationId,
        });
      }}
      onFullscreenToggle={() => {
        openMediaViewer({
          id: media.id,
          url: media.url,
          type: MediaType.Video,
          conversationId: conversationId,
        });
      }}
      className={clsx(messageBubbleShapeClass, "max-h-[300px] max-w-[350px] rounded-xl")}
      url={media.url}
    />
  );
};

export const renderFileMessage = (
  isMyMessage: boolean,
  isFailed: boolean,
  media: {
    url: string;
    metadata?: {
      name?: string;
      size?: number;
    };
  },
  messageBubbleShapeClass: string,
  hasDelayed: boolean,
) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        "relative flex px-4 py-3 rounded-xl items-center gap-3",
        "max-w-full",
        isMyMessage ? (isFailed ? "bg-primary-800" : "bg-primary-600") : "bg-bg-fourth",
        messageBubbleShapeClass,
      )}
    >
      <div className="flex-shrink-0">
        <i
          className={clsx(
            "fa-solid fa-file text-2xl",
            isMyMessage ? "text-text-reverse-main" : "text-text-main",
          )}
        ></i>
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        {" "}
        <Text
          className={clsx(
            "underline cursor-pointer break-all leading-tight",
            isMyMessage ? "text-text-reverse-main" : "text-text-main",
          )}
          onClick={() => window.open(media.url, "_blank")}
          wrap="whitespace-pre-wrap"
        >
          {media.metadata?.name || t("conversations.file")}
        </Text>
        <Text
          className={clsx(
            "text-[10px] text-muted-foreground mt-1",
            isMyMessage ? "text-text-reverse-main" : "text-text-main",
          )}
        >
          {media.metadata?.size ? formatFileSize(media.metadata?.size) : "Unknown size"}
        </Text>
      </div>
      <button
        className="flex-shrink-0 hover:text-primary transition-colors ml-1"
        onClick={() => {
          const anchor = document.createElement("a");
          anchor.href = media.url || "";
          anchor.download = media.metadata?.name || "file";
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
        }}
      >
        <i
          className={clsx(
            "fa-solid fa-download",
            isMyMessage ? "text-text-reverse-main" : "text-text-main",
          )}
        />
      </button>

      {hasDelayed && <PendingIndicator />}
    </div>
  );
};

export const renderOnlyEmojiMessage = (isMyMessage: boolean, content: string) => (
  <div className={clsx("text-4xl", isMyMessage ? "text-white" : "text-text-main")}>{content}</div>
);

export const renderAudioMessage = (
  isMyMessage: boolean,
  isFailed: boolean,
  media: {
    url: string;
  },
  messageBubbleShapeClass: string,
) => (
  <AudioMessage
    className={clsx(
      isMyMessage ? (isFailed ? "bg-primary-800" : "bg-primary-600") : "bg-bg-fourth",
      messageBubbleShapeClass,
    )}
    url={media.url}
    isMyMessage={isMyMessage}
  />
);

export const renderImageStackMessage = (
  isMyMessage: boolean,
  messageBubbleShapeClass: string,
  stackImage: MessageMedia[] | undefined,
  conversationId: string,
  hasDelayed: boolean,
) => {
  const { onOpen: openMediaViewer } = useMediaViewer();
  if (!stackImage) throw new Error("Stack image is required for rendering image stack message");

  return (
    <div
      className={clsx(
        "relative h-[200px] w-[110px] flex items-center justify-center cursor-pointer",
        isMyMessage ? "self-end mr-4" : "self-start ml-4",
        messageBubbleShapeClass,
        "[&>img:last-child]:opacity-100",
        "[&>img:nth-last-child(2)]:opacity-80",
        "[&>img:nth-last-child(3)]:opacity-60",
        "select-none",
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
};

export const renderSingleImageMessage = (
  image: {
    id: string;
    url: string;
  },
  messageBubbleShapeClass: string,
  conversationId: string,
  hasDelayed: boolean,
) => {
  const { onOpen: openMediaViewer } = useMediaViewer();

  return (
    <div
      className={clsx(
        "relative rounded-2xl h-fit overflow-hidden w-fit",
        "select-none",
        messageBubbleShapeClass,
      )}
    >
      <img
        src={image.url}
        alt="Image"
        className="max-w-full max-h-[330px] w-auto h-auto cursor-pointer"
        onClick={() => {
          openMediaViewer({
            id: image.id || "",
            url: image.url,
            type: MediaType.Image,
            conversationId: conversationId!,
          });
        }}
      />
      {hasDelayed && <PendingIndicator />}
    </div>
  );
};
