import { FriendDto } from "@/api/user/dto/friend.dto";
import { useGetFriends } from "@/features/hooks/use-friend";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import FriendItem from "./friend-item";
import clsx from "clsx";
import { useProfilePage } from "../../hooks/use-profile-page";
import { Text, Textbox } from "@/components/atoms";
import InfiniteScrollGrid from "@/components/ui/utils/infinite-scroll-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserXmark } from "@fortawesome/free-solid-svg-icons";

interface ProfileFriendsProps {
  className?: string;
}

const ProfileFriends: React.FC<ProfileFriendsProps> = ({ className = "" }) => {
  const { t } = useTranslation() as { t: (key: string) => string };
  const [keyword, setKeyword] = React.useState<string>("");
  const { targetId } = useProfilePage();

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetFriends(
    targetId,
    { keyword, limit: 12 },
  );

  const friends = useMemo<FriendDto[]>(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div className={clsx("flex flex-1 justify-end flex-col w-full", className)}>
      <Textbox
        sz="sm"
        type="search"
        placeholder={t("user:profileFriends.searchFriends")}
        className="p-1 w-full sm:max-w-xs"
        onChange={handleOnChange}
      />
      <InfiniteScrollGrid
        itemMinWidth="300px"
        items={friends}
        isLoading={isLoading || isFetchingNextPage}
        hasMore={hasNextPage}
        onLoadMore={fetchNextPage}
        className="relative flex flex-wrap gap-2 w-full mt-2"
        loadingSkeleton={
          <div className="fa-solid fa-spinner animate-spin text-2xl text-single-main" />
        }
        numberOfSkeletons={1}
        itemTemplate={(item: any) => (
          <FriendItem className="w-full" friendDto={item as FriendDto} />
        )}
        itemKey={(item: any) => item.id}
        emptyComponent={
          <div className="flex w-full justify-center mb-10 mt-10">
            <div className="flex flex-col items-center text-[var(--text-color)] opacity-30">
              <Text sz="xl" weight="bold">
                <FontAwesomeIcon icon={faUserXmark} />
              </Text>
              <Text sz="md" className="mt-2">
                {t("user:profileFriends.noFriends")}
              </Text>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ProfileFriends;
