import { ComponentProps } from "@/components/common/component-type";
import { useEffect, useRef, useMemo, useLayoutEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { mergeRefs } from "@/utils/merge-refs";

interface Props<T> extends ComponentProps {
  items: T[];
  hasMore: boolean;
  loadMore: () => Promise<any>;
  renderItem: (item: T, index: number) => React.ReactNode;
  itemKey: (item: T) => string | number;
  end?: React.ReactNode;
  spinner?: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  canKeepPosition?: boolean;
}

export default function InfiniteScrollReverse<T>({
  items,
  hasMore,
  loadMore,
  renderItem,
  itemKey,
  className,
  end,
  spinner,
  scrollRef,
  canKeepPosition = false,
}: Props<T>) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const reversedItems = useMemo(() => [...items].reverse(), [items]);

  // Các refs hỗ trợ giữ vị trí cuộn (Refs for maintaining scroll position)
  const prevSizeRef = useRef(0);
  const isScrolledUpRef = useRef(false);
  const prevFirstKeyRef = useRef<string | number | null>(null);
  const isCompensatingRef = useRef(false);

  const rowVirtualizer = useVirtualizer({
    count: reversedItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 70,
    overscan: 10,
    getItemKey: (index) => itemKey(reversedItems[index]),
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    isScrolledUpRef.current = e.currentTarget.scrollTop > 50;
  };

  useLayoutEffect(() => {
    const el = parentRef.current;
    if (!el || !canKeepPosition) return;

    const currentSize = rowVirtualizer.getTotalSize();
    const sizeDiff = currentSize - prevSizeRef.current;
    const currentFirstKey = reversedItems.length > 0 ? itemKey(reversedItems[0]) : null;

    if (currentFirstKey !== prevFirstKeyRef.current) {
      isCompensatingRef.current = true;
      prevFirstKeyRef.current = currentFirstKey;
    }

    if (isCompensatingRef.current && isScrolledUpRef.current && sizeDiff !== 0) {
      el.scrollTop += sizeDiff;
    }

    if (sizeDiff === 0) {
      isCompensatingRef.current = false;
    }

    prevSizeRef.current = currentSize;
  }, [rowVirtualizer.getTotalSize(), reversedItems, itemKey, canKeepPosition]);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    let velocity = 0;
    let lastTime: number | null = null;
    let rafId: number;
    let isScrolling = false;

    const FRICTION = 0.055;
    const MAX_VELOCITY = 80;
    const MULTIPLIER = 0.8;
    const STOP_THRESHOLD = 0.1;

    const animate = (timestamp: number) => {
      if (lastTime === null) {
        lastTime = timestamp;
        rafId = requestAnimationFrame(animate);
        return;
      }

      const dt = Math.min(timestamp - lastTime, 32);
      lastTime = timestamp;

      velocity *= Math.pow(1 - FRICTION, dt);

      if (Math.abs(velocity) < STOP_THRESHOLD) {
        velocity = 0;
        isScrolling = false;
        lastTime = null;
        return;
      }

      el.scrollTop -= velocity;
      rafId = requestAnimationFrame(animate);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      const isTrackpad = e.deltaMode === 0 && Math.abs(e.deltaY) < 50;
      const isLineMode = e.deltaMode === 1;

      let delta: number;
      if (isLineMode) {
        delta = e.deltaY * 35;
      } else if (isTrackpad) {
        el.scrollTop -= e.deltaY;
        return;
      } else {
        delta = e.deltaY * MULTIPLIER;
      }

      velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity + delta));

      if (!isScrolling) {
        isScrolling = true;
        lastTime = null;
        rafId = requestAnimationFrame(animate);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
          isFetchingRef.current = true;
          await loadMore().finally(() => {
            isFetchingRef.current = false;
          });
        }
      },
      { threshold: 0.1, rootMargin: "200px" },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div
      ref={mergeRefs(parentRef, scrollRef)}
      onScroll={handleScroll}
      className={clsx("w-full overflow-y-auto relative", className)}
      style={{
        height: "100%",
        transform: "scaleY(-1)",
      }}
    >
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          position: "relative",
          width: "100%",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = reversedItems[virtualRow.index];

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px) scaleY(-1)`,
              }}
            >
              {renderItem(item, virtualRow.index)}
            </div>
          );
        })}
      </div>

      <div ref={sentinelRef} className="w-full flex items-center justify-center py-4">
        <div style={{ transform: "scaleY(-1)" }}>{hasMore ? spinner : end}</div>
      </div>
    </div>
  );
}
