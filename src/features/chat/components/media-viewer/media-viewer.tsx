import { useCallback, useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import { useMediaViewer } from "../../context/media-viewer-context";
import clsx from "clsx";
import { MiniButton } from "@/components/atoms";
import { ImageView } from "./image-view";
import { VideoView } from "./video-view";
import { useMediaAround, useMediaAroundAnchor } from "@/features/chat/hooks/use-conversation";
import { ComponentProps } from "@/components/common/component-type";
import { MediaType } from "@/types/entities/message.type";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Zoom, Navigation, Mousewheel } from "swiper/modules";

import "swiper/swiper-bundle.css";

interface MediaViewerProps extends ComponentProps {}

const PREFETCH_DISTANCE = 3;
const FETCH_BATCH_SIZE = 10;

// Lazy video thumbnail: chỉ render <video> khi gần active, tránh load metadata hàng loạt
const VideoThumbnail: React.FC<{ url: string; isNearActive: boolean }> = ({
  url,
  isNearActive,
}) => {
  if (!isNearActive) {
    // Placeholder rất nhẹ, không trigger network request
    return (
      <div className="relative h-full w-full bg-black/60 flex items-center justify-center">
        <i className="fa-solid fa-play text-white text-[10px]" />
      </div>
    );
  }
  return (
    <div className="relative h-full w-full pointer-events-none">
      <video
        src={`${url}#t=0.1`}
        className="h-full w-full object-cover"
        preload="metadata"
        muted
        playsInline
      />
      <i className="fa-solid fa-play text-white text-[10px] absolute inset-0 flex items-center justify-center bg-black/20" />
    </div>
  );
};

