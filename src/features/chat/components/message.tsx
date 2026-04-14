import { ComponentProps } from "@/components/common/component-type";
import { useAuth } from "@/contexts";
import clsx from "clsx";
import { forwardRef, RefObject, useImperativeHandle, useMemo, useRef } from "react";
import { useMessages } from "@/features/hooks/use-message";
import { MessageRow } from "./message-row";
import { useGetPariticipantsSeen } from "@/features/hooks/use-conversation";
import { useGetUserProfiles } from "@/features/hooks/use-user-profile";
import InfiniteScrollReverse from "@/components/ui/utils/infinite-scroll-reverse";

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
  } = useMessages(conversationId, { sortDesc: true, limit: 20 });

  const { data: _ } = useGetPariticipantsSeen(conversationId);

  const messages = useMemo(() => {
    return _messages ? _messages.pages.flatMap((page) => page.items) : [];
  }, [_messages]);

  const senderIds = useMemo(() => {
    return [...new Set(messages.map((m) => m.senderId).filter(Boolean))] as string[];
  }, [messages]);

  const { userProfileMap } = useGetUserProfiles(senderIds);

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
