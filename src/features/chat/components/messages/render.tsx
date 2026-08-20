import clsx from "clsx";
import { Text, Skeleton } from "@/components/atoms";
import React, { useState } from "react";
import PendingIndicator from "./pending-indicator";
import { VideoMessage } from "./video-message";
import { useMediaViewer } from "../../context/media-viewer-context";
import { MediaType, MessageMedia } from "@/types/entities/message.type";
import { useTranslation } from "react-i18next";
import { formatFileSize } from "@/utils/file";
import { AudioMessage } from "./audio-message";
import { useMediaBlob } from "@/hooks/use-media-blob";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faDownload } from "@fortawesome/free-solid-svg-icons";
import { getFileIcon, getMediaFileName } from "@/utils/file-icon";

export const MediaBlobImage: React.FC<{
  url: string;
  className?: string;
  alt?: string;
  onClick?: () => void;
  onLoad?: () => void;
  style?: React.CSSProperties;
}> = ({ url, className, alt = "", onClick, onLoad, style }) => {
  const { blobUrl } = useMediaBlob(url);
  const imgElememt = (
    <img src={blobUrl || url} className={className} alt={alt} onLoad={onLoad} style={style} />
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={className}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "inline-block",
          ...style,
        }}
      >
        {imgElememt}
      </button>
    );
  }

  return imgElememt;
};

export const TextMessageItem: React.FC<{
  isMyMessage: boolean;
  isFailed: boolean;
  messageBubbleShapeClass: string;
  content: string;
  hasDelayed: boolean;
}> = ({ isMyMessage, isFailed, messageBubbleShapeClass, content, hasDelayed }) => {
  const colorBgPrimary = isFailed ? "bg-primary-800" : "bg-primary-600";
  return (
    <div
      className={clsx(
        "px-3 py-2 break-words rounded-xl shadow-sm relative max-w-full",
        isMyMessage ? colorBgPrimary : "bg-bg-fourth",
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

export const VideoMessageItem: React.FC<{
  media: {
    id: string;
    url: string;
  };
  conversationId: string;
  messageBubbleShapeClass: string;
}> = ({ media, conversationId, messageBubbleShapeClass }) => {
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

  const handleOpenViewer = () => {
    openMediaViewer({
      id: media.id,
      url: media.url,
      type: MediaType.Video,
      conversationId: conversationId,
    });
  };

  return (
    <button
      type="button"
      tabIndex={0}
      className={clsx(
        "relative rounded-2xl overflow-hidden bg-bg-fourth/50 cursor-pointer",
        "select-none w-full max-w-[280px] h-[200px]",
        messageBubbleShapeClass,
      )}
      onClick={handleOpenViewer}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpenViewer();
        }
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>
      )}
      <MediaBlobImage
        url={thumbnailUrl}
        alt="Video Thumbnail"
        onLoad={() => setIsLoaded(true)}
        className="w-full h-full object-cover"
        style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.2s" }}
      />
      {isLoaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-auto">
          <button
            type="button"
            aria-label="Play video"
            className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm shadow-md hover:bg-primary-500/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsInlinePlaying(true);
            }}
          >
            <FontAwesomeIcon icon={faPlay} className="text-xl pl-[3px]" />
          </button>
        </div>
      )}
    </button>
  );
};

export const FileMessageItem: React.FC<{
  isMyMessage: boolean;
  isFailed: boolean;
  media: {
    url: string;
    metadata?: {
      name?: string;
      size?: number;
      mimeType?: string;
    };
  };
  messageBubbleShapeClass: string;
  hasDelayed: boolean;
}> = ({ isMyMessage, isFailed, media, messageBubbleShapeClass, hasDelayed }) => {
  const { t } = useTranslation();
  const fileName = getMediaFileName(
    media.url,
    media.metadata?.name,
    t("conversations.file", "Tập tin"),
  );
  const { icon } = getFileIcon(fileName, media.metadata?.mimeType);
  const colorBgPrimary = isFailed ? "bg-primary-800" : "bg-primary-600";

  return (
    <div
      className={clsx(
        "relative flex px-4 py-3 rounded-xl items-center gap-3",
        "max-w-full",
        isMyMessage ? colorBgPrimary : "bg-bg-fourth",
        messageBubbleShapeClass,
      )}
    >
      <div className="flex-shrink-0">
        <FontAwesomeIcon
          icon={icon}
          className={clsx("text-2xl", isMyMessage ? "text-text-reverse-main" : "text-text-main")}
        />
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <a
          href={media.url}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            "underline cursor-pointer break-all leading-tight text-sm font-medium",
            isMyMessage ? "text-text-reverse-main" : "text-text-main",
          )}
        >
          {fileName}
        </a>
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
        type="button"
        aria-label="Download file"
        className="flex-shrink-0 hover:text-primary transition-colors ml-1"
        onClick={() => {
          const anchor = document.createElement("a");
          anchor.href = media.url || "";
          anchor.download = fileName;
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
        }}
      >
        <FontAwesomeIcon
          icon={faDownload}
          className={clsx(isMyMessage ? "text-text-reverse-main" : "text-text-main")}
        />
      </button>

      {hasDelayed && <PendingIndicator />}
    </div>
  );
};

