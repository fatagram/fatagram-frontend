import { mergeRefs } from "@/utils/merge-refs";
import { forwardRef, useImperativeHandle, useRef, useLayoutEffect, useEffect } from "react";
import { VList, VListHandle } from "virtua";

const InfiniteScrollReverse = forwardRef<VListHandle, any>(function InfiniteScrollReverse(
  {
    items,
    itemTemplate,
    isShowLastSeen,
    lastSeen,
    itemKey,
    onLoadMore,
    hasMore,
    isLoading,
    listRef: listRefFromParent,
    spinner,
  },
  ref,
) {
  const listRef = useRef<VListHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isPrepend = useRef(false);
  const isInitialScrolled = useRef(false);
  const lastScrollSize = useRef(0);
  const shouldStickToBottom = useRef(true);

  useImperativeHandle(ref, () => listRef.current!);

  useLayoutEffect(() => {
    if (isPrepend.current && listRef.current && containerRef.current) {
      const handle = listRef.current;
      const container = containerRef.current;

      const newScrollSize = handle.scrollSize;
      const delta = newScrollSize - lastScrollSize.current;

      if (delta > 0) {
        container.scrollTop = delta;
      }

      isPrepend.current = false;
    }
  }, [items.length]);

  useEffect(() => {
    if (!listRef.current || items.length === 0) return;

    if (!isInitialScrolled.current) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex(items.length, { align: "end" });
        isInitialScrolled.current = true;
      });
      return;
    }

    if (shouldStickToBottom.current) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex(items.length, { align: "end" });
      });
    }
  }, [items.length]);

  useEffect(() => {
    const handleResize = () => {
      if (shouldStickToBottom.current && listRef.current && containerRef.current) {
        requestAnimationFrame(() => {
          listRef.current?.scrollToIndex(items.length, { align: "end" });
        });
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [items.length, shouldStickToBottom]);

  const handleScroll = (offset: number) => {
    const handle = listRef.current;
    if (!handle) return;

    const isAtBottom = offset - handle.scrollSize + handle.viewportSize >= -50;
    shouldStickToBottom.current = isAtBottom;

    if (!hasMore || isLoading || isPrepend.current) return;
    if (offset < 100 && handle.scrollSize > handle.viewportSize) {
      isPrepend.current = true;
      lastScrollSize.current = handle.scrollSize;
      onLoadMore();
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={(e) => handleScroll(e.currentTarget.scrollTop)}
      className="h-full w-full flex flex-col overflow-hidden"
      style={{
        flex: 1,
        overflowAnchor: "none",
      }}
    >
      <VList
        ref={mergeRefs(listRef, listRefFromParent)}
        onScroll={handleScroll}
        shift={isPrepend.current}
      >
        {hasMore && spinner}
        {!hasMore && isShowLastSeen && lastSeen && (
          <div className="flex items-center justify-center w-full py-2">
            <div className="h-px bg-bg-fourth flex-1" />
            <span className="px-2 text-sm text-text-secondary">{lastSeen}</span>
            <div className="h-px bg-bg-fourth flex-1" />
          </div>
        )}
        {items.map((item: any, index: number) => (
          <div key={itemKey(item)}>{itemTemplate(item, index, null)}</div>
        ))}
      </VList>
    </div>
  );
});

export default InfiniteScrollReverse;
