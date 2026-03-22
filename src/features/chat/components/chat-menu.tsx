import { ComponentProps } from "@/components/common/component-type";
import { useConversations } from "@/features/hooks/use-conversation";
import { Avatar, Text, Textbox } from "@/components/atoms";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "@/components/ui/utils/infinite-scroll";
import { ConversationDto } from "@/api/conversation/dto/conversation.dto";
import { useAuth } from "@/contexts";
import { useFormatTime } from "@/utils/format-time";
import { useChatStore } from "@/features/hooks/use-chat-store";

interface ChatMenuProps extends ComponentProps {
  onConversationClick?: () => void;
  ref?: React.RefObject<HTMLDivElement | null>;
}

export const ChatMenu: React.FC<ChatMenuProps> = ({ onConversationClick, className, ref }) => {
  const { data, fetchNextPage, isLoading, isFetching } = useConversations();
  const { userId } = useAuth();
  const { t } = useTranslation();
  const { openChat } = useChatStore();

  const conversations = data?.pages.flatMap((page) => page.items) || [];
  const unreadCount = 1;

  const handleMarkAllAsRead = async () => {};

  const handleConversationClick = (conversationId: string) => {
    openChat(conversationId, { type: "conversation", conversationId: conversationId });
    onConversationClick?.();
  };

  return (
    <div
      className={clsx(
        "bg-bg-second shadow-xl rounded-xl flex flex-col gap-2 select-none",
        "animate-dropdown-slide origin-top scrollbar-hide !w-[380px]",
        className,
      )}
      ref={ref}
    >
      <div className="flex items-center justify-between px-2 pt-2">
        <Text sz="lg-1" weight="bold">
          {t("common:conversations.title")}
        </Text>
        {conversations.length > 0 && (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                className="p-2 rounded-lg hover:bg-bg-fourth transition-colors cursor-pointer"
                onClick={handleMarkAllAsRead}
                title={t("common:conversations.mark-all-read")}
              >
                <Text sz="md-1" color="secondary">
                  <i className="fa-solid fa-check-double"></i>
                </Text>
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col p-2">
        <Textbox
          placeholder={t("common:conversations.search")}
          sz="xs-3"
          className="border-0 w-full"
        />
        {conversations.length > 0 ? (
          <InfiniteScroll
            itemInRow={1}
            items={conversations}
            onLoadMore={fetchNextPage}
            className="mt-2 min-w-[300px]"
            itemTemplate={(item: any) => {
              const conversation = item as ConversationDto;
              const formatTime = useFormatTime();
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
                  <div className="flex flex-col gap-1">
                    <Text sz="sm-2" weight="bold" className="line-clamp-1">
                      {conversation.name}
                    </Text>
                    <div className="flex items-center opacity-80 min-w-0">
                      <Text sz="xs-3" className="truncate flex-1 min-w-0">
                        {userId === conversation.lastMessage?.senderId
                          ? t("common:conversations.you") + ": " + conversation.lastMessage?.content
                          : (conversation.isGroup ? "" : conversation.name) +
                            ": " +
                            conversation.lastMessage?.content}
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
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 mt-4 min-h-[200px]">
            <i className="fa-solid fa-message text-3xl text-gray-400" />
            <Text sz="md-1" color="secondary">
              {t("common:conversations.no-conversations")}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};
