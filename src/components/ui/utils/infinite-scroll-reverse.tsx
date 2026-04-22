import { ComponentProps } from "@/components/common/component-type";
import { forwardRef, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ItemProps, Virtuoso, VirtuosoHandle } from "react-virtuoso";

interface InfiniteScrollReverseProps extends ComponentProps {
  items: any[];
  hasMore?: boolean;
  isLoading?: boolean;
  spinnerContent?: React.ReactNode;
  itemTemplate?: (index: number, item: any) => React.ReactNode;
  onLoadMore: () => void;
  isShowLastSeen?: boolean;
  lastSeen?: React.ReactNode;
  gap?: string | number;
  parentRef?: RefObject<HTMLDivElement | null>;
  itemKey: (index: number, item: any) => string | number;
  emptyComponent?: React.ReactNode;
}

const START_INDEX = 100000;

const VirtuosoItem = ({ children, ...props }: ItemProps<any>) => (
  <div
    {...props}
    style={{
      minHeight: "1px",
      overflow: "hidden",
      boxSizing: "border-box",
    }}
  >
    {children}
  </div>
);

const InfiniteScrollReverse = forwardRef<VirtuosoHandle, InfiniteScrollReverseProps>(
  function InfiniteScrollReverse(
    {
      items,
      className,
      hasMore = true,
      isLoading = false,
      spinnerContent,
      itemTemplate,
      onLoadMore,
      isShowLastSeen = false,
      lastSeen,
      itemKey,
    },
    ref,
  ) {
    const [firstItemIndex, setFirstItemIndex] = useState(() => START_INDEX - (items?.length || 0));

    const prevFirstItemKey = useRef<string | number | undefined>(
      items?.[0] ? itemKey(0, items[0]) : undefined,
    );

    useEffect(() => {
      if (!items || items.length === 0) return;

      const currentFirstKey = itemKey(0, items[0]);

      if (currentFirstKey !== prevFirstItemKey.current) {
        setFirstItemIndex(START_INDEX - items.length);
        prevFirstItemKey.current = currentFirstKey;
      }
    }, [items, itemKey]);

    const isLoadingRef = useRef(isLoading);
    useEffect(() => {
      isLoadingRef.current = isLoading;
    }, [isLoading]);

    const handleStartReached = useCallback(() => {
      if (isLoadingRef.current || !hasMore || items.length === 0) return;

      isLoadingRef.current = true;
      onLoadMore();
    }, [onLoadMore, hasMore, items.length]);

    const Header = useCallback(
      () => (
        <>
          {hasMore ? (
            spinnerContent || (
              <div className="flex justify-center items-center py-2 min-h-[40px]">
                {isLoading && <span>Loading...</span>}
              </div>
            )
          ) : (
            <>{isShowLastSeen && lastSeen}</>
          )}
        </>
      ),
      [hasMore, spinnerContent, isLoading, isShowLastSeen, lastSeen],
    );

    const components = useMemo(
      () => ({
        Header,
        Item: VirtuosoItem,
      }),
      [Header],
    );

    return (
      <Virtuoso
        ref={ref}
        className={className}
        data={items}
        totalCount={items.length}
        firstItemIndex={firstItemIndex}
        startReached={handleStartReached}
        initialTopMostItemIndex={items.length - 1}
        computeItemKey={itemKey}
        itemContent={itemTemplate}
        increaseViewportBy={{ top: 10, bottom: 400 }}
        components={components}
        followOutput={(isAtBottom) => {
          if (isAtBottom) return "smooth";
          return false;
        }}
        alignToBottom
      />
    );
  },
);

InfiniteScrollReverse.displayName = "InfiniteScrollReverse";

export default InfiniteScrollReverse;
