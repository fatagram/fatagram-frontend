import { useEffect, useId, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

interface InfiniteScrollGridProps<ItemType> {
  itemMinWidth: number | string;
  items: ItemType[];
  loadingSkeleton?: React.ReactNode;
  numberOfSkeletons?: number;
  className?: string;
  hasMore?: boolean;
  isLoading?: boolean;
  itemTemplate?: (item: ItemType, index: number) => React.ReactNode;
  onLoadMore: () => void;
  // rootMargin?: string;
  isShowLastSeen?: boolean;
  itemKey?: (item: ItemType, index: number) => string | number;
  emptyComponent?: React.ReactNode;
}

export default function InfiniteScrollGrid<ItemType>({
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
}: Readonly<InfiniteScrollGridProps<ItemType>>) {
  const { t } = useTranslation();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const skeletonPrefix = useId();
  const skeletonKeys = useMemo(
    () => Array.from({ length: numberOfSkeletons }, (_, i) => `${skeletonPrefix}-skel-${i}`),
    [numberOfSkeletons, skeletonPrefix],
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          onLoadMore();
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
      {items.map((item, index) => {
        const key = itemKey ? itemKey(item, index) : index;
        const renderContent = itemTemplate
          ? itemTemplate(item, index)
          : (item as unknown as React.ReactNode);
        return (
          <div key={key} className="w-full">
            {renderContent}
          </div>
        );
      })}

      {isLoading &&
        skeletonKeys.map((uniqueKey) => (
          <div key={uniqueKey}>{loadingSkeleton ?? "Loading..."}</div>
        ))}

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
          {t("common:allResultsSeen", "Đã xem hết kết quả.")}
        </div>
      )}
      {items.length === 0 && !isLoading && emptyComponent != null && (
        <div
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "1rem 0",
            color: "var(--text-third-color)",
          }}
        >
          {emptyComponent}
        </div>
      )}
    </div>
  );
}
