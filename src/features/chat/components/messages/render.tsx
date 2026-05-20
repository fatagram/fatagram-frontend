import clsx from "clsx";
import { Text, Skeleton } from "@/components/atoms";
import { useState } from "react";
import PendingIndicator from "./pending-indicator";
import { VideoMessage } from "./video-message";
import { useMediaViewer } from "../../context/media-viewer-context";
import { MediaType, MessageMedia } from "@/types/entities/message.type";
import { useTranslation } from "react-i18next";
import { formatFileSize } from "@/utils/file";
import { AudioMessage } from "./audio-message";
import { useMediaBlob } from "@/hooks/use-media-blob";

export const MediaBlobImage = ({ url, className, alt, onClick, onLoad, style }: any) => {
  const { blobUrl } = useMediaBlob(url);
  return (
    <img
      src={blobUrl || url}
      className={className}
      alt={alt}
      onClick={onClick}
      onLoad={onLoad}
      style={style}
    />
  );
};

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInlinePlaying, setIsInlinePlaying] = useState(false);

  if (isInlinePlaying) {
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
  }

  const thumbnailUrl = media.url.replace(/\.[^/.]+$/, ".jpg");

  return (
    <div
      className={clsx(
        "relative rounded-2xl overflow-hidden flex items-center justify-center bg-bg-fourth/50 cursor-pointer",
        "select-none w-fit max-w-full h-auto",
        messageBubbleShapeClass,
      )}
      onClick={() => {
        openMediaViewer({
          id: media.id,
          url: media.url,
          type: MediaType.Video,
          conversationId: conversationId,
        });
      }}
    >
      {!isLoaded && (
        <div className="w-40 h-40 z-0">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>
      )}
      <MediaBlobImage
        url={thumbnailUrl}
        alt="Video Thumbnail"
        onLoad={() => setIsLoaded(true)}
        className={clsx(
          "max-w-full max-h-[330px] w-auto h-auto transition-opacity duration-300 z-10 relative object-contain",
          isLoaded ? "opacity-100 block" : "opacity-0 hidden",
        )}
      />
      {isLoaded && (
        <div className="absolute z-20 pointer-events-auto">
          <div
            className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm shadow-md hover:bg-primary-500/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsInlinePlaying(true);
            }}
          >
            <i className="fa-solid fa-play text-xl pl-[3px]" />
          </div>
        </div>
      )}
    </div>
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
  <div
    className={clsx(
      "text-4xl break-words select-text w-full",
      isMyMessage ? "text-text-main text-right self-end" : "text-text-main text-left self-start",
    )}
  >
    {content}
  </div>
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
        <MediaBlobImage
          url={stackImage[0].url}
          alt="Image 1"
          className={clsx(
            "absolute w-[130px] h-[130px] object-cover shadow-sm rounded-xl",
            "rotate-[-12deg] -translate-x-3 translate-y-1 z-10 transition-transform",
          )}
        />
      )}

      {stackImage[1] && (
        <MediaBlobImage
          url={stackImage[1].url}
          alt="Image 2"
          className={clsx(
            "absolute w-[130px] h-[130px] object-cover rounded-xl shadow-md",
            "rotate-[8deg] translate-x-2 -translate-y-1 z-20 transition-transform",
          )}
        />
      )}

      {stackImage[2] && (
        <MediaBlobImage
          url={stackImage[2].url}
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
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={clsx(
        "relative rounded-2xl overflow-hidden flex items-center justify-center bg-bg-fourth/50",
        "select-none w-fit max-w-full h-auto",
        messageBubbleShapeClass,
      )}
    >
      {!isLoaded && (
        <div className="w-40 h-40 z-0">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>
      )}
      <MediaBlobImage
        url={image.url}
        alt="Image"
        onLoad={() => setIsLoaded(true)}
        className={clsx(
          "max-w-full max-h-[330px] w-auto h-auto cursor-pointer transition-opacity duration-300 z-10 relative object-contain",
          isLoaded ? "opacity-100 block" : "opacity-0 hidden",
        )}
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

export const renderGifMessage = (
  gif: { id?: string; url: string },
  messageBubbleShapeClass: string,
  conversationId: string,
  hasDelayed: boolean,
) => {
  const { onOpen: openMediaViewer } = useMediaViewer();
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={clsx(
        "relative rounded-2xl overflow-hidden flex items-center justify-center bg-bg-fourth/50",
        "select-none w-fit max-w-full h-auto",
        messageBubbleShapeClass,
      )}
    >
      {!isLoaded && (
        <div className="w-40 h-40 z-0">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>
      )}
      <MediaBlobImage
        url={gif.url}
        alt="GIF"
        className={clsx(
          "max-w-full max-h-[330px] w-auto h-auto cursor-pointer transition-opacity duration-300 z-10 relative object-contain",
          isLoaded ? "opacity-100 block" : "opacity-0 hidden",
        )}
        onLoad={() => {
          setIsLoaded(true);
        }}
        onClick={() => {
          openMediaViewer({
            id: gif.id || "",
            url: gif.url,
            type: MediaType.Gif,
            conversationId: conversationId!,
          });
        }}
      />
      {hasDelayed && <PendingIndicator />}
    </div>
  );
};
