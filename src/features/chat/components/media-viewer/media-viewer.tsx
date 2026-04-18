import { useCallback, useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import { useMediaViewer } from "../../context/media-viewer-context";
import clsx from "clsx";
import { MiniButton } from "@/components/atoms";
import { ImageView } from "./image-view";
import { VideoView } from "./video-view";
import { useMediaAround, useMediaAroundAnchor } from "@/features/hooks/use-conversation";
import { ComponentProps } from "@/components/common/component-type";
import { MediaType } from "@/types/entities/message.type";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/swiper-bundle.css";

interface MediaViewerProps extends ComponentProps {}

const PREFETCH_DISTANCE = 3;
const FETCH_BATCH_SIZE = 10;

export const MediaViewer: React.FC<MediaViewerProps> = ({ className }) => {
  const { conversationId, media, onClose } = useMediaViewer();
  type ViewerMedia = NonNullable<typeof media>;

  const [activeMedia, setActiveMedia] = useState(media);
  const [isDownloading, setIsDownloading] = useState(false);
  const [leftMedia, setLeftMedia] = useState<ViewerMedia[]>([]);
  const [rightMedia, setRightMedia] = useState<ViewerMedia[]>([]);

  const isFetchingLeft = useRef(false);
  const isFetchingRight = useRef(false);

  const [canFetchLeft, setCanFetchLeft] = useState(true);
  const [canFetchRight, setCanFetchRight] = useState(true);

  const swiperRef = useRef<SwiperType | null>(null);
  const initializedAnchor = useRef<string | null>(null);

  const thumbnailRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { data: mediaAroundAnchor } = useMediaAroundAnchor(conversationId || "", media?.id || "");
  const { fetch: fetchMediaAround } = useMediaAround();

  const mergeUniqueMedia = useCallback((items: ViewerMedia[]) => {
    const map = new Map<string, ViewerMedia>();
    items.forEach((item) => {
      map.set(item.id || item.url, item);
    });
    return Array.from(map.values());
  }, []);

  useEffect(() => {
    if (mediaAroundAnchor && media?.id && initializedAnchor.current !== media.id) {
      setLeftMedia((mediaAroundAnchor.left || []) as ViewerMedia[]);
      setRightMedia((mediaAroundAnchor.right || []) as ViewerMedia[]);
      setCanFetchLeft(true);
      setCanFetchRight(true);
      initializedAnchor.current = media.id;
    }
  }, [mediaAroundAnchor, media?.id]);

  const allMedia = useMemo(() => {
    if (!media) return [];
    const combined = [...leftMedia, media, ...rightMedia];
    return mergeUniqueMedia(combined);
  }, [leftMedia, media, mergeUniqueMedia, rightMedia]);

  const activeIndex = allMedia.findIndex(
    (m) => (m.id || m.url) === (activeMedia?.id || activeMedia?.url),
  );

  const handlePrev = (e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation();
    swiperRef.current?.slidePrev();
  };

  const handleNext = (e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation();
    swiperRef.current?.slideNext();
  };

  const handleSlideChange = (swiper: SwiperType) => {
    const currentMedia = allMedia[swiper.activeIndex];
    if (currentMedia) {
      setActiveMedia(currentMedia);
    }
  };

  const prefetchRight = useCallback(async () => {
    if (!conversationId || isFetchingRight.current || !canFetchRight || allMedia.length === 0)
      return;

    const lastMedia = allMedia[allMedia.length - 1];
    if (!lastMedia?.id) return;

    isFetchingRight.current = true;
    try {
      await fetchMediaAround(
        {
          conversationId,
          mediaId: lastMedia.id,
          config: { limit: FETCH_BATCH_SIZE, before: false },
        },
        {
          onSuccess: (fetchedMedia) => {
            const fetched = fetchedMedia || [];
            if (fetched.length === 0) {
              setCanFetchRight(false);
              return;
            }
            setRightMedia((prev) => mergeUniqueMedia([...prev, ...fetched]));
            if (fetched.length < FETCH_BATCH_SIZE) {
              setCanFetchRight(false);
            }
          },
        },
      );
    } finally {
      isFetchingRight.current = false;
    }
  }, [allMedia, canFetchRight, conversationId, fetchMediaAround, mergeUniqueMedia]);

  const prefetchLeft = useCallback(async () => {
    if (!conversationId || isFetchingLeft.current || !canFetchLeft || allMedia.length === 0) return;

    const firstMedia = allMedia[0];
    if (!firstMedia?.id) return;

    isFetchingLeft.current = true;
    try {
      await fetchMediaAround(
        {
          conversationId,
          mediaId: firstMedia.id,
          config: { limit: FETCH_BATCH_SIZE, before: true },
        },
        {
          onSuccess: (fetchedMedia) => {
            const fetched = fetchedMedia || [];
            if (fetched.length === 0) {
              setCanFetchLeft(false);
              return;
            }
            setLeftMedia((prev) => mergeUniqueMedia([...fetched, ...prev]));
            if (fetched.length < FETCH_BATCH_SIZE) {
              setCanFetchLeft(false);
            }
          },
        },
      );
    } finally {
      isFetchingLeft.current = false;
    }
  }, [allMedia, canFetchLeft, conversationId, fetchMediaAround, mergeUniqueMedia]);

  useEffect(() => {
    setActiveMedia(media);
  }, [media]);

  useEffect(() => {
    if (!activeMedia) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft") handlePrev(event);
      else if (event.key === "ArrowRight") handleNext(event);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMedia, onClose]);

  // Sync Swiper
  useLayoutEffect(() => {
    if (swiperRef.current && activeIndex !== -1) {
      swiperRef.current.slideTo(activeIndex, 0, false);
    }
  }, [allMedia.length, activeIndex]);

  // Auto-scroll Filmstrip (Thumbnails)
  useEffect(() => {
    if (!activeMedia?.id) return;

    const activeThumbEl = thumbnailRefs.current[activeMedia.id];
    if (activeThumbEl) {
      requestAnimationFrame(() => {
        activeThumbEl.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      });
    }
  }, [activeMedia?.id, allMedia.length]);

  useEffect(() => {
    if (activeIndex < 0 || allMedia.length === 0) return;

    const distanceToStart = activeIndex;
    const distanceToEnd = allMedia.length - 1 - activeIndex;

    if (distanceToEnd < PREFETCH_DISTANCE && canFetchRight && !isFetchingRight.current) {
      void prefetchRight();
    }

    if (distanceToStart < PREFETCH_DISTANCE && canFetchLeft && !isFetchingLeft.current) {
      void prefetchLeft();
    }
  }, [activeIndex, allMedia.length, canFetchLeft, canFetchRight, prefetchLeft, prefetchRight]);

  if (!activeMedia) return null;

  const onDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(activeMedia.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      const urlPath = new URL(activeMedia.url).pathname;
      const fileName =
        urlPath.substring(urlPath.lastIndexOf("/") + 1) ||
        (activeMedia.type === MediaType.Image ? "image.jpg" : "video.mp4");
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);
    } catch {
      console.error("Failed to download media");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md transition-opacity overscroll-none touch-none",
        className,
      )}
      onClick={onClose}
    >
      <div
        className="flex h-16 w-full items-center justify-end px-6 shrink-0 bg-gradient-to-b from-black/60 to-transparent z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <MiniButton
            className="!text-white/70 hover:!text-white hover:!bg-white/10 transition-colors"
            onClick={onDownload}
            disabled={isDownloading}
            title="Download"
          >
            <i
              className={clsx(
                "fa-solid text-xl",
                isDownloading ? "fa-spinner fa-spin" : "fa-download",
              )}
            />
          </MiniButton>

          <MiniButton
            className="!text-white/70 hover:!text-white hover:!bg-white/10 transition-colors"
            onClick={onClose}
            title="Close (Esc)"
          >
            <i className="fa-solid fa-xmark text-2xl" />
          </MiniButton>
        </div>
      </div>

      <div className="relative flex flex-1 min-h-0 items-center justify-center overflow-hidden w-full">
        <button
          className={clsx(
            "absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full transition-all hidden md:block",
            activeIndex > 0
              ? "text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
              : "text-white/10 cursor-not-allowed opacity-50",
          )}
          onClick={handlePrev}
          disabled={activeIndex <= 0}
        >
          <i className="fa-solid fa-chevron-left text-3xl" />
        </button>

        <div className="h-full w-full" onClick={(e) => e.stopPropagation()}>
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={handleSlideChange}
            initialSlide={activeIndex}
            spaceBetween={20}
            slidesPerView={1}
            grabCursor={true}
            className="w-full h-full"
          >
            {allMedia.map((m) => (
              <SwiperSlide key={m.id} className="h-full w-full">
                <div className="flex h-full w-full items-center justify-center px-4 py-2 md:px-6 md:py-4">
                  {m.type === MediaType.Image ? (
                    <ImageView
                      url={m.url}
                      className="max-h-full max-w-full object-contain rounded-md select-none"
                    />
                  ) : (
                    <VideoView url={m.url} className="max-h-full max-w-full rounded-md" />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <button
          className={clsx(
            "absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full transition-all hidden md:block",
            activeIndex < allMedia.length - 1
              ? "text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
              : "text-white/10 cursor-not-allowed opacity-50",
          )}
          onClick={handleNext}
          disabled={activeIndex >= allMedia.length - 1}
        >
          <i className="fa-solid fa-chevron-right text-3xl" />
        </button>
      </div>

      <div
        className="hidden w-full shrink-0 items-center justify-center bg-black/40 px-4 md:flex z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-[960px] overflow-x-auto overflow-y-hidden scroll-smooth">
          <div className="flex min-w-max items-center gap-2 px-2 py-3">
            {allMedia.map((m, index) => {
              const isActive = m.id === activeMedia.id;
              return (
                <div
                  key={m.id}
                  ref={(el) => {
                    thumbnailRefs.current[m.id!] = el;
                  }}
                  onClick={() => {
                    swiperRef.current?.slideTo(index);
                  }}
                  className={clsx(
                    "relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-md transition-all duration-200",
                    isActive
                      ? "ring-4 ring-primary-500 scale-105 opacity-100 z-10"
                      : "opacity-50 hover:opacity-100 hover:scale-105",
                  )}
                >
                  {m.type === MediaType.Image ? (
                    <img src={m.url} alt="Thumbnail" className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <video
                        src={`${m.url}#t=0.1`} // Thêm #t=0.1 để lấy frame đầu tiên làm ảnh bìa
                        className="h-full w-full object-cover pointer-events-none"
                        preload="metadata"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                        <i className="fa-solid fa-play text-white text-xs" />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
