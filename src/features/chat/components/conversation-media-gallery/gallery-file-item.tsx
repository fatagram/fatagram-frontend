import React from "react";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { Text } from "@/components/atoms";
import { MessageMediaDto } from "@/api/message/dto/message.dto";
import { formatFileSize } from "@/utils/file";
import { getFileIcon, getMediaFileName } from "@/utils/file-icon";

export interface GalleryFileItemProps {
  item: MessageMediaDto;
  className?: string;
}

export const GalleryFileItem: React.FC<GalleryFileItemProps> = ({ item, className }) => {
  const fileName = getMediaFileName(item.url, item.metadata?.name);
  const fileSize = item.metadata?.size ? formatFileSize(item.metadata.size) : null;
  const { icon, color } = getFileIcon(fileName, item.metadata?.mimeType);

  return (
    <div
      className={clsx(
        "group flex items-center justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-bg-third/30 hover:bg-bg-third/60 border border-border-main/20 hover:border-border-main/50 transition-all duration-150 min-w-0",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        <div
          className={clsx(
            "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs",
            color,
          )}
        >
          <FontAwesomeIcon icon={icon} className="text-base sm:text-lg" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <Text
            sz="sm"
            weight="medium"
            className="text-text-main truncate group-hover:text-primary-500 transition-colors"
            title={fileName}
          >
            {fileName}
          </Text>
          <div className="flex items-center gap-2 text-text-third text-xs mt-0.5 truncate">
            {fileSize && <span>{fileSize}</span>}
            {item.createdAt && (
              <>
                {fileSize && <span>•</span>}
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-bg-fourth/80 hover:bg-primary-500 hover:text-white text-text-third transition-colors cursor-pointer"
          title="Mở trong tab mới"
        >
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
        </a>
        <a
          href={item.url}
          download={fileName}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-primary-500/10 hover:bg-primary-500 hover:text-white text-primary-500 transition-colors cursor-pointer"
          title="Tải xuống"
        >
          <FontAwesomeIcon icon={faDownload} className="text-xs" />
        </a>
      </div>
    </div>
  );
};
