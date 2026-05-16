import FriendRequestItem from "@/features/friends/components/friend-request-item";
import InfiniteScrollGrid from "@/components/ui/utils/infinite-scroll-grid";
import { SidebarPageCard } from "@/features/components/sidebar-page-layout";
import { NotFound } from "@/features/components/not-found";
import { useTranslation } from "react-i18next";
import React, { useMemo, useState } from "react";
import clsx from "clsx";
import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
  useListFriendRequests,
} from "@/features/hooks/use-friend";
import { Skeleton } from "@/components/atoms";

type FriendRequestsProps = {
  className?: string;
};

const FriendRequests: React.FC<FriendRequestsProps> = () => {
  const { t } = useTranslation();
  const [_total, _setTotal] = useState(0);

  const { data, fetchNextPage, hasNextPage, isFetching, isPending } = useListFriendRequests({
    limit: 20,
  });
  const requestsData = useMemo(() => data?.pages.flatMap((page) => page.items) || [], [data]);

  const { fetch: acceptFriendRequest } = useAcceptFriendRequest();
  const { fetch: rejectFriendRequest } = useDeclineFriendRequest();

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
        isLoading={isFetching || isPending}
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
        numberOfSkeletons={2}
        loadingSkeleton={
          <div className="flex flex-col gap-2 rounded-xl p-2 bg-bg-second items-center">
            <Skeleton sz="lg" className="w-full" />
            <Skeleton sz="md" className="self-start w-[80%]" />
            <Skeleton sz="md" className="self-start w-[85%]" />
          </div>
        }
      />
    </SidebarPageCard>
  );
};

export default React.memo(FriendRequests);
