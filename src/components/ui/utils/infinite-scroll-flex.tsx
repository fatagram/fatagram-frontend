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
  const isInitialLoad = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);

  const isAtBottomRef = useRef(true);

  useEffect(() => {
    const target = lastItemRef.current;
    if (!target || !desc) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isAtBottomRef.current = entry.isIntersecting;
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
      if (entry.isIntersecting && hasMore) {
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
          {itemTemplate
            ? itemTemplate(
                item,
                index,
                index === (desc ? 0 : items.length - 1) ? lastItemRef : null,
              )
            : item}
        </div>
      ))}
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
