import { Textbox, Skeleton } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useOpenChat } from "../hooks/use-open-chat";
import InfiniteScrollFlex from "@/components/ui/utils/infinite-scroll-flex";
import { ChatItem } from "./chat-item";
import { NotFound } from "@/features/components/not-found";
import { useGetConversations } from "../hooks/use-conversation";
import { useConversationStore } from "../services/conversation-manager";

interface ChatListProps extends ComponentProps {
  onConversationClick?: (conversationId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ className, onConversationClick }) => {
  const { t } = useTranslation();
  const { openChat } = useOpenChat();

  const { fetchNextPage, hasNextPage, isLoading, isFetching } = useGetConversations();
  const conversations = useConversationStore((state) => state.conversations);

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
          onLoadMore={fetchNextPage ?? (() => {})}
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
            <NotFound
              icon="fa-regular fa-message"
              title={t("common:conversations.noConversations")}
              description={t("common:conversations.noConversationsMessage")}
              className="py-5"
            />
          }
        />
      </div>
    </div>
  );
};
