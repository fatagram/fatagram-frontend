import { Text, Avatar } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import { useAuth } from "@/contexts";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import clsx from "clsx";
import InfiniteScroll from "@/components/ui/utils/infinite-scroll";
import { useRef } from "react";
import { MessageResponseDto } from "@/api/message/dto/message.dto";
import { useFormatTime } from "@/utils/format-time";

interface MessageProps extends ComponentProps {
  message: MessageResponseDto;
  isShowName?: boolean;
  isShowTime?: boolean;
  hasAvatar?: boolean;
  isMyMessage?: boolean;
  messageClassName?: string;
  ref: React.RefObject<HTMLDivElement | null> | null;
}

const MessageRow: React.FC<MessageProps> = ({
  message,
  isShowName = false,
  isShowTime = true,
  hasAvatar,
  isMyMessage,
  className,
  messageClassName,
  ref,
}) => {
  const { data: userInfo } = useGetUserProfile(message.senderId!);
  const { formatSmartTimestamp } = useFormatTime();
  return (
    <div className={clsx("flex flex-col", className)} ref={ref}>
      {isShowTime && (
        <Text sz="xs-1" className="text-center my-2">
          {formatSmartTimestamp(message.createdAt)}
        </Text>
      )}
      <div className={clsx("flex gap-2 w-full", isMyMessage ? "flex-row-reverse" : "flex-row")}>
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
        <div className="flex flex-col max-w-[75%]">
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
              "px-3 py-1 break-all rounded-2xl shadow-sm",
              isMyMessage ? "bg-primary-600" : "bg-bg-fourth",
              messageClassName,
            )}
          >
            <Text
              sz="sm-1"
              wrap="whitespace-normal"
              className={clsx(isMyMessage ? "text-text-message" : "text-text-main")}
            >
              {message.content}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MessageListProps extends ComponentProps {
  conversationType?: any;
  messages: MessageResponseDto[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  conversationType,
  messages,
  className,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage = () => {},
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
            const isLastMessageInGroup =
              messages.indexOf(message) === messages.length - 1 ||
              messages[messages.indexOf(message) + 1]?.senderId !== message.senderId;
            const isFirstMessageInGroup =
              messages.indexOf(message) === 0 ||
              messages[messages.indexOf(message) - 1]?.senderId !== message.senderId;
            const isOnlyMessageInGroup = isFirstMessageInGroup && isLastMessageInGroup;
            const isMyMessage = message.senderId === userId;

            return (
              <MessageRow
                ref={ref}
                message={message}
                isShowName={isLastMessageInGroup && !isMyMessage && conversationType === "group"}
                isMyMessage={isMyMessage}
                hasAvatar={isFirstMessageInGroup}
                className={clsx(isLastMessageInGroup ? "mt-[0.5rem]" : "mt-0")}
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
                isShowTime={
                  index === messages.length - 1 ||
                  getDiffBetween(message.createdAt, messages[index + 1].createdAt, "minute") > 30
                }
              />
            );
          }}
          hasMore={!!hasNextPage}
          isLoading={isFetchingNextPage}
          loadingSkeleton={messageSkeleton}
          numberOfSkeletons={2}
          gap={2}
          desc={true}
          parentRef={containerRef}
          itemKey={(item) => item.id}
        />
      </div>
    </div>
  );
};
