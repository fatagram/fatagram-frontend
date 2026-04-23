import { ComponentProps } from "@/components/common/component-type";
import { useAuth } from "@/contexts";
import clsx from "clsx";
import { forwardRef, RefObject, useEffect, useMemo, useRef } from "react";
import { useMessages } from "@/features/hooks/use-message";
import { MessageRow } from "./message-row";
import { useGetPariticipantsSeen } from "@/features/hooks/use-conversation";
import { useGetUserProfiles } from "@/features/hooks/use-user-profile";
import InfiniteScrollReverse from "@/components/ui/utils/infinite-scroll-reverse";
import { Skeleton } from "@/components/atoms";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/atoms";

interface MessageListProps extends ComponentProps {
  isGroup?: boolean;
  conversationId: string;
  parentRef?: React.RefObject<HTMLDivElement | null>;
  lastSeen?: React.ReactNode;
}

export interface MessageListHandle {
  scrollToBottom: () => void;
}

export const MessageList = forwardRef<MessageListHandle, MessageListProps>(function MessageList({
  isGroup,
  className,
  conversationId,
  lastSeen,
}) {
  const listRef = useRef<any>(null);
  const { t } = useTranslation();
  const { userId } = useAuth();

  const {
    data: _messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isLoading: isMessagesLoading,
  } = useMessages(conversationId, { sortDesc: true, limit: 20 });

  const { data: participantsSeen } = useGetPariticipantsSeen(conversationId);
  const participantIds = useMemo(() => {
    return participantsSeen ? Object.keys(participantsSeen.participantsSeenInfo) : [];
  }, [participantsSeen]);

  const messages = useMemo(() => {
    return _messages ? _messages.pages.flatMap((page) => page.items).reverse() : [];
  }, [_messages]);

  const senderIds = useMemo(() => {
    return [...new Set(participantIds)] as string[];
  }, [participantIds]);

  const { userProfileMap } = useGetUserProfiles(senderIds);

  const initialLoading = isPending || isMessagesLoading;

  const prevMessagesCount = useRef(messages.length);

  useEffect(() => {
    if (!listRef.current || messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    const isMyMessage = lastMsg?.senderId === userId;
    const isActuallyNewMessage = messages.length - prevMessagesCount.current < 5;

    if (isMyMessage && isActuallyNewMessage) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex(messages.length - 1, { align: "end" });
      });
    }

    prevMessagesCount.current = messages.length;
  }, [messages.length, userId]);

  if (initialLoading && !messages.length) {
    return (
      <div className={clsx("flex flex-col gap-4 py-2 w-full h-full justify-end", className)}>
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
      items={messages}
      onLoadMore={fetchNextPage}
      className={clsx("px-1 sm:scrollbar-default scrollbar-hide", className)}
      itemTemplate={(item: any, index: number, ref: RefObject<HTMLDivElement | null> | null) => {
        const nextMessage = index < messages.length - 1 ? messages[index + 1] : undefined;
        const prevMessage = index > 0 ? messages[index - 1] : undefined;
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
            className="py-[0.5px] px-1"
          />
        );
      }}
      hasMore={!!hasNextPage}
      isLoading={isFetchingNextPage}
      gap={2}
      itemKey={(item: any) => item.id || item.sequenceNumber}
      isShowLastSeen={true}
      lastSeen={lastSeen}
      listRef={listRef}
      spinner={
        <div className="flex justify-center w-full select-none">
          <div
            className={clsx(
              "flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10",
              "border border-primary-500/50 text-xs text-primary-500",
              "w-fit min-w-[100px]",
            )}
          >
            <i className="fa-solid fa-circle-notch animate-spin" />
            <Text sz="sm" className="!text-primary-500">
              {t("common:conversations.loadingOldMessages")}
            </Text>
          </div>
        </div>
      }
    />
  );
});
