import { useEffect, useMemo, useState, useRef } from "react";
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";
import clsx from "clsx";
import { useGifs } from "../../hooks/use-gifs";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/atoms";
import Transition, { AnimationLib } from "@/components/ui/utils/transition";

interface ChatAddonPickerProps {
  show: boolean;
  onClose?: () => void;
  onEmojiClick: (emoji: string) => void;
  onGifClick: (gifUrl: string) => void;
  emojiTheme: EmojiTheme;
}

type TabType = "emoji" | "gif" | "sticker";

const GifItem = ({ gif, onClick }: { gif: any; onClick: (url: string) => void }) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      className="relative aspect-video bg-bg-second rounded-lg overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all active:scale-95 group"
      onClick={() => onClick(gif.url)}
    >
      {!isLoaded && <Skeleton className="w-full h-full absolute inset-0 z-0" />}
      {isInView && (
        <img
          src={gif.previewUrl}
          alt={gif.title}
          className="w-full h-full object-cover transition-opacity duration-300 opacity-0 relative z-10"
          loading="lazy"
          onLoad={(e) => {
            setIsLoaded(true);
            e.currentTarget.style.opacity = "1";
          }}
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-20" />
    </button>
  );
};

export const ChatAddonPicker = ({
  show,
  onEmojiClick,
  onGifClick,
  emojiTheme,
}: ChatAddonPickerProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("emoji");
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [shouldRenderEmoji, setShouldRenderEmoji] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const {
    data: gifData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingGifs,
  } = useGifs(debouncedSearch, show && activeTab === "gif");

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShouldRenderEmoji(true);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setShouldRenderEmoji(false);
    }
  }, [show]);

  useEffect(() => {
    if (!show || activeTab !== "gif" || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [show, activeTab, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const emojiStyle = useMemo(
    () =>
      ({
        "--epr-bg-color": "rgb(var(--bg-main))",
        "--epr-category-label-bg-color": "rgb(var(--bg-main))",
        "--epr-text-color": "rgb(var(--text-main))",
        "--epr-search-input-bg-color": "rgb(var(--bg-second))",
        "--epr-highlight-color": "rgb(var(--primary-500))",
        "--epr-picker-border-color": "rgb(var(--border-main))",
        "--epr-category-icon-active-color": "rgb(var(--primary-500))",
        "--epr-emoji-variation-picker-bg-color": "rgb(var(--bg-main))",
        "--epr-preview-text-color": "rgb(var(--text-main))",
        "--epr-category-navigation-button-active-color": "rgb(var(--primary-500))",
        "--epr-hover-bg-color": "rgb(var(--bg-hover))",
        "--epr-focus-color": "rgb(var(--primary-500))",
        "--epr-search-border-color-active": "rgb(var(--primary-500))",
        "--epr-search-input-bg-color-active": "rgb(var(--bg-main))",
        "--epr-category-navigation-button-icon-color": "rgb(var(--text-third))",
        "--epr-category-navigation-button-active-icon-color": "rgb(var(--primary-500))",
      }) as React.CSSProperties,
    [],
  );

  const tabs = [
    { id: "emoji", label: "Emoji" },
    { id: "gif", label: "GIF" },
    { id: "sticker", label: "Nhãn dán" },
  ];

  const renderContent = () => (
    <div className="flex flex-col h-full w-full flex-1 min-h-0 select-none">
      <div className="flex border-b border-border-main bg-bg-secondary p-1 gap-1 flex-shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={clsx(
              "px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors",
              activeTab === tab.id
                ? "bg-bg-main shadow-sm text-text-main"
                : "text-text-secondary hover:text-text-main hover:bg-bg-main/50",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 w-full relative bg-bg-main min-h-0 overflow-hidden flex flex-col">
        {activeTab === "emoji" && (
          <div className="absolute inset-0 flex items-center justify-center">
            {mounted && shouldRenderEmoji ? (
              <>
                <style>{`
                  .EmojiPickerReact, .EmojiPickerReact * {
                    font-family: var(--font-sans) !important;
                  }
                `}</style>
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    onEmojiClick(emojiData.emoji);
                  }}
                  style={emojiStyle}
                  width="100%"
                  height="100%"
                  theme={emojiTheme}
                  searchDisabled={false}
                  autoFocusSearch={false}
                  skinTonesDisabled
                  lazyLoadEmojis={true}
                  previewConfig={{ showPreview: false }}
                />
              </>
            ) : (
              <div style={{ color: "rgb(var(--primary-500))" }} className="text-lg">
                <i className="fa-solid fa-circle-notch animate-spin" />
              </div>
            )}
          </div>
        )}
        {activeTab === "gif" && (
          <div className="flex flex-col h-full w-full">
            <div className="p-2 border-b border-border-main">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-text-third text-xs"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm GIF..."
                  className="w-full bg-bg-second border-none rounded-lg py-2 pl-9 pr-3 text-sm focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
              <div className="grid grid-cols-2 gap-2">
                {gifData?.pages.map((page) =>
                  page?.gifs?.map((gif) => <GifItem key={gif.id} gif={gif} onClick={onGifClick} />),
                )}

                {(isLoadingGifs || isFetchingNextPage) &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-video w-full rounded-lg" />
                  ))}
              </div>

              {!isLoadingGifs && (gifData?.pages?.[0]?.gifs?.length ?? 0) === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-text-third">
                  <i className="fa-solid fa-face-frown text-3xl mb-2"></i>
                  <span className="text-sm">Không tìm thấy GIF nào</span>
                </div>
              )}

              <div ref={loadMoreRef} className="h-4 w-full" />
            </div>
          </div>
        )}
        {activeTab === "sticker" && (
          <div className="flex flex-col items-center justify-center h-full text-text-secondary space-y-2">
            <i className="fa-solid fa-note-sticky text-3xl"></i>
            <span>Tính năng đang phát triển...</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Transition
      show={show}
      animation={AnimationLib.SlideUp}
      className={clsx(
        "bg-bg-main border-border-main overflow-hidden flex flex-col select-none",
        "w-full border-t flex-shrink-0 h-[450px]",
        "sm:absolute sm:bottom-full sm:right-0 sm:mb-2 sm:z-50 sm:border sm:rounded-xl sm:shadow-lg sm:w-80 sm:h-[400px] sm:origin-bottom-right",
      )}
    >
      {renderContent()}
    </Transition>
  );
};
