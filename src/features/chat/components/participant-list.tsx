import { UserOptionTrigger } from "./user-option-trigger";
import React from "react";
import { useGetParticipants } from "../hooks/use-conversation";
import { Avatar, Text, Skeleton } from "@/components/atoms";
import InfiniteScrollFlex from "@/components/ui/utils/infinite-scroll-flex";

export const ParticipantList: React.FC<{ conversationId: string; onClose?: () => void }> = ({
  conversationId,
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetParticipants(
    conversationId,
    { limit: 20 },
  );

  const participants = data?.pages.flatMap((page) => page.items) || [];

  const itemTemplate = (p: any) => (
    <UserOptionTrigger
      key={p.userId}
      user={{
        userId: p.userId,
        fullName: p.fullname,
        avatarUrl: p.avatarUrl,
      }}
    >
      <div className="flex items-center gap-3 p-3 hover:bg-bg-second rounded-xl cursor-pointer transition-colors group w-full text-left">
        <Avatar src={p.avatarUrl} alt={p.fullname} sz="md" className="group-hover:scale-110 transition-transform" />
        <div className="flex flex-col">
          <Text weight="bold" sz="sm">
            {p.fullname}
          </Text>
          {p.nickname && (
            <Text sz="xs" className="opacity-60">
              {p.nickname}
            </Text>
          )}
        </div>
      </div>
    </UserOptionTrigger>
  );

  const loadingSkeleton = (
    <div className="flex items-center gap-3 p-3">
      <Skeleton sz="md" variant="circle" className="w-10 h-10" />
      <Skeleton sz="md" className="w-32 h-4" />
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden min-h-0 relative">
      <InfiniteScrollFlex
        items={participants}
        itemKey={(p) => p.userId}
        itemTemplate={itemTemplate}
        loadingSkeleton={loadingSkeleton}
        isLoading={isLoading || isFetchingNextPage}
        hasMore={hasNextPage}
        onLoadMore={fetchNextPage}
        className="px-2 pb-10"
        gap={0}
      />
    </div>
  );
};

