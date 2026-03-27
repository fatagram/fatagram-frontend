import { ComponentProps } from "@/components/common/component-type";
import { useAuth } from "@/contexts";
import clsx from "clsx";
import InfiniteScroll from "@/components/ui/utils/infinite-scroll-flex";
import { useRef } from "react";
import { useFormatTime } from "@/utils/format-time";
import { useMessages } from "@/features/hooks/use-message";
import { MessageRow } from "./message-row";

interface MessageListProps extends ComponentProps {
  conversationType?: any;
  conversationId: string;
  parentRef?: React.RefObject<HTMLDivElement | null>;
}

export const MessageList: React.FC<MessageListProps> = ({
  conversationType,
  className,
  conversationId,
  parentRef,
}) => {
  const { userId } = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { getDiffBetween } = useFormatTime();

  const {
    data: _messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(conversationId, { sortDesc: true, limit: 20 });
  const messages = _messages ? _messages.pages.flatMap((page) => page.items) : [];

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
            ref: React.RefObject<HTMLDivElement | null> | null,
          ) => {
            const message = item;
            const isShowTime =
              index === messages.length - 1 ||
              getDiffBetween(message.createdAt, messages[index + 1].createdAt, "minute") > 30;
            const isPrevMessageShowTime =
              index === 0 ||
              getDiffBetween(message.createdAt, messages[index - 1].createdAt, "minute") > 30;
            const isLastMessageInGroup =
              messages.indexOf(message) === messages.length - 1 ||
              messages[messages.indexOf(message) + 1]?.senderId !== message.senderId ||
              isShowTime;
            const isFirstMessageInGroup =
              messages.indexOf(message) === 0 ||
              messages[messages.indexOf(message) - 1]?.senderId !== message.senderId ||
              isPrevMessageShowTime;
            const isOnlyMessageInGroup = isFirstMessageInGroup && isLastMessageInGroup;
            const isMyMessage = message.senderId === userId;

            return (
              <MessageRow
                ref={ref}
                message={message}
                isShowName={isLastMessageInGroup && !isMyMessage && conversationType === "group"}
                isMyMessage={isMyMessage}
                hasAvatar={isFirstMessageInGroup}
                className={clsx(
                  isLastMessageInGroup ? "mt-[0.5rem]" : "mt-0",
                  index === 0 ? "mb-[0.5rem]" : "mb-0",
                )}
                messageClassName={clsx(
                  isLastMessageInGroup ? (isMyMessage ? "rounded-br-none" : "rounded-bl-none") : "",
                  isFirstMessageInGroup
                    ? isMyMessage
                      ? "rounded-tr-none"
                      : "rounded-tl-none"
                    : "",
                  !isFirstMessageInGroup && !isLastMessageInGroup
                    ? isMyMessage
                      ? "rounded-tr-none rounded-br-none"
                      : "rounded-tl-none rounded-bl-none"
                    : "",
                  isOnlyMessageInGroup ? "!rounded-2xl" : "",
                )}
                isShowTime={isShowTime}
                isFooterVisible={index === 0 && !(!message.isGroup && !isMyMessage)}
              />
            );
          }}
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
