import React, { useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhotoFilm,
  faFileLines,
  faPlay,
  faDownload,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFileZipper,
  faFileCode,
  faFileAudio,
  faFile,
  faArrowUpRightFromSquare,
  faHeadphones,
  faSpinner,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { Text, Skeleton } from "@/components/atoms";
import { NotFound } from "@/features/components/not-found";
import { MediaType } from "@/types/entities/message.type";
import { MessageMediaDto } from "@/api/message/dto/message.dto";
import { useConversationMedia } from "../../hooks/use-conversation-media";
import { useMediaViewer } from "../../context/media-viewer-context";
import { useMediaBlob } from "@/hooks/use-media-blob";
import { formatFileSize } from "@/utils/file";

type TabType = "media" | "files" | "audio";

interface ConversationMediaGalleryProps {
  conversationId: string;
  className?: string;
  initialTab?: TabType;
}

const getFileIcon = (fileName: string, mimeType?: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  if (["pdf"].includes(ext) || mimeType?.includes("pdf")) {
    return { icon: faFilePdf, color: "text-red-500 bg-red-500/10" };
  }
  if (["doc", "docx"].includes(ext) || mimeType?.includes("word")) {
    return { icon: faFileWord, color: "text-blue-500 bg-blue-500/10" };
  }
  if (
    ["xls", "xlsx", "csv"].includes(ext) ||
    mimeType?.includes("sheet") ||
    mimeType?.includes("excel")
  ) {
    return { icon: faFileExcel, color: "text-emerald-500 bg-emerald-500/10" };
  }
  if (
    ["zip", "rar", "7z", "tar", "gz"].includes(ext) ||
    mimeType?.includes("zip") ||
    mimeType?.includes("compressed")
  ) {
    return { icon: faFileZipper, color: "text-amber-500 bg-amber-500/10" };
  }
  if (["js", "ts", "jsx", "tsx", "html", "css", "json", "py", "cpp", "cs", "java"].includes(ext)) {
    return { icon: faFileCode, color: "text-purple-500 bg-purple-500/10" };
  }
  if (["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(ext) || mimeType?.includes("audio")) {
    return { icon: faFileAudio, color: "text-pink-500 bg-pink-500/10" };
  }
  return { icon: faFile, color: "text-text-third bg-bg-fourth" };
};

const getFileName = (item: MessageMediaDto) => {
  if (item.metadata?.name) return item.metadata.name;
  try {
    const parts = item.url.split("/");
    const rawName = parts[parts.length - 1] || "Tập tin";
    return decodeURIComponent(rawName.split("?")[0]);
  } catch {
    return "Tập tin";
  }
};

const GalleryImageItem: React.FC<{
  item: MessageMediaDto;
  onClick: () => void;
}> = ({ item, onClick }) => {
  const isVideo = item.type === MediaType.Video;
  const displayUrl = isVideo ? item.url.replace(/\.[^/.]+$/, ".jpg") : item.url;
  const { blobUrl } = useMediaBlob(displayUrl);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="group relative aspect-square rounded-xl overflow-hidden bg-bg-fourth/40 border border-border-main/30 cursor-pointer shadow-xs select-none"
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
    </div>
  );
};

export const ConversationMediaGallery: React.FC<ConversationMediaGalleryProps> = ({
  conversationId,
  className,
  initialTab = "media",
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const { onOpen: openMediaViewer } = useMediaViewer();

  // Tab 1: Media (Image, Video, Gif)
  const mediaFilter = useMemo(() => [MediaType.Image, MediaType.Video, MediaType.Gif], []);
  const {
    mediaList: mediaItems,
    isLoading: isLoadingMedia,
    isFetchingNextPage: isFetchingNextMedia,
    hasNextPage: hasNextMedia,
    fetchNextPage: fetchNextMedia,
  } = useConversationMedia(conversationId, { types: mediaFilter, limit: 30 });

  // Tab 2: Files (File, Other)
  const filesFilter = useMemo(() => [MediaType.File, MediaType.Other], []);
  const {
    mediaList: fileItems,
    isLoading: isLoadingFiles,
    isFetchingNextPage: isFetchingNextFiles,
    hasNextPage: hasNextFiles,
    fetchNextPage: fetchNextFiles,
  } = useConversationMedia(conversationId, { types: filesFilter, limit: 30 });

  // Tab 3: Audio (Audio)
  const audioFilter = useMemo(() => [MediaType.Audio], []);
  const {
    mediaList: audioItems,
    isLoading: isLoadingAudio,
    isFetchingNextPage: isFetchingNextAudio,
    hasNextPage: hasNextAudio,
    fetchNextPage: fetchNextAudio,
  } = useConversationMedia(conversationId, { types: audioFilter, limit: 30 });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle infinite scroll on bottom reach
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollHeight - scrollTop - clientHeight < 150) {
      if (activeTab === "media" && hasNextMedia && !isFetchingNextMedia) {
        fetchNextMedia();
      } else if (activeTab === "files" && hasNextFiles && !isFetchingNextFiles) {
        fetchNextFiles();
      } else if (activeTab === "audio" && hasNextAudio && !isFetchingNextAudio) {
        fetchNextAudio();
      }
    }
  };

  const renderMediaContent = () => {
    if (isLoadingMedia) {
      return (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>
      );
    }

    if (mediaItems.length === 0) {
      return (
        <NotFound
          icon={<FontAwesomeIcon icon={faPhotoFilm} />}
          title={t("common:conversations.mediaGallery.noMediaTitle", "Chưa có file phương tiện")}
          description={t(
            "common:conversations.mediaGallery.noMediaDescription",
            "Hình ảnh và video được chia sẻ trong đoạn chat này sẽ xuất hiện tại đây.",
          )}
        />
      );
    }

    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
        {mediaItems.map((item) => (
          <GalleryImageItem
            key={item.id || item.url}
            item={item}
            onClick={() => {
              openMediaViewer({
                id: item.id || item.url,
                url: item.url,
                type: item.type,
                conversationId,
              });
            }}
          />
        ))}
      </div>
    );
  };

  const renderFilesContent = () => {
    if (isLoadingFiles) {
      return (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-bg-third/40">
              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
              <div className="flex-1 flex flex-col gap-1.5">
                <Skeleton className="w-3/4 h-4 rounded" />
                <Skeleton className="w-1/4 h-3 rounded" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (fileItems.length === 0) {
      return (
        <NotFound
          icon={<FontAwesomeIcon icon={faFileLines} />}
          title={t("common:conversations.mediaGallery.noFilesTitle", "Chưa có file hay tài liệu")}
          description={t(
            "common:conversations.mediaGallery.noFilesDescription",
            "Các tập tin PDF, Word, Excel, nén, v.v. được gửi trong đoạn chat sẽ xuất hiện ở đây.",
          )}
        />
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {fileItems.map((item) => {
          const fileName = getFileName(item);
          const fileSize = item.metadata?.size
            ? formatFileSize(item.metadata.size)
            : null;
          const { icon, color } = getFileIcon(fileName, item.metadata?.mimeType);

          return (
            <div
              key={item.id || item.url}
              className="group flex items-center justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-bg-third/30 hover:bg-bg-third/60 border border-border-main/20 hover:border-border-main/50 transition-all duration-150 min-w-0"
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
        })}
      </div>
    );
  };

  const renderAudioContent = () => {
    if (isLoadingAudio) {
      return (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-bg-third/40">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex-1 flex flex-col gap-1.5">
                <Skeleton className="w-1/2 h-4 rounded" />
                <Skeleton className="w-full h-8 rounded" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (audioItems.length === 0) {
      return (
        <NotFound
          icon={<FontAwesomeIcon icon={faHeadphones} />}
          title={t("common:conversations.mediaGallery.noAudioTitle", "Chưa có đoạn ghi âm")}
          description={t(
            "common:conversations.mediaGallery.noAudioDescription",
            "Các đoạn ghi âm và file âm thanh được chia sẻ sẽ xuất hiện tại đây.",
          )}
        />
      );
    }

    return (
      <div className="flex flex-col gap-2.5">
        {audioItems.map((item) => (
          <div
            key={item.id || item.url}
            className="p-2.5 sm:p-3 rounded-xl bg-bg-third/30 border border-border-main/20 flex flex-col gap-2 overflow-hidden w-full min-w-0"
          >
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center text-xs shrink-0">
                  <FontAwesomeIcon icon={faHeadphones} />
                </div>
                <Text
                  sz="xs"
                  weight="medium"
                  className="text-text-second truncate"
                  title={item.metadata?.name || "Đoạn ghi âm"}
                >
                  {item.metadata?.name || "Đoạn ghi âm"}
                </Text>
              </div>
              {item.createdAt && (
                <span className="text-[11px] text-text-third shrink-0">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="w-full min-w-0 overflow-hidden rounded-lg bg-bg-fourth/40">
              <audio
                src={item.url}
                controls
                controlsList="nodownload"
                className="w-full max-w-full h-8 block"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={clsx("flex flex-col h-full w-full select-none overflow-hidden", className)}>
      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-bg-third/40 rounded-xl border border-border-main/20 shrink-0 mb-3">
        <button
          type="button"
          onClick={() => setActiveTab("media")}
          className={clsx(
            "flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-1.5 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer",
            activeTab === "media"
              ? "bg-bg-second text-primary-500 shadow-sm border border-border-main/40"
              : "text-text-third hover:text-text-main hover:bg-bg-fourth/40",
          )}
        >
          <FontAwesomeIcon icon={faPhotoFilm} className="text-xs sm:text-sm shrink-0" />
          <span className="truncate">{t("common:conversations.mediaGallery.mediaTab", "File phương tiện")}</span>
          {mediaItems.length > 0 && (
            <span className="shrink-0 text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full bg-bg-fourth text-text-third font-medium leading-none">
              {mediaItems.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("files")}
          className={clsx(
            "flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-1.5 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer",
            activeTab === "files"
              ? "bg-bg-second text-primary-500 shadow-sm border border-border-main/40"
              : "text-text-third hover:text-text-main hover:bg-bg-fourth/40",
          )}
        >
          <FontAwesomeIcon icon={faFileLines} className="text-xs sm:text-sm shrink-0" />
          <span className="truncate">{t("common:conversations.mediaGallery.filesTab", "File & Tài liệu")}</span>
          {fileItems.length > 0 && (
            <span className="shrink-0 text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full bg-bg-fourth text-text-third font-medium leading-none">
              {fileItems.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("audio")}
          className={clsx(
            "flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-1.5 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer",
            activeTab === "audio"
              ? "bg-bg-second text-primary-500 shadow-sm border border-border-main/40"
              : "text-text-third hover:text-text-main hover:bg-bg-fourth/40",
          )}
        >
          <FontAwesomeIcon icon={faHeadphones} className="text-xs sm:text-sm shrink-0" />
          <span className="truncate">{t("common:conversations.mediaGallery.audioTab", "Âm thanh")}</span>
          {audioItems.length > 0 && (
            <span className="shrink-0 text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full bg-bg-fourth text-text-third font-medium leading-none">
              {audioItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Content Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-0.5"
      >
        {/* TAB 1: MEDIA (IMAGES & VIDEOS) */}
        {activeTab === "media" && (
          <div>
            {renderMediaContent()}
            {isFetchingNextMedia && (
              <div className="flex items-center justify-center py-4 text-primary-500">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-lg" />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FILES & DOCUMENTS */}
        {activeTab === "files" && (
          <div>
            {renderFilesContent()}
            {isFetchingNextFiles && (
              <div className="flex items-center justify-center py-4 text-primary-500">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-lg" />
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AUDIO & VOICE NOTES */}
        {activeTab === "audio" && (
          <div>
            {renderAudioContent()}
            {isFetchingNextAudio && (
              <div className="flex items-center justify-center py-4 text-primary-500">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-lg" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
