import React from "react";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones, faDownload, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { Text } from "@/components/atoms";
import { MessageMediaDto } from "@/api/message/dto/message.dto";
import { getMediaFileName } from "@/utils/file-icon";
import { formatFileSize } from "@/utils/file";

export interface GalleryAudioItemProps {
  item: MessageMediaDto;
  className?: string;
}

export const GalleryAudioItem: React.FC<GalleryAudioItemProps> = ({ item, className }) => {
  const audioName = getMediaFileName(item.url, item.metadata?.name, "Đoạn ghi âm");
  const fileSize = item.metadata?.size ? formatFileSize(item.metadata.size) : null;

  return (
    <div
      className={clsx(
        "p-2.5 sm:p-3 rounded-xl bg-bg-third/30 border border-border-main/20 flex flex-col gap-2 overflow-hidden w-full min-w-0 transition-colors hover:bg-bg-third/50",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center text-xs shrink-0">
            <FontAwesomeIcon icon={faHeadphones} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <Text
              sz="xs"
              weight="medium"
              className="text-text-main truncate"
              title={audioName}
            >
              {audioName}
            </Text>
            {fileSize && (
              <span className="text-[10px] text-text-third truncate">{fileSize}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {item.createdAt && (
            <span className="text-[11px] text-text-third shrink-0 mr-1">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          )}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-6 h-6 rounded-md flex items-center justify-center bg-bg-fourth/80 hover:bg-primary-500 hover:text-white text-text-third transition-colors cursor-pointer"
            title="Mở trong tab mới"
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
          </a>
          <a
            href={item.url}
            download={audioName}
            className="w-6 h-6 rounded-md flex items-center justify-center bg-primary-500/10 hover:bg-primary-500 hover:text-white text-primary-500 transition-colors cursor-pointer"
            title="Tải xuống"
          >
            <FontAwesomeIcon icon={faDownload} className="text-[10px]" />
          </a>
        </div>
      </div>

      <div className="w-full min-w-0 overflow-hidden rounded-lg bg-bg-fourth/40">
        <audio
          src={item.url}
          controls
          controlsList="nodownload"
          className="w-full max-w-full h-8 block"
        >
          <track kind="captions" />
        </audio>
      </div>
    </div>
  );
};
