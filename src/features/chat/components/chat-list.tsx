import { Textbox, Skeleton } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOpenChat } from "../hooks/use-open-chat";
import InfiniteScrollFlex from "@/components/ui/utils/infinite-scroll-flex";
import { ChatItem } from "./chat-item";
import { NotFound } from "@/features/components/not-found";
import { useGetConversations } from "../hooks/use-conversation";
import { useConversationStore } from "../services/conversation-manager";
import { useDebounce } from "@/hooks/use-debounce";
import { ChatSearchList } from "./chat-search-list";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

interface ChatListProps extends ComponentProps {
  onConversationClick?: (conversationId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ className, onConversationClick }) => {
  const { t } = useTranslation();
  const { openChat } = useOpenChat();

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);

  const { fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useGetConversations({
    limit: 10,
  });
  const conversations = useConversationStore((state) => state.conversations);

  const handleSearch = useCallback((keyword: string) => {
    setKeyword(keyword);
  }, []);

  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className={clsx("flex flex-col gap-2 p-2 h-full", className)}>
      <Textbox
        className="w-full"
        placeholder={t("common:conversations.searchPlaceholder")}
        onChange={(e) => handleSearch(e.target.value)}
        value={keyword}
        type="search"
      />
      {debouncedKeyword ? (
        <ChatSearchList
          onConversationClick={onConversationClick}
          keyword={debouncedKeyword}
          className="flex-1 min-h-0"
        />
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto" ref={scrollWrapperRef}>
          <InfiniteScrollFlex
            className="scrollbar-hide sm:scrollbar-default"
            items={conversations}
            parentRef={scrollWrapperRef}
            onLoadMore={fetchNextPage ?? (() => {})}
            hasMore={hasNextPage}
            itemTemplate={(item: any) => (
              <ChatItem
                key={item.id}
                conversation={item}
                onClick={() => {
                  openChat(item.id);
                  onConversationClick?.(item.id);
                }}
              />
            )}
            itemKey={(item) => item.id}
            isLoading={isLoading || isFetchingNextPage}
            loadingSkeleton={
              <div className="flex items-center gap-2 px-2 py-2">
                <Skeleton variant="circle" sz="md" />
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className={clsx("w-full")} sz="sm" />
                  <Skeleton className={clsx("!w-[50%]")} sz="sm" />
                </div>
              </div>
            }
            numberOfSkeletons={2}
            emptyComponent={
              <NotFound
                icon={<FontAwesomeIcon icon={faComments} className="text-2xl" />}
                title={t("common:conversations.noConversations")}
                description={t("common:conversations.noConversationsMessage")}
                className="py-5"
              />
            }
          />
        </div>
      )}
    </div>
  );
};
