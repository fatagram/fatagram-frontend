import { ComponentProps } from "@/components/common/component-type";
import { useAuth } from "@/contexts";
import clsx from "clsx";
import InfiniteScroll from "@/components/ui/utils/infinite-scroll-flex";
import { RefObject, useMemo, useRef } from "react";
import { useMessages } from "@/features/hooks/use-message";
import { MessageRow } from "./message-row";
import { Skeleton } from "@/components/atoms";
import { useGetPariticipantsSeen } from "@/features/hooks/use-conversation";

interface MessageListProps extends ComponentProps {
  isGroup?: boolean;
  conversationId: string;
  parentRef?: React.RefObject<HTMLDivElement | null>;
  lastSeen?: React.ReactNode;
}

export const MessageList: React.FC<MessageListProps> = ({
  isGroup,
  className,
  conversationId,
  parentRef,
  lastSeen,
}) => {
  const { userId } = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    data: _messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(conversationId, { sortDesc: true, limit: 20 });

  const { data: _ } = useGetPariticipantsSeen(conversationId);

  const messages = useMemo(() => {
    return _messages ? _messages.pages.flatMap((page) => page.items) : [];
  }, [_messages]);

  const messageSkeleton = (
    <div className="flex gap-2 w-full">
      <Skeleton variant="circle" sz="md" />
      <div className="flex flex-col w-[60%] gap-1">
        <Skeleton variant="text" sz="sm" className="w-[150px]" />
        <Skeleton variant="text" sz="sm" className="w-[100px]" />
      </div>
    </div>
  );

  return (
    <div className={clsx("flex flex-col gap-[0.1rem] ", className)} ref={containerRef}>
      <InfiniteScroll
        items={messages}
        onLoadMore={fetchNextPage}
        className="flex flex-col gap-[0.1rem] "
        itemTemplate={(item: any, index: number, ref: RefObject<HTMLDivElement | null> | null) => (
          <MessageRow
            ref={ref}
            message={item}
            messages={messages}
            userId={userId}
            index={index}
            isGroup={isGroup}
            conversationId={conversationId}
          />
        )}
        hasMore={!!hasNextPage}
        isLoading={isFetchingNextPage}
        loadingSkeleton={messageSkeleton}
        numberOfSkeletons={2}
        gap={2}
        desc={true}
        parentRef={parentRef}
        itemKey={(item) => item.id}
        isShowLastSeen={true}
        lastSeen={lastSeen}
      />
    </div>
  );
};
