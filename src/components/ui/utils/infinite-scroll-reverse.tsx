import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { RefObject, useEffect, useRef } from "react";

interface InfiniteScrollReverseProps extends ComponentProps {
  items: any[];
  hasMore?: boolean;
  isLoading?: boolean;
  spinnerContent?: React.ReactNode;
  itemTemplate?: (
    item: any,
    index: number,
    ref: RefObject<HTMLDivElement | null> | null,
  ) => React.ReactNode;
  onLoadMore: () => void;
  isShowLastSeen?: boolean;
  lastSeen?: React.ReactNode;
  gap?: string | number;
  parentRef?: RefObject<HTMLDivElement | null>;
  itemKey: (item: any, index: number) => string | number;
  emptyComponent?: React.ReactNode;
}

export default function InfiniteScrollReverse({
  items,
  className,
  hasMore = true,
  isLoading = false,
  spinnerContent,
  itemTemplate,
  onLoadMore,
  isShowLastSeen = false,
  lastSeen,
  gap,
  parentRef,
  itemKey,
  emptyComponent,
}: InfiniteScrollReverseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(isLoading);
  const pendingLoadRef = useRef(false);

  useEffect(() => {
    isLoadingRef.current = isLoading;

    if (!isLoading) {
      pendingLoadRef.current = false;
    }
  }, [isLoading]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (!hasMore) return;
        if (pendingLoadRef.current) return;
        if (isLoadingRef.current) return;

        pendingLoadRef.current = true;
        onLoadMore();
      },
      { root: parentRef?.current || containerRef.current, rootMargin: "50px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, parentRef]);

  return (
    <div
      ref={containerRef}
      className={clsx("relative overflow-y-auto h-full flex flex-col-reverse", className)}
      style={{ gap: gap ?? "0.5rem" }}
    >
      {items.map((item, index) => (
        <div key={itemKey(item, index)}>
          {itemTemplate ? itemTemplate(item, index, null) : item}
        </div>
      ))}

      {hasMore && (
        <div
          className="w-full flex justify-center py-2 shrink-0"
          style={{ overflowAnchor: "none" }}
        >
          {spinnerContent ?? (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-xs text-primary-600">
              <i className="fa-solid fa-circle-notch animate-spin" />
              <span>Đang tải tin nhắn cũ...</span>
            </div>
          )}
        </div>
      )}

      {hasMore && (
        <div
          ref={sentinelRef}
          className={clsx("h-px w-full shrink-0")}
          style={{ overflowAnchor: "none" }}
        />
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
