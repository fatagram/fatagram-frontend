import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { List } from "@/components/ui/list";
import { Textbox } from "@/components/atoms";
import SearchUserItem, { SearchUserSkeleton } from "./components/search-user-item";
import InfiniteScrollGrid from "@/components/ui/utils/infinite-scroll-grid";
import { NotFound } from "@/features/components/not-found";
import { useSearchUsers } from "@/features/hooks/use-user";
import { SearchUserDto } from "@/api/user/dto/search-user.dto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const renderSearchUserItem = (item: SearchUserDto) => (
  <SearchUserItem
    id={item.id}
    name={item.fullName}
    avatar={item.avatar}
    status={item.status}
    path={`/${item.id}`}
  />
);

const getSearchUserKey = (item: SearchUserDto) => item.id;

const AddFriendsPage: React.FC = () => {
  const { t } = useTranslation();
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
    <List
      title={t("friends:navbar.addFriends") || "Tìm kiếm bạn bè"}
      description={t(
        "friends:search.description",
        "Tìm kiếm và kết bạn với mọi người trên Fatagram.",
      )}
      className="flex flex-col h-[calc(100dvh-var(--header-height)-0.5rem)]"
      cardClassName="min-h-0 !h-full"
    >
      <div className="flex flex-col gap-6 px-0 sm:px-6 pb-6 flex-1 min-h-0">
        <div className="shrink-0 relative">
          <Textbox
            type="search"
            placeholder={t("friends:navbar.addFriends") || "Tìm kiếm bạn bè..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sz="sm"
            className="bg-bg-second"
          />
        </div>

        <div className="h-full scrollbar-hide min-h-0 [--item-min-width:100%] sm:[--item-min-width:200px]">
          <InfiniteScrollGrid
            itemMinWidth="var(--item-min-width)"
            items={showSkeletons ? [] : users}
            onLoadMore={fetchNextPage}
            className="w-full gap-2 sm:gap-4 flex-1 h-full overflow-y-auto"
            itemTemplate={renderSearchUserItem}
            hasMore={!!hasNextPage}
            isLoading={showSkeletons || isFetchingNextPage}
            loadingSkeleton={<SearchUserSkeleton />}
            itemKey={getSearchUserKey}
            emptyComponent={
              debouncedQuery ? (
                <NotFound
                  icon={<FontAwesomeIcon icon={faMagnifyingGlass} className="text-3xl" />}
                  title={t("friends:search.noResults")}
                  description={t("friends:search.noResultsDescription")}
                />
              ) : null
            }
            numberOfSkeletons={8}
          />
        </div>
      </div>
    </List>
  );
};

export default AddFriendsPage;
