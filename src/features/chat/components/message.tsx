import { ComponentProps } from "@/components/common/component-type";
import { useAuth } from "@/contexts";
import clsx from "clsx";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
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

export const MessageList = forwardRef<MessageListHandle, MessageListProps>(function MessageList(
  { isGroup, className, conversationId, lastSeen, parentRef },
  ref,
) {
  const { t } = useTranslation();
  const { userId } = useAuth();

  const localScrollRef = useRef<HTMLDivElement>(null);
  const scrollRef = parentRef || localScrollRef;
  const prevNewestMessageId = useRef<string | number | null>(null);

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    },
  }));

  const {
    data: _messages,
    fetchNextPage,
    hasNextPage,
    isPending,
    isLoading: isMessagesLoading,
  } = useMessages(conversationId, { sortDesc: true, limit: 30 });

  const { data: participantsSeen } = useGetPariticipantsSeen(conversationId);
  const participantIds = useMemo(() => {
    return participantsSeen ? Object.keys(participantsSeen.participantsSeenInfo) : [];
  }, [participantsSeen]);

  const messages = useMemo(() => {
    return _messages ? _messages.pages.flatMap((page) => page.items).reverse() : [];
  }, [_messages]);

  useEffect(() => {
    if (!messages.length) return;

    const newestMessage = messages[messages.length - 1];

    if (newestMessage.id !== prevNewestMessageId.current) {
      if (newestMessage.senderId === userId) {
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
          }
        });
      }
      prevNewestMessageId.current = newestMessage.id;
    }
  }, [messages, userId, scrollRef]);

  const messagesWithMetadata = useMemo(() => {
    return messages.map((msg, index) => ({
      ...msg,
      _prev: index - 1 >= 0 ? messages[index - 1] : undefined,
      _next: index + 1 < messages.length ? messages[index + 1] : undefined,
      _isLastMessage: index === messages.length - 1,
    }));
  }, [messages]);

  const senderIds = useMemo(() => {
    return [...new Set(participantIds)] as string[];
  }, [participantIds]);

  const { userProfileMap } = useGetUserProfiles(senderIds);

  const initialLoading = isPending || isMessagesLoading;

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
      scrollRef={scrollRef}
      items={messagesWithMetadata}
      loadMore={fetchNextPage}
      className={clsx("px-1 sm:scrollbar-default scrollbar-hide", className)}
      renderItem={(item) => {
        return (
          <div
            style={{
              animation: "messageFadeIn 0.3s ease",
            }}
          >
            <MessageRow
              message={item}
              prevMessage={item._prev}
              nextMessage={item._next}
              userId={userId}
              isGroup={isGroup}
              conversationId={conversationId}
              userInfo={userProfileMap[item?.senderId || ""]}
              userProfileMap={userProfileMap}
              className="py-[0.5px] px-1"
              isLastMessage={item._isLastMessage}
            />
          </div>
        );
      }}
      hasMore={!!hasNextPage}
      itemKey={(item) => item.clientTempId || item.id || item.sequenceNumber}
      end={lastSeen}
      canKeepPosition={messages[messages.length - 1]?.senderId !== userId} // Nếu tin nhắn cuối cùng không phải của mình thì giữ vị trí, ngược lại cuộn xuống dưới --- IGNORE ---
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
