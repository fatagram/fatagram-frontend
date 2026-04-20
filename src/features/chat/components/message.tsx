import { ComponentProps } from "@/components/common/component-type";
import { useAuth } from "@/contexts";
import clsx from "clsx";
import { forwardRef, RefObject, useImperativeHandle, useMemo, useRef } from "react";
import { useMessages } from "@/features/hooks/use-message";
import { MessageRow } from "./message-row";
import { useGetPariticipantsSeen } from "@/features/hooks/use-conversation";
import { useGetUserProfiles } from "@/features/hooks/use-user-profile";
import InfiniteScrollReverse from "@/components/ui/utils/infinite-scroll-reverse";
import { Skeleton } from "@/components/atoms";

interface MessageListProps extends ComponentProps {
  isGroup?: boolean;
  conversationId: string;
  parentRef?: React.RefObject<HTMLDivElement | null>;
  lastSeen?: React.ReactNode;
}

export interface MessageListHandle {
  scrollToBottom: () => void;
}

export const MessageList = forwardRef<MessageListHandle, MessageListProps>(function MessageList(
  { isGroup, className, conversationId, parentRef, lastSeen },
  ref,
) {
  const { userId } = useAuth();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    },
  }));

  const {
    data: _messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isLoading: isMessagesLoading,
  } = useMessages(conversationId, { sortDesc: true, limit: 20 });

  const { data: _ } = useGetPariticipantsSeen(conversationId);

  const messages = useMemo(() => {
    return _messages ? _messages.pages.flatMap((page) => page.items) : [];
  }, [_messages]);

  const senderIds = useMemo(() => {
    return [...new Set(messages.map((m) => m.senderId).filter(Boolean))] as string[];
  }, [messages]);

  const { userProfileMap } = useGetUserProfiles(senderIds);

  const initialLoading = isPending || isMessagesLoading;

  if (initialLoading && !messages.length) {
    return (
      <div className={clsx("flex flex-col gap-4 px-4 py-2 w-full", className)}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={clsx(
              "flex gap-3 w-[80%]",
              i % 2 === 0 ? "self-end flex-row-reverse" : "self-start",
            )}
          >
            <Skeleton sz="md" variant="circle" className="w-8 h-8 shrink-0" />
            <div
              className={clsx(
                "flex flex-col gap-2 flex-1",
                i % 2 === 0 ? "items-end" : "items-start",
              )}
            >
              <Skeleton sz="md" className="w-[80%]" />
              <Skeleton sz="md" className="w-[30%]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <InfiniteScrollReverse
      ref={scrollContainerRef}
      items={messages}
      onLoadMore={fetchNextPage}
      className={clsx(
        "flex flex-col gap-[0.1rem] px-1 sm:scrollbar-default scrollbar-hide",
        className,
      )}
      itemTemplate={(item: any, index: number, ref: RefObject<HTMLDivElement | null> | null) => {
        const prevMessage = index < messages.length - 1 ? messages[index + 1] : undefined;
        const nextMessage = index > 0 ? messages[index - 1] : undefined;
        return (
          <MessageRow
            ref={ref}
            message={item}
            prevMessage={prevMessage}
            nextMessage={nextMessage}
            userId={userId}
            index={index}
            isGroup={isGroup}
            conversationId={conversationId}
            userInfo={userProfileMap[item?.senderId || ""]}
            userProfileMap={userProfileMap}
          />
        );
      }}
      hasMore={!!hasNextPage}
      isLoading={isFetchingNextPage}
      gap={2}
      parentRef={parentRef}
      itemKey={(item) => item.id}
      isShowLastSeen={true}
      lastSeen={lastSeen}
    />
  );
});
