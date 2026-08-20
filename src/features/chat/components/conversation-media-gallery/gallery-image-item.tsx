import React, { useState } from "react";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faImage } from "@fortawesome/free-solid-svg-icons";
import { MediaType } from "@/types/entities/message.type";
import { MessageMediaDto } from "@/api/message/dto/message.dto";
import { useMediaBlob } from "@/hooks/use-media-blob";

export interface GalleryImageItemProps {
  item: MessageMediaDto;
  onClick?: () => void;
  className?: string;
}

export const GalleryImageItem: React.FC<GalleryImageItemProps> = ({
  item,
  onClick,
  className,
}) => {
  const isVideo = item.type === MediaType.Video;
  const displayUrl = isVideo ? item.url.replace(/\.[^/.]+$/, ".jpg") : item.url;
  const { blobUrl } = useMediaBlob(displayUrl);
  const [hasError, setHasError] = useState(false);

  return (
    <button
      type="button"
      className={clsx(
        "group relative aspect-square w-full rounded-xl overflow-hidden bg-bg-fourth/40 border border-border-main/30 cursor-pointer shadow-xs select-none p-0 text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-500",
        className,
      )}
      onClick={onClick}
    >
      {hasError ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-bg-third text-text-fourth p-2 text-center">
          <FontAwesomeIcon icon={isVideo ? faPlay : faImage} className="text-xl mb-1 opacity-50" />
          <span className="text-[10px] truncate max-w-full text-text-third">
            {isVideo ? "Video" : "Hình ảnh"}
          </span>
        </div>
      ) : (
        <img
          src={blobUrl || displayUrl}
          alt="Media item"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
      )}

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-150 pointer-events-none" />

      {/* Video badge */}
      {isVideo && (
        <div className="absolute bottom-1.5 left-1.5 z-10 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/60 backdrop-blur-xs text-white shadow-sm">
          <FontAwesomeIcon icon={faPlay} className="text-[9px] sm:text-[10px] pl-[1px]" />
        </div>
      )}
    </button>
  );
};
