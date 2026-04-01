import { ConversationDto } from "@/api/conversation/dto/conversation.dto";
import { Text, Avatar, Textbox, Skeleton } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import { useAuth } from "@/contexts";
import { useConversations } from "@/features/hooks/use-conversation";
import { useFormatTime } from "@/utils/format-time";
import clsx from "clsx";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { isSystemMessage } from "../helpers/conversation-helpers";
import { MessageType } from "@/types/entities/message.type";
import { useLocation } from "react-router-dom";
import { useOpenChat } from "../hooks/use-open-chat";
import InfiniteScrollFlex from "@/components/ui/utils/infinite-scroll-flex";

interface ChatListProps extends ComponentProps {
  onConversationClick?: (conversationId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ className, onConversationClick }) => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const { formatTime } = useFormatTime();
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching } = useConversations();
  const { openChat } = useOpenChat();
  const { renderConversationName, renderSystemMessage } = useRenderConversationContent();
  const conversations = data?.pages.flatMap((page) => page.items) || [];
  const location = useLocation();

  const currentConversationId = location.pathname.split("/").pop();

  const handleConversationClick = useCallback(
    async (conversationId: string) => {
      onConversationClick?.(conversationId);
      openChat(conversationId);
    },
    [onConversationClick, openChat],
  );

  return (
    <div className={clsx("flex flex-col p-2", className)}>
      <Textbox
        placeholder={t("common:conversations.search")}
        sz="sm"
        className="border-0 w-full"
        type="search"
      />
      <div className="flex-1 overflow-y-auto px-2 mt-2 ">
        <InfiniteScrollFlex
          className="scrollbar-hide sm:scrollbar-default"
          items={conversations}
          onLoadMore={fetchNextPage}
          hasMore={hasNextPage}
          itemTemplate={(item: any) => {
            const conversation = item as ConversationDto;
            const lastMessage = conversation.lastMessage;
            const isRead = conversation.lastMessage?.id === conversation.myLastSeenMessageId;
            const isOtherUserRead =
              conversation.lastMessage?.id === conversation.otherLastSeenMessageId;
            return (
              <div
                key={conversation.id}
                className={clsx(
                  "flex gap-2 px-1 py-3",
                  "hover:bg-bg-fourth rounded-lg transition-colors",
                  "cursor-pointer",
                  conversation.id === currentConversationId && "bg-bg-fourth",
                )}
                onClick={() => handleConversationClick(conversation.id)}
              >
                <Avatar src={conversation.avatarUrl ?? ""} alt="Conversation Avatar" sz="md" />
                <div className="flex flex-col gap-1 min-w-0 justify-center">
                  <Text
                    sz="sm"
                    weight={isRead ? "regular" : "bold"}
                    className={clsx("line-clamp-1 truncate max-w-full")}
                  >
                    {renderConversationName(conversation)}
                  </Text>
                  <div className="flex items-center opacity-80">
                    <Text
                      sz="xs"
                      className="truncate max-w-full"
                      weight={isRead ? "regular" : "bold"}
                    >
                      {lastMessage
                        ? isSystemMessage(lastMessage?.type || MessageType.System)
                          ? renderSystemMessage(lastMessage)
                          : userId === lastMessage?.senderId
                            ? t("common:conversations.you") + ": " + lastMessage?.content
                            : lastMessage?.senderFullName + ": " + lastMessage?.content
                        : "Unknown"}
                    </Text>
                    <Text sz="xs" className="mx-2 shrink-0" weight={isRead ? "regular" : "bold"}>
                      •
                    </Text>
                    <Text sz="xs" className="shrink-0" weight={isRead ? "regular" : "bold"}>
                      {formatTime(conversation.lastMessage?.createdAt ?? "")}
                    </Text>
                  </div>
                </div>
                <div className="flex-1 flex">
                  {!isRead && (
                    <div className="my-auto ml-auto w-2 h-2 bg-primary-500 rounded-full"></div>
                  )}
                  {!conversation.isGroup && isOtherUserRead && (
                    <Avatar
                      sz="xs"
                      src={conversation.avatarUrl || ""}
                      alt={"seen"}
                      className="my-auto ml-auto"
                    />
                  )}
                </div>
              </div>
            );
          }}
          itemKey={(item) => item.id}
          isLoading={isLoading || isFetching}
          loadingSkeleton={
            <div className={clsx("flex items-center my-2")}>
              <Skeleton sz="md" variant="circle" />
              <div className={clsx("flex flex-col w-full flex-1 gap-2 ml-2")}>
                <Skeleton className={clsx("w-full")} sz="sm" />
                <Skeleton className={clsx("w-[50%]")} sz="sm" />
              </div>
            </div>
          }
          numberOfSkeletons={2}
          emptyComponent={
            <div className="flex flex-col items-center justify-center gap-2 mt-4 min-h-[200px]">
              <i className="fa-solid fa-message text-3xl text-gray-400" />
              <Text sz="md" color="secondary">
                {t("common:conversations.no-conversations")}
              </Text>
            </div>
          }
        />
      </div>
    </div>
  );
};
