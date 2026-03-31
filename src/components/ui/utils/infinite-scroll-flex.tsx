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
  rootMargin?: string;
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
  const lastItemRef = useRef<HTMLDivElement>(null);

  const isAtBottomRef = useRef(true);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    isFetchingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    const target = lastItemRef.current;
    if (!target || !desc) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isAtBottomRef.current = entry.isIntersecting;
        console.log("isAtBottom:", isAtBottomRef.current);
      },
      {
        root: parentRef?.current || containerRef.current,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [desc]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !isLoading && !isFetchingRef.current) {
        onLoadMore();
      }
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [sentinelRef, isLoading, hasMore]);

  useEffect(() => {
    if (!lastItemRef.current) return;
    const scrollContainer = parentRef?.current || containerRef.current;
    if (!scrollContainer) return;

    const observer = new ResizeObserver(() => {
      if (isAtBottomRef.current) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    });

    observer.observe(scrollContainer);
    return () => observer.disconnect();
  }, [items.length]);

  return (
    <div
      className={clsx(
        "relative overflow-y-auto",
        desc ? "flex flex-col-reverse" : "flex flex-col",
        className,
      )}
      style={{
        gap: gap ?? "0.5rem",
      }}
      ref={containerRef}
    >
      {items.map((item, index) => (
        <div key={itemKey(item, index)}>
          {itemTemplate ? itemTemplate(item, index, null) : item}
        </div>
      ))}
      <div className="h-[1px] w-1 order-first" ref={lastItemRef}></div>
      {hasMore && <div ref={sentinelRef} className={clsx("h-[20px] w-[20px] order-last")} />}
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
      {items.length > 0 && !hasMore && !isLoading && isShowLastSeen && (
        <div
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "1rem 0",
            color: "var(--text-third-color)",
          }}
        >
          {lastSeen || "Đã xem hết kết quả."}
        </div>
      )}
      {items.length === 0 && !isLoading && emptyComponent}
    </div>
  );
}
