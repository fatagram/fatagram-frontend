import { ConversationDto } from "@/api/conversation/dto/conversation.dto";
import { Text, Avatar, Textbox, Skeleton } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import InfiniteScrollFlex from "@/components/ui/utils/infinite-scroll-flex";
import { useAuth } from "@/contexts";
import { useConversations } from "@/features/hooks/use-conversation";
import { useFormatTime } from "@/utils/format-time";
import clsx from "clsx";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { isSystemMessage } from "../helpers/conversation-helpers";
import { MessageType } from "@/types/entities/message.type";

interface ChatListProps extends ComponentProps {
  onConversationClick?: (conversationId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ className, onConversationClick }) => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const { formatTime } = useFormatTime();
  const { data, fetchNextPage, isLoading, isFetching } = useConversations();
  const { renderConversationName, renderSystemMessage } = useRenderConversationContent();
  const conversations = data?.pages.flatMap((page) => page.items) || [];

  const handleConversationClick = useCallback(
    (conversationId: string) => {
      onConversationClick?.(conversationId);
    },
    [onConversationClick],
  );

  return (
    <div className={clsx("flex flex-col p-2 overflow-hidden h-full", className)}>
      <Textbox
        placeholder={t("common:conversations.search")}
        sz="xs-3"
        className="border-0 w-full"
      />
      <div className="flex-1 overflow-y-auto mt-2">
        <InfiniteScrollFlex
          items={conversations}
          onLoadMore={fetchNextPage}
          itemTemplate={(item: any) => {
            const conversation = item as ConversationDto;
            const lastMessage = conversation.lastMessage;
            return (
              <div
                key={conversation.id}
                className={clsx(
                  "flex gap-2 px-1 py-2",
                  "hover:bg-bg-fourth rounded-lg transition-colors",
                  "cursor-pointer flex-1",
                )}
                onClick={() => handleConversationClick(conversation.id)}
              >
                <Avatar src={conversation.avatarUrl ?? ""} alt="Conversation Avatar" sz="sm-1" />
                <div className="flex flex-col gap-1 min-w-0">
                  <Text
                    sz="sm-2"
                    weight="bold"
                    className={clsx("line-clamp-1 truncate max-w-full")}
                  >
                    {renderConversationName(conversation)}
                  </Text>
                  <div className="flex items-center opacity-80">
                    <Text sz="xs-3" className="truncate max-w-full">
                      {lastMessage
                        ? isSystemMessage(lastMessage?.type || MessageType.System)
                          ? renderSystemMessage(lastMessage)
                          : userId === lastMessage?.senderId
                            ? t("common:conversations.you") + ": " + lastMessage?.content
                            : lastMessage?.senderFullName + ": " + lastMessage?.content
                        : "Unknown"}
                    </Text>
                    <Text sz="xs-3" className="mx-2 shrink-0">
                      •
                    </Text>
                    <Text sz="xs-3" className="shrink-0">
                      {formatTime(conversation.lastMessage?.createdAt ?? "")}
                    </Text>
                  </div>
                </div>
              </div>
            );
          }}
          itemKey={(item) => item.id}
          isLoading={isLoading || isFetching}
          loadingSkeleton={
            <div className={clsx("flex items-center")}>
              <Skeleton sz="md-2" variant="circle" />
              <div className={clsx("flex flex-col w-full flex-1 gap-2 ml-2")}>
                <Skeleton className={clsx("w-full")} sz="sm-2" />
                <Skeleton className={clsx("w-[50%]")} sz="sm-2" />
              </div>
            </div>
          }
          numberOfSkeletons={2}
          emptyComponent={
            <div className="flex flex-col items-center justify-center gap-2 mt-4 min-h-[200px]">
              <i className="fa-solid fa-message text-3xl text-gray-400" />
              <Text sz="md-1" color="secondary">
                {t("common:conversations.no-conversations")}
              </Text>
            </div>
          }
        />
      </div>
    </div>
  );
};
