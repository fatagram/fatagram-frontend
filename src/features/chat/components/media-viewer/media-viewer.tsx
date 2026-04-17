import { ComponentProps } from "@/components/common/component-type";
import { useMediaViewer } from "../../context/media-viewer-context";
import clsx from "clsx";
import { MiniButton } from "@/components/atoms";
import { ImageView } from "./image-view";
import { VideoView } from "./video-view";
import { useEffect, useState } from "react";

interface MediaViewerProps extends ComponentProps {}

export const MediaViewer: React.FC<MediaViewerProps> = ({ className }) => {
  const { media, onClose } = useMediaViewer();
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!media) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [media, onClose]);

  if (!media) {
    return null;
  }

  const onDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(media.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      const urlPath = new URL(media.url).pathname;
      const fileName =
        urlPath.substring(urlPath.lastIndexOf("/") + 1) ||
        (media.type === "image" ? "image.jpg" : "video.mp4");
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);
    } catch {
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className={clsx("fixed inset-0 z-50 flex items-center justify-center bg-black/80", className)}
      onClick={onClose}
    >
      <MiniButton
        className="absolute top-4 right-16 !text-white hover:!bg-white/20"
        onClick={(event) => {
          event.stopPropagation();
          onDownload();
        }}
        disabled={isDownloading}
      >
        <i className={clsx("fa-solid", isDownloading ? "fa-spinner fa-spin" : "fa-download")} />
      </MiniButton>

      <MiniButton
        className="absolute top-4 right-4 !text-white hover:!bg-white/20"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
      >
        <i className="fa-solid fa-xmark" />
      </MiniButton>

      <div className="px-4" onClick={(event) => event.stopPropagation()}>
        {media.type === "image" ? <ImageView url={media.url} /> : <VideoView url={media.url} />}
      </div>
    </div>
  );
};
