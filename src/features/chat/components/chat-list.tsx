import { Text, Textbox, Skeleton } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import { useConversations } from "@/features/hooks/use-conversation";
import clsx from "clsx";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useOpenChat } from "../hooks/use-open-chat";
import InfiniteScrollFlex from "@/components/ui/utils/infinite-scroll-flex";
import { ChatItem } from "./chat-item";

interface ChatListProps extends ComponentProps {
  onConversationClick?: (conversationId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ className, onConversationClick }) => {
  const { t } = useTranslation();
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching } = useConversations();
  const { openChat } = useOpenChat();
  const conversations = data?.pages.flatMap((page) => page.items) || [];

  const handleConversationClick = useCallback(
    async (conversationId: string) => {
      onConversationClick?.(conversationId);
      openChat(conversationId);
    },
    [onConversationClick, openChat],
  );

  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className={clsx("flex flex-col p-2", className)}>
      <Textbox
        placeholder={t("common:conversations.search")}
        sz="sm"
        className="border-0 w-full"
        type="search"
      />
      <div ref={scrollWrapperRef} className="flex-1 overflow-y-auto mt-2 ">
        <InfiniteScrollFlex
          className="scrollbar-hide sm:scrollbar-default"
          items={conversations}
          parentRef={scrollWrapperRef}
          onLoadMore={fetchNextPage}
          hasMore={hasNextPage}
          itemTemplate={(item: any) => (
            <ChatItem conversation={item} onClick={() => handleConversationClick(item.id)} />
          )}
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
