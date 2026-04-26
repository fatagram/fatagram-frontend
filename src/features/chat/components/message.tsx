import { ComponentProps } from "@/components/common/component-type";
import { useAuth } from "@/contexts";
import clsx from "clsx";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { useMessages } from "@/features/chat/hooks/use-message";
import { MessageRow, SystemMessageRow } from "./message-row";
import { useGetPariticipantsSeen } from "@/features/chat/hooks/use-conversation";
import { useGetUserProfiles } from "@/features/hooks/use-user-profile";
import InfiniteScrollReverse from "@/components/ui/utils/infinite-scroll-reverse";
import { Skeleton } from "@/components/atoms";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/atoms";
import { useFormatTime } from "@/utils/time";
import { isOnlyEmoji } from "@/utils/string";
import { getMessageBubbleShapeClass, getMessageType } from "@/utils/message";
import { isSystemMessage } from "../helpers/conversation-helpers";

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
  const { getDiffBetween } = useFormatTime();

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
    return messages.map((msg, index) => {
      const prev = index > 0 ? messages[index - 1] : null;
      const next = index < messages.length - 1 ? messages[index + 1] : null;
      const isShowTime = !prev || getDiffBetween(msg.createdAt, prev.createdAt, "minute") > 30;
      const isNextShowTime = next && getDiffBetween(next!.createdAt, msg.createdAt, "minute") > 30;
      const isFirstInGroup = !next || next.senderId !== msg.senderId || isNextShowTime;
      const isLastInGroup = !prev || prev.senderId !== msg.senderId || isShowTime;
      const isOnlyOneInGroup = isFirstInGroup && isLastInGroup;
      const isMyMessage = msg.senderId === userId;
      const isShowAvatar = isFirstInGroup && !isMyMessage;

      const messageBubbleShapeClass = getMessageBubbleShapeClass(
        isMyMessage,
        isFirstInGroup || false,
        isLastInGroup,
        isOnlyOneInGroup || false,
      );

      return {
        ...msg,
        meta: {
          _isFirstInGroup: isFirstInGroup || false,
          _isLastInGroup: isLastInGroup,
          _isOnlyOneInGroup: isOnlyOneInGroup || false,
          _isLastMessage: index === messages.length - 1,
          _isShowTime: isShowTime,
          _isShowAvatar: isShowAvatar || false,
          _isMyMessage: isMyMessage,
          _messageBubbleShapeClass: messageBubbleShapeClass,
          _isOnlyEmoji: isOnlyEmoji(msg.content),
          _type: getMessageType(msg),
          _isShowName: (isLastInGroup && isGroup && !isMyMessage) || false,
          _isOlderThanOneMinute: getDiffBetween(msg.createdAt, new Date(), "second") > 60,
          _shouldAnimate:
            index === messages.length - 1 &&
            getDiffBetween(msg.createdAt, new Date(), "second") < 5,
        },
      };
    });
  }, [messages]);

  const senderIds = useMemo(() => {
    return [...new Set(participantIds)] as string[];
  }, [participantIds]);

  const { userProfileMap } = useGetUserProfiles(senderIds);

  const initialLoading = isPending || isMessagesLoading;

  if (initialLoading && !messages.length) {
    return (
      <div className={clsx("flex flex-col gap-4 p-2 w-full h-full justify-end", className)}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={clsx(
              "flex gap-3 !w-[30%] min-w-[200px]",
              i % 2 === 0 ? "self-end flex-row-reverse" : "self-start",
            )}
          >
            <Skeleton sz="md" variant="circle" className="w-8 h-8 shrink-0" />
            <div
              className={clsx(
                "flex flex-col gap-1 flex-1 w-full",
                i % 2 === 0 ? "items-end" : "items-start",
              )}
            >
              <Skeleton sz="md" className="!w-[60%] !rounded-xl" />
              <Skeleton sz="md" className="!w-[30%] !rounded-xl" />
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
        const isSystemMsg = isSystemMessage(item.type);

        if (isSystemMsg) return <SystemMessageRow message={item} />;

        return (
          <MessageRow
            message={item}
            userId={userId}
            conversationId={conversationId}
            userInfo={userProfileMap[item?.senderId || ""]}
            userProfileMap={userProfileMap}
            className="py-[0.5px] px-1"
            meta={item.meta}
          />
        );
      }}
      hasMore={!!hasNextPage}
      itemKey={(item) => item.clientTempId || item.id || item.sequenceNumber}
      end={lastSeen}
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
