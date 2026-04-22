import { ComponentProps } from "@/components/common/component-type";
import { useAuth } from "@/contexts";
import clsx from "clsx";
import {
  forwardRef,
  useCallback,
  useDeferredValue,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMessages } from "@/features/hooks/use-message";
import { MessageRow } from "./message-row";
import { useGetPariticipantsSeen } from "@/features/hooks/use-conversation";
import { useGetUserProfiles } from "@/features/hooks/use-user-profile";
import InfiniteScrollReverse from "@/components/ui/utils/infinite-scroll-reverse";
import { Skeleton } from "@/components/atoms";
import { VirtuosoHandle } from "react-virtuoso";
import { useTranslation } from "react-i18next";

interface MessageListProps extends ComponentProps {
  isGroup?: boolean;
  conversationId: string;
  parentRef?: React.RefObject<HTMLDivElement | null>;
  lastSeen?: React.ReactNode;
}

const INITIAL_LIMIT = 40;
const LOAD_MORE_CHUNK = 20;

export interface MessageListHandle {
  scrollToBottom: () => void;
}

export const MessageList = forwardRef<MessageListHandle, MessageListProps>(function MessageList(
  { isGroup, className, conversationId, parentRef, lastSeen },
  ref,
) {
  const { t } = useTranslation();
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);
  const [isLocalPaging, setIsLocalPaging] = useState(false);

  const { userId } = useAuth();
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const {
    data: _messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isLoading: isMessagesLoading,
  } = useMessages(conversationId, { sortDesc: true, limit: 20 });

  const allCachedMessages = useMemo(() => {
    return _messages ? _messages.pages.flatMap((page) => page.items) : [];
  }, [_messages]);

  const messagesWithContext = useMemo(() => {
    const visibleMessages = [...allCachedMessages].reverse();

    return visibleMessages.map((msg, index) => ({
      ...msg,
      _prev: index > 0 ? visibleMessages[index - 1] : undefined,
      _next: index < visibleMessages.length - 1 ? visibleMessages[index + 1] : undefined,
      _isLatest: index === visibleMessages.length - 1,
    }));
  }, [allCachedMessages]);

  const deferredMessages = useDeferredValue(messagesWithContext);

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      virtuosoRef.current?.scrollToIndex({
        index: deferredMessages.length - 1,
        behavior: "smooth",
      });
    },
  }));

  const handleLoadMore = useCallback(() => {
    if (isLocalPaging || isFetchingNextPage) return;

    const totalInRAM = allCachedMessages.length;

    if (displayLimit < totalInRAM) {
      setIsLocalPaging(true);
      setTimeout(() => {
        setDisplayLimit((prev) => prev + LOAD_MORE_CHUNK);
        setIsLocalPaging(false);
      }, 50);
    } else if (hasNextPage) {
      fetchNextPage();
    }
  }, [
    displayLimit,
    allCachedMessages.length,
    isLocalPaging,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  ]);

  const initialLoading = isPending || isMessagesLoading;
  const hasMoreToShow = displayLimit < allCachedMessages.length || hasNextPage;
  const showSpinner = isLocalPaging || isFetchingNextPage;

  // Seen Infos
  const { data: participantsSeen } = useGetPariticipantsSeen(conversationId);
  const participantIds = useMemo(() => {
    return participantsSeen ? Object.keys(participantsSeen.participantsSeenInfo) : [];
  }, [participantsSeen]);

  const senderIds = useMemo(() => {
    return [...new Set(participantIds)] as string[];
  }, [participantIds]);

  const { userProfileMap } = useGetUserProfiles(senderIds);

  // Render
  if (initialLoading && !allCachedMessages.length) {
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
      items={deferredMessages}
      onLoadMore={handleLoadMore}
      className={clsx("flex flex-col gap-[0.1rem]", className)}
      itemTemplate={(_index: number, item: any) => {
        return (
          <MessageRow
            message={item}
            prevMessage={item._prev}
            nextMessage={item._next}
            userId={userId}
            isGroup={isGroup}
            conversationId={conversationId}
            userInfo={userProfileMap[item?.senderId || ""]}
            userProfileMap={userProfileMap}
            isLatestMessage={item._isLatest}
            className="py-[0.5px] pl-2 pr-1"
          />
        );
      }}
      hasMore={!!hasMoreToShow}
      isLoading={showSpinner}
      gap={2}
      parentRef={parentRef}
      itemKey={(_index, item) => item.id || item._id}
      isShowLastSeen={true}
      lastSeen={lastSeen}
      ref={virtuosoRef}
      spinnerContent={
        <div className="flex justify-center w-full select-none">
          <div
            className={clsx(
              "flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10",
              "border border-primary-500/50 text-xs text-primary-500",
              "w-[11%] min-w-[100px]",
            )}
          >
            <i className="fa-solid fa-circle-notch animate-spin" />
            <span>{t("common:conversations.loadingOldMessages")}</span>
          </div>
        </div>
      }
    />
  );
});
