import { Text, Skeleton, Avatar } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useOpenChat } from "../hooks/use-open-chat";
import InfiniteScrollFlex from "@/components/ui/utils/infinite-scroll-flex";
import { NotFound } from "@/features/components/not-found";
import { useSearchConversations } from "../hooks/use-conversation";
import { ConversationDto } from "@/api/conversation/dto/conversation.dto";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";

interface ChatSearchListProps extends ComponentProps {
  keyword: string;
  onConversationClick?: (conversationId: string) => void;
}

const ChatSearchItem: React.FC<{ conversation: ConversationDto; onClick: () => void }> = ({
  conversation,
  onClick,
}) => {
  const { renderConversationName } = useRenderConversationContent();
  const title = renderConversationName(conversation as any);

  return (
    <div
      className="flex items-center gap-3 p-2 rounded-xl hover:bg-bg-fourth cursor-pointer transition-colors active:scale-[98%]"
      onClick={onClick}
    >
      <Avatar src={conversation.avatarUrl || ""} sz="md" alt={""} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Text sz="md" weight="bold" className="truncate text-text-main">
          {title}
        </Text>
        {conversation.isGroup && conversation.topParticipantNames && (
          <Text sz="xs" className="truncate text-text-second">
            {conversation.topParticipantNames.join(", ")}
            {conversation.participantCount &&
            conversation.participantCount > conversation.topParticipantNames.length
              ? ` và ${conversation.participantCount - conversation.topParticipantNames.length} người khác`
              : ""}
          </Text>
        )}
      </div>
    </div>
  );
};

export const ChatSearchList: React.FC<ChatSearchListProps> = ({
  className,
  keyword,
  onConversationClick,
}) => {
  const { t } = useTranslation();
  const { openChat } = useOpenChat();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetching } = useSearchConversations({
    keyword,
    limit: 10,
  });

  const handleConversationClick = useCallback(
    async (conversationId: string) => {
      onConversationClick?.(conversationId);
      openChat(conversationId);
    },
    [onConversationClick, openChat],
  );

  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const items = data ? data.pages.flatMap((p) => p.items) : [];

  return (
    <div ref={scrollWrapperRef} className={clsx("flex-1 overflow-y-auto mt-2", className)}>
      <InfiniteScrollFlex
        className="scrollbar-hide sm:scrollbar-default"
        items={items}
        parentRef={scrollWrapperRef}
        onLoadMore={fetchNextPage ?? (() => {})}
        hasMore={hasNextPage}
        itemTemplate={(item: any) => (
          <ChatSearchItem conversation={item} onClick={() => handleConversationClick(item.id)} />
        )}
        itemKey={(item) => item.id}
        isLoading={isLoading || isFetching}
        loadingSkeleton={
          <div className={clsx("flex items-center my-4")}>
            <Skeleton sz="md" variant="circle" />
            <div className={clsx("flex flex-col w-full flex-1 gap-2 ml-2")}>
              <Skeleton className={clsx("w-full")} sz="sm" />
              <Skeleton className={clsx("!w-[50%]")} sz="sm" />
            </div>
          </div>
        }
        numberOfSkeletons={3}
        emptyComponent={
          !isLoading && !isFetching ? (
            <NotFound
              icon="fa-solid fa-magnifying-glass"
              title={t("common:conversations.noSearchResults", "Không tìm thấy kết quả")}
              description={t(
                "common:conversations.noSearchResultsMessage",
                "Thử tìm kiếm với từ khóa khác",
              )}
              className="py-5"
            />
          ) : null
        }
      />
    </div>
  );
};