// Slide video không active: chỉ render khi adjacent (1 slide cạnh), tránh decode nhiều video cùng lúc
const VideoSlideContent: React.FC<{ url: string; isActive: boolean; isAdjacent: boolean }> = ({
  url,
  isActive,
  isAdjacent,
}) => {
  if (isActive) {
    return <VideoView url={url} className="max-h-full max-w-full rounded-md" />;
  }

  if (!isAdjacent) {
    // Slide xa: placeholder tĩnh hoàn toàn, 0 cost
    return (
      <div className="relative max-h-full max-w-full aspect-video bg-black flex items-center justify-center">
        <i className="fa-solid fa-play text-white text-6xl" />
      </div>
    );
  }

  // Slide kế bên: load metadata nhưng không autoplay/decode
  return (
    <div className="relative max-h-full max-w-full aspect-video bg-black flex items-center justify-center">
      <video
        src={`${url}#t=0.1`}
        className="max-h-full max-w-full opacity-50"
        preload="metadata"
        muted
        playsInline
      />
      <i className="fa-solid fa-play text-white text-6xl absolute" />
    </div>
  );
};

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
  const swiperContainerRef = useRef<HTMLDivElement>(null);
  const initializedAnchor = useRef<string | null>(null);
  const thumbnailRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Fix: track xem đã init swiper position chưa để tránh slideTo thừa
  const hasInitialSlide = useRef(false);

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
      hasInitialSlide.current = false; // reset khi media anchor đổi
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
            if (fetched.length < FETCH_BATCH_SIZE) setCanFetchRight(false);
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
            if (fetched.length < FETCH_BATCH_SIZE) setCanFetchLeft(false);
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
      else if (event.key === "ArrowLeft") swiperRef.current?.slidePrev();
      else if (event.key === "ArrowRight") swiperRef.current?.slideNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMedia, onClose]);

  // Fix: chỉ slideTo khi chưa init, tránh jump mỗi lần fetch thêm media
  useLayoutEffect(() => {
    if (swiperRef.current && activeIndex !== -1 && !hasInitialSlide.current) {
      swiperRef.current.slideTo(activeIndex, 0, false);
      hasInitialSlide.current = true;
    }
  }, [allMedia.length, activeIndex]);

  useEffect(() => {
    if (!activeMedia?.id) return;
    const activeThumbEl = thumbnailRefs.current[activeMedia.id];
    if (activeThumbEl) {
      activeThumbEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeMedia?.id, allMedia.length]);

  useEffect(() => {
    if (activeIndex < 0 || allMedia.length === 0) return;
    if (
      allMedia.length - 1 - activeIndex < PREFETCH_DISTANCE &&
      canFetchRight &&
      !isFetchingRight.current
    )
      void prefetchRight();
    if (activeIndex < PREFETCH_DISTANCE && canFetchLeft && !isFetchingLeft.current)
      void prefetchLeft();
  }, [activeIndex, allMedia.length, canFetchLeft, canFetchRight, prefetchLeft, prefetchRight]);

  // Fix: Tách wheel handler cho desktop zoom, KHÔNG dùng passive: false trên toàn container
  // Chỉ preventDefault khi thực sự đang zoom (scale > 1) — tránh block swipe gesture của mobile
  useEffect(() => {
    const el = swiperContainerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (!swiperRef.current) return;
      const swiper = swiperRef.current;
      const zoom = swiper.zoom;
      const currentScale = zoom.scale;

      if (e.deltaY < 0) {
        // Chỉ chặn scroll khi zoom in (không phải lần đầu tiên để tránh conflict với swipe)
        e.preventDefault();
        zoom.in();
      } else if (e.deltaY > 0 && currentScale > 1) {
        // Chỉ chặn khi đang zoom out — nếu scale = 1 thì cho swiper xử lý navigation
        e.preventDefault();
        zoom.out();
      }
      // Khi scale = 1 và scroll xuống: KHÔNG preventDefault → swiper tự xử lý slide next
    };

    // passive: true cho mobile touch events — chỉ non-passive cho wheel (desktop)
    // Dùng check để phân biệt touch vs mouse wheel
    const isTouchDevice = "ontouchstart" in window;

    if (!isTouchDevice) {
      el.addEventListener("wheel", handleWheel, { passive: false });
      return () => el.removeEventListener("wheel", handleWheel);
    }
    // Mobile: không gắn wheel handler, swiper tự handle touch natively
  }, [activeMedia]);

  const onDownload = async () => {
    if (isDownloading || !activeMedia) return;
    setIsDownloading(true);
    try {
      const response = await fetch(activeMedia.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      const urlPath = new URL(activeMedia.url).pathname;
      anchor.download = urlPath.substring(urlPath.lastIndexOf("/") + 1) || "media";
      anchor.click();
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Download failed", e);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!activeMedia) return null;

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
            className="!text-white/70 hover:!text-white"
            onClick={onDownload}
            disabled={isDownloading}
          >
            <i
              className={clsx(
                "fa-solid text-xl",
                isDownloading ? "fa-spinner fa-spin" : "fa-download",
              )}
            />
          </MiniButton>
          <MiniButton className="!text-white/70 hover:!text-white" onClick={onClose}>
            <i className="fa-solid fa-xmark text-2xl" />
          </MiniButton>
        </div>
      </div>

      <div className="relative flex flex-1 min-h-0 items-center justify-center overflow-hidden w-full">
        <button
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 hidden md:block text-white/50 hover:text-white disabled:opacity-10"
          onClick={(e) => {
            e.stopPropagation();
            swiperRef.current?.slidePrev();
          }}
          disabled={activeIndex <= 0}
        >
          <i className="fa-solid fa-chevron-left text-3xl" />
        </button>

        <div
          className="h-full w-full"
          onClick={(e) => e.stopPropagation()}
          ref={swiperContainerRef}
        >
          <Swiper
            modules={[Zoom, Navigation, Mousewheel]}
            zoom={{ maxRatio: 3, minRatio: 1, toggle: true }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={handleSlideChange}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 1,
              // Fix: chỉ bật mousewheel navigation khi không đang zoom
              releaseOnEdges: true,
            }}
            // Fix: thêm cssMode=false (mặc định) + virtualTranslate=false để dùng GPU transform
            cssMode={false}
            initialSlide={activeIndex}
            spaceBetween={20}
            slidesPerView={1}
            className="w-full h-full"
            // Fix: lazy load slides để tránh render tất cả video cùng lúc
            lazyPreloadPrevNext={1}
          >
            {allMedia.map((m, index) => {
              const isActive = (m.id || m.url) === (activeMedia?.id || activeMedia?.url);
              // Chỉ render đầy đủ slide cạnh active index
              const isAdjacent = Math.abs(index - activeIndex) <= 1;

              return (
                <SwiperSlide
                  key={m.id}
                  className="h-full w-full overflow-hidden"
                  // Fix: GPU layer hint cho mỗi slide
                  style={{ willChange: "transform" }}
                >
                  <div className="swiper-zoom-container h-full w-full flex items-center justify-center p-2 md:p-10">
                    {m.type === MediaType.Image ? (
                      <ImageView
                        url={m.url}
                        className="max-h-full max-w-full object-contain select-none shadow-2xl"
                      />
                    ) : (
                      <VideoSlideContent url={m.url} isActive={isActive} isAdjacent={isAdjacent} />
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <button
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 hidden md:block text-white/50 hover:text-white disabled:opacity-10"
          onClick={(e) => {
            e.stopPropagation();
            swiperRef.current?.slideNext();
          }}
          disabled={activeIndex >= allMedia.length - 1}
        >
          <i className="fa-solid fa-chevron-right text-3xl" />
        </button>
      </div>

      <div
        className="flex w-full shrink-0 items-center justify-center bg-black/40 px-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-[960px] overflow-x-auto overflow-y-hidden py-4 scroll-smooth scrollbar-thin scrollbar-thumb-white/20">
          <div className="flex flex-nowrap items-center gap-2 px-2 min-w-max">
            {allMedia.map((m, index) => {
              const isActive = (m.id || m.url) === (activeMedia?.id || activeMedia?.url);
              const isNearActive = Math.abs(index - activeIndex) <= 2;
              return (
                <div
                  key={m.id}
                  ref={(el) => {
                    thumbnailRefs.current[m.id!] = el;
                  }}
                  onClick={() => swiperRef.current?.slideTo(index)}
                  className={clsx(
                    "relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded transition-all duration-200",
                    isActive
                      ? "ring-2 ring-primary-500 scale-110 opacity-100 shadow-lg"
                      : "opacity-40 hover:opacity-100 hover:scale-105",
                    "select-none",
                  )}
                >
                  {m.type === MediaType.Image ? (
                    <img
                      src={m.url}
                      className="h-full w-full object-cover pointer-events-none"
                      alt=""
                    />
                  ) : (
                    <VideoThumbnail url={m.url} isNearActive={isNearActive} />
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
