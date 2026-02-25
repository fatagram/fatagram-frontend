import Card from "@/components/molecules/card";
import FriendRequestItem from "@/features/friends/components/friend-request-item";
import React from "react";
import clsx from "clsx";
import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
  useListFriendRequests,
} from "@/features/hooks/use-friend";
import InfiniteScroll from "@/components/utils/infinite-scroll";

type FriendRequestsProps = {
  className?: string;
};

const FriendRequests: React.FC<FriendRequestsProps> = ({ className }) => {
  const [total, setTotal] = React.useState(0);

  const { data, fetchNextPage, hasNextPage, isFetching } = useListFriendRequests({
    limit: 20,
  });
  console.log(hasNextPage);
  const requestsData = React.useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);

  const { fetch: acceptFriendRequest } = useAcceptFriendRequest();
  const { fetch: rejectFriendRequest } = useDeclineFriendRequest();

  // render
  return (
    <Card title={`Danh sách lời mời (${total})`} className={className}>
      <InfiniteScroll
        itemInRow={4}
        items={requestsData}
        onLoadMore={fetchNextPage}
        className={clsx("gap-2 h-full w-full")}
        itemTemplate={(item: any, index: number) => (
          <FriendRequestItem
            key={index}
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
      />
    </Card>
  );
};

export default React.memo(FriendRequests);
