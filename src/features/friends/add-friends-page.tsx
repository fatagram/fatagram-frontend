import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SidebarPageCard } from "@/features/components/sidebar-page-layout";
import { Textbox } from "@/components/atoms";
import SearchUserItem, { SearchUserSkeleton } from "./components/search-user-item";
import InfiniteScrollGrid from "@/components/ui/utils/infinite-scroll-grid";
import { NotFound } from "@/features/components/not-found";
import { useMobile } from "@/hooks/use-mobile";
import { useSearchUsers } from "@/features/hooks/use-user";

const AddFriendsPage: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching } =
    useSearchUsers({ keyword: debouncedQuery, limit: 12 });

  const users = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  const showSkeletons = isLoading || (isFetching && !isFetchingNextPage);

  return (
    <SidebarPageCard
      title={t("friends:navbar.addFriends") || "Tìm kiếm bạn bè"}
      className="h-[calc(100dvh-var(--header-height)-1rem)] flex flex-col"
      childrenClassName="flex-1 h-full min-h-0"
    >
      <div className="flex flex-col gap-6 h-full min-h-0">
        <div className="px-1 shrink-0 relative">
          <Textbox
            type="search"
            placeholder={t("friends:navbar.addFriends") || "Tìm kiếm bạn bè..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sz="sm"
            className="bg-bg-second"
          />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-1 min-h-0 [--item-min-width:100%] sm:[--item-min-width:200px]">
          <InfiniteScrollGrid
            itemMinWidth="var(--item-min-width)"
            items={showSkeletons ? [] : users}
            onLoadMore={fetchNextPage}
            className="w-full gap-2 sm:gap-4"
            itemTemplate={(item: any) => (
              <SearchUserItem
                id={item.id}
                name={item.fullName}
                avatar={item.avatar}
                status={item.status}
                path={`/${item.id}`}
              />
            )}
            hasMore={!!hasNextPage}
            isLoading={showSkeletons || isFetchingNextPage}
            loadingSkeleton={<SearchUserSkeleton />}
            itemKey={(item: any) => item.id}
            emptyComponent={
              <NotFound
                icon="fa-solid fa-magnifying-glass text-3xl"
                title={t("friends:search.noResults")}
                description={t("friends:search.noResultsDescription")}
              />
            }
            numberOfSkeletons={isMobile ? 6 : 12}
          />
        </div>
      </div>
    </SidebarPageCard>
  );
};

export default AddFriendsPage;
