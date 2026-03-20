import { Text, Avatar } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import { useAuth } from "@/contexts";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import { Message } from "@/types/entities/message.type";
import clsx from "clsx";
import InfiniteScroll from "@/components/ui/utils/infinite-scroll";
import { useEffect, useRef } from "react";

interface MessageProps extends ComponentProps {
  content: string;
  type?: any;
  senderId?: string;
  isShowName?: boolean;
  hasAvatar?: boolean;
  isMyMessage?: boolean;
  messageClassName?: string;
  ref: React.RefObject<HTMLDivElement | null> | null;
}

export const MessageRow: React.FC<MessageProps> = ({
  content,
  senderId,
  isShowName = false,
  hasAvatar,
  isMyMessage,
  className,
  messageClassName,
  ref,
}) => {
  const { data: userInfo } = useGetUserProfile(senderId!);
  return (
    <div
      className={clsx(
        "flex gap-2 w-full",
        isMyMessage ? "justify-end" : "justify-start",
        className,
      )}
      ref={ref}
    >
      {!isMyMessage && (
        <Avatar
          className={clsx(
            "flex-shrink-0 self-end",
            isMyMessage && "order-2",
            !hasAvatar && "invisible",
          )}
          src={userInfo?.infos.avatar}
          alt="Avatar"
          sz="xs-2"
        />
      )}
      <div className="flex flex-col max-w-[75%] ">
        {isShowName && (
          <Text sz="xs-1" className={clsx("mb-1 ml-3", isMyMessage ? "text-right" : "text-left")}>
            {userInfo?.infos.fullName}
          </Text>
        )}
        <div
          className={clsx(
            "px-3 py-1 break-words rounded-2xl shadow-sm self-start",
            isMyMessage ? "bg-blue-500 text-white" : "bg-gray-600 text-white",
            messageClassName,
          )}
        >
          <Text sz="sm-1" className="">
            {content}
          </Text>
        </div>
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
  console.log("has next page:", hasNextPage, "is fetching next page:", isFetchingNextPage);

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
            _index: number,
            ref: React.RefObject<HTMLDivElement | null> | null,
          ) => {
            const message = item as Message;
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
                key={message.id}
                ref={ref}
                content={message.content}
                senderId={message.senderId}
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
        />
      </div>
    </div>
  );
};
