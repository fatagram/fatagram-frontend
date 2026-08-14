import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { RefObject, useCallback, useEffect, useRef } from "react";

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

  // Latest values are kept in refs so the IntersectionObserver below is created
  // exactly once (per mount / parentRef change) instead of being torn down and
  // rebuilt every time `hasMore` or `onLoadMore` changes identity. Disconnecting
  // and reconnecting the observer while the sentinel is mid-viewport was the main
  // source of the stutter at the end of the list: the browser has to recompute
  // intersection state from scratch, which can double-fire or momentarily miss
  // the callback right as new content is appended.
  const hasMoreRef = useRef(hasMore);
  const isLoadingRef = useRef(isLoading);
  const onLoadMoreRef = useRef(onLoadMore);
  const pendingLoadRef = useRef(false);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
    if (!isLoading) {
      pendingLoadRef.current = false;
    }
  }, [isLoading]);

  const loadMore = useCallback(() => {
    if (pendingLoadRef.current || isLoadingRef.current || !hasMoreRef.current) return;
    pendingLoadRef.current = true;
    onLoadMoreRef.current();
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadMore();
        }
      },
      {
        root: parentRef?.current || containerRef.current,
        rootMargin: "300px 0px 200px 0px",
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, parentRef]);

  // When the caller supplies its own scrollable wrapper (parentRef), this
  // component must NOT also declare overflow-y-auto/h-full on its own root.
  // Two nested auto-scroll containers fight over which one actually owns the
  // scroll: the inner one ends up absorbing the scroll while the observer's
  // `root` is the outer one, so the sentinel's intersection is computed against
  // a box that never itself scrolls. That mismatch is what produced the jerky,
  // inconsistent load-more triggering when reaching the bottom.
  const managesOwnScroll = !parentRef;

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative flex flex-col",
        managesOwnScroll && "overflow-y-auto h-full",
        className,
      )}
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
          className={clsx("h-px w-full shrink-0")}
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
