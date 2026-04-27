import { useEffect, useRef } from "react";

interface InfiniteScrollGridProps {
  itemMinWidth: number | string;
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
  itemKey?: (item: any, index: number) => string | number;
  emptyComponent?: React.ReactNode;
}

export default function InfiniteScrollGrid({
  itemMinWidth,
  items,
  loadingSkeleton,
  numberOfSkeletons = 4,
  className,
  hasMore = true,
  isLoading = false,
  itemTemplate,
  onLoadMore,
  isShowLastSeen = false,
  itemKey,
  emptyComponent,
}: InfiniteScrollGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          await onLoadMore();
        }
      },
      {
        rootMargin: "100px",
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${itemMinWidth}, 1fr))`,
        gap: "0.5rem",
        position: "relative",
      }}
    >
      {items.map((item, index) => (
        <div key={itemKey ? itemKey(item, index) : index} className="w-full">
          {itemTemplate ? itemTemplate(item, index) : item}
        </div>
      ))}

      {isLoading && (
        <>
          {Array.from({ length: numberOfSkeletons }).map((_, index) => (
            <div key={`skeleton-${index}`}>{loadingSkeleton ?? "Loading..."}</div>
          ))}
        </>
      )}

      {hasMore && <div ref={sentinelRef} style={{ gridColumn: "1 / -1", height: "10px" }} />}

      {!hasMore && items.length > 0 && isShowLastSeen && (
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
      {items.length === 0 && !isLoading && (
        <div
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "1rem 0",
            color: "var(--text-third-color)",
          }}
        >
          {emptyComponent ?? "Không có dữ liệu nào."}
        </div>
      )}
    </div>
  );
}
