import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { RefObject, useCallback, useEffect, useLayoutEffect, useRef } from "react";

interface InfiniteScrollFlexProps extends ComponentProps {
  items: any[];
  loadingSkeleton?: React.ReactNode;
  numberOfSkeletons?: number;
  hasMore?: boolean;
  isLoading?: boolean;
  itemTemplate?: (
    item: any,
    index: number,
    ref: RefObject<HTMLDivElement | null> | null,
  ) => React.ReactNode;
  onLoadMore: () => void;
  isShowLastSeen?: boolean;
  lastSeen?: React.ReactNode;
  gap?: string | number;
  desc?: boolean;
  parentRef?: RefObject<HTMLDivElement | null>;
  itemKey: (item: any, index: number) => string | number;
  emptyComponent?: React.ReactNode;
}

export default function InfiniteScrollFlex({
  items,
  loadingSkeleton,
  numberOfSkeletons = 4,
  className,
  hasMore = true,
  isLoading = false,
  itemTemplate,
  onLoadMore,
  isShowLastSeen = false,
  lastSeen,
  gap,
  desc = false,
  parentRef,
  itemKey,
  emptyComponent,
}: InfiniteScrollFlexProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !desc) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading && !isLoadingRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          await onLoadMore();
        }
      },
      { root: parentRef?.current || containerRef.current, rootMargin: "50px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, desc, onLoadMore, parentRef]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative overflow-y-auto h-full",
        desc ? "flex flex-col-reverse" : "flex flex-col",
        className,
      )}
      style={{ gap: gap ?? "0.5rem", overflowAnchor: "none" }}
    >
      {items.map((item, index) => (
        <div key={itemKey(item, index)}>
          {itemTemplate ? itemTemplate(item, index, null) : item}
        </div>
      ))}
      {desc && hasMore && !isLoading && (
        <div
          ref={sentinelRef}
          className={clsx("h-px w-full shrink-0")}
          style={{ overflowAnchor: "none" }}
        />
      )}
      {isLoading && (
        <div
          className="absolute top-0 left-0 w-full flex justify-center py-2 z-10 pointer-events-none"
          style={{ overflowAnchor: "none" }}
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-card shadow-sm border border-border-main text-xs text-text-third">
            <i className="fa-solid fa-circle-notch animate-spin" />
            <span>Đang tải tin nhắn cũ...</span>
          </div>
        </div>
      )}

      {items.length > 0 && !hasMore && !isLoading && isShowLastSeen && (
        <div className="order-last w-full text-center py-4 text-text-third text-sm">
          {lastSeen || "Đã xem hết kết quả."}
        </div>
      )}

      {items.length === 0 && !isLoading && emptyComponent}
    </div>
  );
}
