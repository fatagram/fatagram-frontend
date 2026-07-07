import { ComponentProps } from "@/components/common/component-type";
import { useEffect, useRef, useMemo, useLayoutEffect, Key } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { mergeRefs } from "@/utils/merge-refs";

interface Props<T> extends ComponentProps {
  items: T[];
  hasMore: boolean;
  loadMore: () => Promise<any>;
  renderItem: (item: T, index: number) => React.ReactNode;
  itemKey: (item: T) => string | number;
  estimateSize?: (item: T) => number;
  end?: React.ReactNode;
  spinner?: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export default function InfiniteScrollReverse<T>({
  items,
  hasMore,
  loadMore,
  renderItem,
  itemKey,
  estimateSize,
  className,
  end,
  spinner,
  scrollRef,
}: Props<T>) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const reversedItems = useMemo(() => [...items].reverse(), [items]);

  const isScrolledUpRef = useRef(false);
  const anchorRef = useRef<{ key: Key | null; start: number }>({
    key: null,
    start: 0,
  });

  const rowVirtualizer = useVirtualizer({
    count: reversedItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: estimateSize
      ? (index) => estimateSize(reversedItems[index])
      : () => 70,
    overscan: 8,
    getItemKey: (index) => itemKey(reversedItems[index]),
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    isScrolledUpRef.current = e.currentTarget.scrollTop > 50;
  };

  useLayoutEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    const virtualItems = rowVirtualizer.getVirtualItems();
    if (virtualItems.length === 0) return;

    if (isScrolledUpRef.current && anchorRef.current.key !== null) {
      const prevAnchor = virtualItems.find((v) => v.key === anchorRef.current.key);
      if (prevAnchor) {
        const delta = prevAnchor.start - anchorRef.current.start;
        if (delta !== 0) {
          el.scrollTop += delta;
          anchorRef.current.start = prevAnchor.start;
        }
      }
    }

    const currentScrollTop = el.scrollTop;
    const stableItem = virtualItems.find((v) => v.start >= currentScrollTop) || virtualItems[0];

    anchorRef.current = {
      key: stableItem.key,
      start: stableItem.start,
    };
  });

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    let velocity = 0;
    let lastTime: number | null = null;
    let rafId: number;
    let isScrolling = false;

    const FRICTION = 0.045;
    const MAX_VELOCITY = 130;
    const MULTIPLIER = 1.2;
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

      // REVERSED: Sử dụng dấu trừ để đảo ngược hướng cuộn
      el.scrollTop -= velocity;
      rafId = requestAnimationFrame(animate);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      let delta = e.deltaY;

      if (e.deltaMode === 1) {
        delta *= 35;
      } else if (e.deltaMode === 2) {
        delta *= el.clientHeight;
      }

      const isTrackpad = Math.abs(e.deltaY) < 50 && e.deltaMode === 0;
      if (isTrackpad) {
        // REVERSED: Đảo ngược cho cả trackpad
        el.scrollTop -= delta;
        return;
      }

      const impulse = delta * MULTIPLIER;
      velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity + impulse));

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
      className={clsx("w-full overflow-y-auto overflow-x-hidden relative", className)}
      style={{
        height: "100%",
        transform: "scaleY(-1)",
        overflowAnchor: "none",
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
