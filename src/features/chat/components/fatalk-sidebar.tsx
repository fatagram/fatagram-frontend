import { ComponentProps } from "@/components/common/component-type";
import { useConversations } from "@/features/hooks/use-conversation";
import { Avatar, Text } from "@/components/atoms";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "@/components/ui/utils/infinite-scroll";
import { ConversationDto } from "@/api/conversation/dto/conversation.dto";
import { useAuth } from "@/contexts";
import { useFormatTime } from "@/utils/format-time";
import { useNavigate, useParams } from "react-router-dom";
import PageNavbar from "@/components/ui/navigation/page-navbar/page-navbar";

interface FatalkSidebarProps extends ComponentProps {}

export const FatalkSidebar: React.FC<FatalkSidebarProps> = ({ className }) => {
  const { data, fetchNextPage } = useConversations();
  const { userId } = useAuth();
  const { t } = useTranslation();
  const { formatTime } = useFormatTime();
  const navigate = useNavigate();
  const { conversationId: activeId } = useParams<{ conversationId: string }>();

  const conversations = data?.pages.flatMap((page) => page.items) || [];

  const handleConversationClick = (conversationId: string) => {
    navigate(`/fatalk/${conversationId}`);
  };

  return (
    <PageNavbar
      title="Fatalk"
      className={clsx("h-full bg-bg-second !rounded-none border-r-2 border-r-bg-third ", className)}
    >
      <div className="flex-1 overflow-y-auto px-2 pb-4 pt-2">
        {conversations.length > 0 ? (
          <InfiniteScroll
            itemInRow={1}
            items={conversations}
            onLoadMore={fetchNextPage}
            className="scrollbar-hide"
            itemTemplate={(item: any) => {
              const conversation = item as ConversationDto;
              const isActive = conversation.id === activeId;
              return (
                <div
                  key={conversation.id}
                  className={clsx(
                    "flex gap-3 px-3 py-3 rounded-xl transition-all duration-300 cursor-pointer select-none",
                    isActive
                      ? "bg-bg-fourth border-l-4 border-l-primary-500 shadow-sm"
                      : "hover:bg-bg-third",
                  )}
                  onClick={() => handleConversationClick(conversation.id)}
                >
                  <Avatar src={conversation.avatarUrl ?? ""} alt="Avatar" sz="sm-2" />
                  <div className="flex flex-col gap-0.5 min-w-0 justify-center flex-1">
                    <div className="flex justify-between items-center gap-2">
                      <Text
                        sz="sm-1"
                        weight={isActive ? "semibold" : "bold"}
                        className={clsx(
                          "line-clamp-1 truncate flex-1",
                          isActive ? "text-primary-600" : "text-text-main",
                        )}
                      >
                        {conversation.name}
                      </Text>
                      <Text sz="xs-3" className="shrink-0 opacity-60">
                        {formatTime(conversation.lastMessage?.createdAt ?? "")}
                      </Text>
                    </div>
                    <div className="flex items-center opacity-70">
                      <Text sz="xs-3" className="truncate flex-1 max-w-full italic">
                        {userId === conversation.lastMessage?.senderId
                          ? t("common:conversations.you") + ": " + conversation.lastMessage?.content
                          : (conversation.isGroup ? "" : conversation.name) +
                            ": " +
                            conversation.lastMessage?.content}
                      </Text>
                    </div>
                  </div>
                </div>
              );
            }}
            itemKey={(item) => item.id}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 mt-8 py-10 opacity-50">
            <i className="fa-solid fa-message text-4xl" />
            <Text sz="md-1">{t("common:conversations.no-conversations")}</Text>
          </div>
        )}
      </div>
    </PageNavbar>
  );
};
