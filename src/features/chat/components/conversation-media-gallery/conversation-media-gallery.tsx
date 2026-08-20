import React, { useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhotoFilm,
  faFileLines,
  faHeadphones,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "@/components/atoms";
import { NotFound } from "@/features/components/not-found";
import { MediaType } from "@/types/entities/message.type";
import { useConversationMedia } from "../../hooks/use-conversation-media";
import { useMediaViewer } from "../../context/media-viewer-context";
import { GalleryImageItem } from "./gallery-image-item";
import { GalleryFileItem } from "./gallery-file-item";
import { GalleryAudioItem } from "./gallery-audio-item";

type TabType = "media" | "files" | "audio";

export interface ConversationMediaGalleryProps {
  conversationId: string;
  className?: string;
  initialTab?: TabType;
}

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
        {fileItems.map((item) => (
          <GalleryFileItem key={item.id || item.url} item={item} />
        ))}
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
          <GalleryAudioItem key={item.id || item.url} item={item} />
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
