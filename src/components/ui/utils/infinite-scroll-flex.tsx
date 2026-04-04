import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { RefObject, useEffect, useRef } from "react";

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
  parentRef,
  itemKey,
  emptyComponent,
}: InfiniteScrollFlexProps) {
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

  const _loadMore = async () => {
    if (pendingLoadRef.current) return;
    if (isLoadingRef.current) return;

    pendingLoadRef.current = true;
    await new Promise((resolve) => setTimeout(resolve, 50));
    await onLoadMore();
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        if (!hasMore) return;
        _loadMore();
      },
      {
        root: parentRef?.current || containerRef.current,
        rootMargin: "0px 0px 200px 0px",
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, parentRef]);

  return (
    <div
      ref={containerRef}
      className={clsx("relative overflow-y-auto h-full flex flex-col", className)}
      style={{ gap: gap ?? "0.5rem" }}
    >
      {items.map((item, index) => (
        <div key={itemKey(item, index)}>
          {itemTemplate ? itemTemplate(item, index, null) : item}
        </div>
      ))}

      {isLoading && (
        <div className="relative w-full" style={{ overflowAnchor: "none" }}>
          {Array.from({ length: numberOfSkeletons }).map((_, index) => (
            <div key={`skeleton-${index}`} className="relative">
              {loadingSkeleton ?? "Loading..."}
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div
          ref={sentinelRef}
          className={clsx("h-px w-full shrink-0 bg-red-500")}
          style={{ overflowAnchor: "none" }}
        />
      )}

      {items.length > 0 && !hasMore && !isLoading && isShowLastSeen && (
        <div className="w-full text-center py-4 text-text-third text-sm">
          {lastSeen || "Đã xem hết kết quả."}
        </div>
      )}

      {items.length === 0 && !isLoading && emptyComponent}
    </div>
  );
}