export const OnlyEmojiMessageItem: React.FC<{
  isMyMessage: boolean;
  content: string;
}> = ({ isMyMessage, content }) => (
  <div
    className={clsx(
      "text-4xl break-words select-text w-full",
      isMyMessage ? "text-text-main text-right self-end" : "text-text-main text-left self-start",
    )}
  >
    {content}
  </div>
);

export const AudioMessageItem: React.FC<{
  isMyMessage: boolean;
  isFailed: boolean;
  media: {
    url: string;
  };
  messageBubbleShapeClass: string;
}> = ({ isMyMessage, isFailed, media, messageBubbleShapeClass }) => {
  const colorBgPrimary = isFailed ? "bg-primary-800" : "bg-primary-600";

  return (
    <AudioMessage
      className={clsx(isMyMessage ? colorBgPrimary : "bg-bg-fourth", messageBubbleShapeClass)}
      url={media.url}
      isMyMessage={isMyMessage}
    />
  );
};

export const ImageStackMessageItem: React.FC<{
  isMyMessage: boolean;
  messageBubbleShapeClass: string;
  stackImage: MessageMedia[] | undefined;
  conversationId: string;
  hasDelayed: boolean;
}> = ({ isMyMessage, messageBubbleShapeClass, stackImage, conversationId, hasDelayed }) => {
  const { onOpen: openMediaViewer } = useMediaViewer();
  if (!stackImage) return null;

  const handleOpenViewer = () => {
    openMediaViewer({
      id: stackImage.at(-1)?.id || "",
      url: stackImage.at(-1)?.url || "",
      type: MediaType.Image,
      conversationId: conversationId,
    });
  };

  return (
    <button
      type="button"
      tabIndex={0}
      className={clsx(
        "relative h-[200px] w-[110px] flex items-center justify-center cursor-pointer",
        isMyMessage ? "self-end mr-4" : "self-start ml-4",
        messageBubbleShapeClass,
        "[&>img:last-child]:opacity-100",
        "[&>img:nth-last-child(2)]:opacity-80",
        "[&>img:nth-last-child(3)]:opacity-60",
        "select-none",
      )}
      onClick={handleOpenViewer}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpenViewer();
        }
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
    </button>
  );
};

export const SingleImageMessageItem: React.FC<{
  image: {
    id: string;
    url: string;
    width?: number;
    height?: number;
  };
  messageBubbleShapeClass: string;
  conversationId: string;
  hasDelayed: boolean;
}> = ({ image, messageBubbleShapeClass, conversationId, hasDelayed }) => {
  const { onOpen: openMediaViewer } = useMediaViewer();
  const [isLoaded, setIsLoaded] = useState(false);

  const hasDimensions = image.width && image.height;
  const containerStyle = hasDimensions
    ? { aspectRatio: `${image.width}/${image.height}`, maxWidth: "300px", width: "100%" }
    : { width: "240px", height: "200px" };

  const handleOpenViewer = () => {
    openMediaViewer({
      id: image.id || "",
      url: image.url,
      type: MediaType.Image,
      conversationId: conversationId,
    });
  };

  return (
    <button
      type="button"
      tabIndex={0}
      className={clsx(
        "relative rounded-2xl overflow-hidden bg-bg-fourth/50",
        "select-none cursor-pointer",
        messageBubbleShapeClass,
      )}
      style={containerStyle}
      onClick={handleOpenViewer}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpenViewer();
        }
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>
      )}
      <MediaBlobImage
        url={image.url}
        alt="Image"
        onLoad={() => setIsLoaded(true)}
        className="w-full h-full object-contain"
        style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.2s" }}
      />
      {hasDelayed && <PendingIndicator />}
    </button>
  );
};

export const GifMessageItem: React.FC<{
  gif: { id?: string; url: string };
  messageBubbleShapeClass: string;
  conversationId: string;
  hasDelayed: boolean;
}> = ({ gif, messageBubbleShapeClass, conversationId, hasDelayed }) => {
  const { onOpen: openMediaViewer } = useMediaViewer();
  const [isLoaded, setIsLoaded] = useState(false);

  const handleOpenViewer = () => {
    openMediaViewer({
      id: gif.id || "",
      url: gif.url,
      type: MediaType.Gif,
      conversationId: conversationId,
    });
  };

  return (
    <button
      type="button"
      tabIndex={0}
      className={clsx(
        "relative rounded-2xl overflow-hidden bg-bg-fourth/50",
        "select-none w-full max-w-[280px] h-[200px] cursor-pointer",
        messageBubbleShapeClass,
      )}
      onClick={handleOpenViewer}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpenViewer();
        }
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>
      )}
      <MediaBlobImage
        url={gif.url}
        alt="GIF"
        className="w-full h-full object-contain"
        onLoad={() => setIsLoaded(true)}
        style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.2s" }}
      />
      {hasDelayed && <PendingIndicator />}
    </button>
  );
};


