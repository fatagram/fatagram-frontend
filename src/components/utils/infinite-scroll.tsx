import { useEffect, useRef } from "react";

interface InfiniteScrollProps {
  itemInRow: number;
  items: any[];
  loadingSkeleton?: React.ReactNode;
  numberOfSkeletons?: number;
  className?: string;
  hasMore?: boolean;
  isLoading?: boolean;
  itemTemplate?: (item: React.ReactNode, index: number) => React.ReactNode;
  onLoadMore: () => void;
  rootMargin?: string;
  isShowLastSeen?: boolean;
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
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting) {
        await onLoadMore();
      }
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [sentinelRef, hasMore]);

  // Reset loading ref when isLoading changes to false
  useEffect(() => {
    if (!isLoading) {
      loadingRef.current = false;
    }
  }, [isLoading]);

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${itemInRow}, 1fr)`,
        gap: "0.5rem",
      }}
    >
      {items.map((item, index) => (itemTemplate ? itemTemplate(item, index) : item))}
      {hasMore && <div ref={sentinelRef} className="absolute bottom-1/2 h-[20px] w-[20px]" />}
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
