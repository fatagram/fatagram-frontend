import FriendRequestItem from "@/features/friends/components/friend-request-item";
import InfiniteScrollGrid from "@/components/ui/utils/infinite-scroll-grid";
import { SidebarPageCard } from "@/features/components/sidebar-page-layout";
import { NotFound } from "@/features/components/not-found";
import { useTranslation } from "react-i18next";
import React from "react";
import clsx from "clsx";
import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
  useListFriendRequests,
} from "@/features/hooks/use-friend";

type FriendRequestsProps = {
  className?: string;
};

const FriendRequests: React.FC<FriendRequestsProps> = () => {
  const { t } = useTranslation();
  const [_total, _setTotal] = React.useState(0);

  const { data, fetchNextPage, hasNextPage, isFetching } = useListFriendRequests({
    limit: 20,
  });
  const requestsData = React.useMemo(() => data?.pages.flatMap((page) => page.items) || [], [data]);

  const { fetch: acceptFriendRequest } = useAcceptFriendRequest();
  const { fetch: rejectFriendRequest } = useDeclineFriendRequest();

  // render
  return (
    <SidebarPageCard title={t("friends:requests.title") || "Lời mời kết bạn"}>
      <InfiniteScrollGrid
        itemMinWidth="200px"
        items={requestsData}
        onLoadMore={fetchNextPage}
        className={clsx("gap-2 h-full w-full")}
        itemTemplate={(item: any) => (
          <FriendRequestItem
            name={item.senderName}
            avatar={item.senderAvatar}
            path={`/${item.senderUrlName || item.senderId}`}
            time={new Date(item.createdAt)}
            onAccept={() => acceptFriendRequest(item.senderId)}
            onCancel={() => rejectFriendRequest(item.senderId)}
          />
        )}
        hasMore={!!hasNextPage}
        isLoading={isFetching}
        itemKey={(item: any) => item.senderId}
        emptyComponent={
          <NotFound
            icon="fa-solid fa-user-plus text-3xl"
            title={t("friends:requests.noRequests") || "Không có lời mời nào"}
            description={
              t("friends:requests.noRequestsDescription") ||
              "Khi có người muốn kết bạn với bạn, họ sẽ xuất hiện ở đây."
            }
          />
        }
      />
    </SidebarPageCard>
  );
};

export default React.memo(FriendRequests);
