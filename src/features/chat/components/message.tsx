import { ComponentProps } from "@/components/common/component-type";
import { useAuth } from "@/contexts";
import clsx from "clsx";
import InfiniteScroll from "@/components/ui/utils/infinite-scroll-flex";
import { RefObject, useMemo, useRef } from "react";
import { useMessages } from "@/features/hooks/use-message";
import { MessageRow } from "./message-row";

interface MessageListProps extends ComponentProps {
  isGroup?: boolean;
  conversationId: string;
  parentRef?: React.RefObject<HTMLDivElement | null>;
}

export const MessageList: React.FC<MessageListProps> = ({
  isGroup,
  className,
  conversationId,
  parentRef,
}) => {
  const { userId } = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    data: _messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(conversationId, { sortDesc: true, limit: 20 });
  const messages = useMemo(() => {
    return _messages ? _messages.pages.flatMap((page) => page.items) : [];
  }, [_messages]);

  const messageSkeleton = (
    <div className="flex gap-2 w-full animate-pulse">
      <div className="w-8 h-8 bg-gray-700 rounded-full flex-shrink-0"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  );

  return (
    <div
      className={clsx("flex flex-col gap-[0.1rem] overflow-y-auto", className)}
      ref={containerRef}
    >
      <div className="relative">
        <InfiniteScroll
          items={messages}
          onLoadMore={fetchNextPage}
          className="flex flex-col gap-[0.1rem]"
          itemTemplate={(
            item: any,
            index: number,
            ref: RefObject<HTMLDivElement | null> | null,
          ) => (
            <MessageRow
              ref={ref}
              message={item}
              messages={messages}
              userId={userId}
              index={index}
              isGroup={isGroup}
            />
          )}
          hasMore={!!hasNextPage}
          isLoading={isFetchingNextPage}
          loadingSkeleton={messageSkeleton}
          numberOfSkeletons={2}
          gap={2}
          desc={true}
          parentRef={parentRef ?? containerRef}
          itemKey={(item) => item.id}
        />
      </div>
    </div>
  );
};
