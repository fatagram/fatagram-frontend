import { Text, Avatar } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import { useAuth } from "@/contexts";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import clsx from "clsx";
import InfiniteScroll from "@/components/ui/utils/infinite-scroll";
import { useEffect, useRef, useState } from "react";
import { Message } from "@/api/message/dto/message.dto";
import { useFormatTime } from "@/utils/format-time";

interface MessageProps extends ComponentProps {
  message: Message;
  isShowName?: boolean;
  isShowTime?: boolean;
  isFooterVisible?: boolean;
  hasAvatar?: boolean;
  isMyMessage?: boolean;
  messageClassName?: string;
  ref: React.RefObject<HTMLDivElement | null> | null;
}

const MessageRow: React.FC<MessageProps> = ({
  message,
  isShowName = false,
  isShowTime = true,
  isFooterVisible = true,
  hasAvatar,
  isMyMessage,
  className,
  messageClassName,
  ref,
}) => {
  const [hasDelayed, setHasDelayed] = useState(false);
  const { data: userInfo } = useGetUserProfile(message.senderId!);
  const { getDiffBetween, formatTime, formatSmartTimestamp } = useFormatTime();
  const isPending = message.status === "pending";
  const isFailed = message.status === "failed";

  useEffect(() => {
    if (isPending) {
      setTimeout(() => {
        setHasDelayed(true);
      }, 2000);
    }
  }, [isPending]);

  return (
    <div className={clsx("flex flex-col", className)} ref={ref}>
      {isShowTime && (
        <Text sz="xs-1" className="text-center my-2">
          {formatSmartTimestamp(message.createdAt)}
        </Text>
      )}
      <div
        className={clsx(
          "flex gap-2 w-full",
          isMyMessage ? "flex-row-reverse" : "flex-row",
          hasDelayed && "opacity-50",
        )}
      >
        {!isMyMessage && (
          <Avatar
            className={clsx(
              "flex-shrink-0 self-start",
              isMyMessage && "order-2",
              !hasAvatar && "invisible",
            )}
            src={userInfo?.infos.avatar}
            alt="Avatar"
            sz="xs-2"
          />
        )}
        <div className={clsx("flex flex-col max-w-[75%]")}>
          {isShowName && (
            <Text
              sz="xs-1"
              className={clsx("mb-1", isMyMessage ? "text-right mr-3" : "text-left ml-3")}
            >
              {userInfo?.infos.fullName}
            </Text>
          )}
          <div
            className={clsx(
              "px-3 py-1 break-all rounded-2xl shadow-sm relative self-end",
              isMyMessage ? (isFailed ? "bg-primary-800" : "bg-primary-600") : "bg-bg-fourth",
              isFailed && "border border-red-500 border-2 opacity-50",
              messageClassName,
            )}
          >
            <Text
              sz="sm-1"
              wrap="whitespace-normal"
              className={clsx(isMyMessage ? "text-text-message" : "text-text-main")}
            >
              {message.content}
            </Text>{" "}
            {hasDelayed && (
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-2 h-2 aspect-square animate-spin rounded-full border-[1.5px] border-gray-300 border-t-transparent"></div>
              </div>
            )}
          </div>
          <div
            className={clsx(
              "flex items-center justify-end mr-2 overflow-hidden transition-all duration-200",
              isFooterVisible ? "h-[15px] mt-1" : "h-0 mt-0",
            )}
          >
            {isFooterVisible && isMyMessage && !isPending && !isFailed && (
              <Text sz="xs-1">
                Đã gửi{" "}
                {getDiffBetween(message.createdAt, new Date(), "second") > 60 && (
                  <Text sz="xs-1">{formatTime(message.createdAt)}</Text>
                )}
              </Text>
            )}
          </div>
        </div>
        {isFailed && (
          <div className="flex items-center justify-center">
            <i className="fa-solid fa-circle-exclamation text-red-500"></i>
          </div>
        )}
      </div>
    </div>
  );
};

interface MessageListProps extends ComponentProps {
  conversationType?: any;
  messages: Message[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  parentRef?: React.RefObject<HTMLDivElement | null>;
}

export const MessageList: React.FC<MessageListProps> = ({
  conversationType,
  messages,
  className,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage = () => {},
  parentRef,
}) => {
  const { userId } = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { getDiffBetween } = useFormatTime();

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
          itemInRow={1}
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
