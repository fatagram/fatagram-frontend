import { friendshipService } from "@/api/user/friendship.api";
import Card from "@/components/molecules/card";
import FriendRequestItem from "@/features/friends/components/friend-request-item";
import { TimeUnit, TimeUnitTranslateMap } from "@/types/time-unit";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Text } from "@/components/atoms";
import { useListFriendRequests } from "@/features/hooks/use-friend";

type FriendRequestsProps = {
  className?: string;
};

const FriendRequests: React.FC<FriendRequestsProps> = ({ className }) => {
  // State to hold friend requests
  const [requests, setRequests] = React.useState<
    {
      senderId: string;
      senderUrlName: string;
      senderName: string;
      senderAvatar: string;
      createdAt: {
        value: number;
        unit: TimeUnit;
      };
    }[]
  >([]);

  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(8);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFull, setIsFull] = React.useState(false);
  const loaderRef = React.useRef<HTMLDivElement>(null);
  const [total, setTotal] = React.useState(0);

  const { t } = useTranslation() as {
    t: (key: string, options?: any) => string;
  };

  // Fetch friend requests from the API
  // const fetchFriendRequests = React.useCallback(async () => {
  //   setIsLoading(true);
  //   const response = await friendshipService.GetFriendRequests(page, limit);
  //   if (response.success) {
  //     setRequests((prev) => [...prev, ...(response.data?.friendRequests ?? [])]);
  //     setTotal(response.data?.total ?? 0);
  //     if (response.data?.friendRequests.length && response.data?.friendRequests.length < limit) {
  //       setIsFull(true);
  //     }
  //   }
  //   setIsLoading(false);
  // }, [page, limit]);

  const { data, fetchNextPage, hasNextPage, isFetching } = useListFriendRequests();
  console.log("Friend Requests Data:", data);
  const requestsData = React.useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);

  // Handle accept friend request
  const handleAcceptRequest = useCallback(async (requestId: string) => {
    const response = await friendshipService.AcceptAddFriendRequest(requestId);
    if (response.success) {
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.senderId !== requestId),
      );
      setTotal((prevTotal) => prevTotal - 1);
    }
  }, []);

  // Handle reject friend request
  const handleRejectRequest = useCallback(async (senderId: string) => {
    const response = await friendshipService.DeclineAddFriendRequest(senderId);
    if (response.success) {
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.senderId !== senderId),
      );
      setTotal((prevTotal) => prevTotal - 1);
    }
  }, []);

  useEffect(() => {
    if (!loaderRef.current || isFull) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, isFull]);

  // render
  return (
    <Card title={`Danh sách lời mời (${total})`} className={className}>
      <div className="flex flex-wrap gap-2 h-full w-full">
        {requestsData?.length > 0 ? (
          <>
            {requestsData.map((request, index) => (
              <FriendRequestItem
                key={index}
                name={request.senderName}
                avatar={request.senderAvatar}
                path={`/${request.senderUrlName || request.senderId}`}
                time={new Date(request.createdAt)}
                onAccept={() => handleAcceptRequest(request.senderId)}
                onCancel={() => handleRejectRequest(request.senderId)}
              />
            ))}
          </>
        ) : (
          <Text sz="md-2">{t("friends:friendRequest.noRequests")}</Text>
        )}
      </div>

      <div ref={loaderRef} className="w-full h-0" />
      {isLoading && (
        <div className={clsx("flex justify-center items-center w-full h-10 gap-1 mt-5")}>
          <span
            className={clsx(
              "w-2 h-2 rounded-full bg-[var(--text-color)] animate-bounce [animation-delay:0s]",
            )}
          ></span>
          <span
            className={clsx(
              "w-2 h-2 rounded-full bg-[var(--text-color)] animate-bounce [animation-delay:0.2s]",
            )}
          ></span>
          <span
            className={clsx(
              "w-2 h-2 rounded-full bg-[var(--text-color)] animate-bounce [animation-delay:0.4s]",
            )}
          ></span>
        </div>
      )}
    </Card>
  );
};

export default React.memo(FriendRequests);
