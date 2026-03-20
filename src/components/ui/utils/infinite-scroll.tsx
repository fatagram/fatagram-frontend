import clsx from "clsx";
import { RefObject, useEffect, useRef } from "react";

interface InfiniteScrollProps {
  itemInRow: number;
  items: any[];
  loadingSkeleton?: React.ReactNode;
  numberOfSkeletons?: number;
  className?: string;
  hasMore?: boolean;
  isLoading?: boolean;
  itemTemplate?: (
    item: React.ReactNode,
    index: number,
    ref: RefObject<HTMLDivElement | null> | null,
  ) => React.ReactNode;
  onLoadMore: () => void;
  rootMargin?: string;
  isShowLastSeen?: boolean;
  gap?: string | number;
  desc?: boolean;
  autoScrollToLastItem?: boolean;
  parentRef?: RefObject<HTMLDivElement | null>;
}

export default function InfiniteScroll({
  itemInRow = 1,
  items,
  loadingSkeleton,
  numberOfSkeletons = 4,
  className,
  hasMore = true,
  isLoading = false,
  itemTemplate,
  onLoadMore,
  isShowLastSeen = false,
  gap,
  desc = false,
  parentRef,
}: InfiniteScrollProps) {
  const isInitialLoad = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);
  // const loadingRef = useRef(false);

  const isAtBottomRef = useRef(true);

  useEffect(() => {
    const target = lastItemRef.current;
    if (!target || !desc) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isAtBottomRef.current = entry.isIntersecting;
        console.log("Is at bottom:", isAtBottomRef.current);
      },
      {
        root: parentRef?.current || containerRef.current,
        threshold: 0.1,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [items[0], desc]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting) {
        console.log("Load more items...");
        await onLoadMore();
      }
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [sentinelRef, hasMore]);

  useEffect(() => {
    if (isAtBottomRef.current && lastItemRef.current) {
      lastItemRef.current.scrollIntoView({
        behavior: isInitialLoad.current ? "auto" : "smooth",
      });
      isInitialLoad.current = false;
    }
  }, [items.length]);

  return (
    <div
      className={clsx("flex  overflow-y-auto", desc ? "flex-col-reverse" : "flex-col", className)}
      style={{
        gap: gap ?? "0.5rem",
      }}
      ref={containerRef}
    >
      {items.map((item, index) =>
        itemTemplate
          ? itemTemplate(item, index, index === (desc ? 0 : items.length - 1) ? lastItemRef : null)
          : item,
      )}
      {hasMore && (
        <div
          ref={sentinelRef}
          className={clsx("absolute h-[20px] w-[20px]", desc ? "top-[50px]" : "bottom-0")}
        />
      )}
      {isLoading && (
        <>
          {Array.from({ length: numberOfSkeletons }).map((_, index) => (
            <div
              key={index}
              style={{
                textAlign: "center",
                padding: "1rem 0",
              }}
            >
              {loadingSkeleton ?? "Loading..."}
            </div>
          ))}
        </>
      )}
      {!hasMore && !isLoading && isShowLastSeen && (
        <div
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "1rem 0",
            color: "var(--text-third-color)",
          }}
        >
          Đã xem hết kết quả.
        </div>
      )}
    </div>
  );
}
