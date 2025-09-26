import { FriendDto } from "@/api/user/dto/friend.dto";
import useFriends from "@/features/profile/hooks/use-friend";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import SearchBox from "@/components/atoms/textbox/searchbox";
import Text from "@/components/atoms/text";
import FriendItem from "./friend-item";
import { useProfilePage } from "../../context/profile-page-context";

interface ProfileFriendsProps {
  className?: string;
}

const ProfileFriends: React.FC<ProfileFriendsProps> = ({ className = "" }) => {
  const { t } = useTranslation() as { t: (key: string) => string };

  const [friends, setFriends] = React.useState<FriendDto[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(12);
  const [isFull, setIsFull] = React.useState<boolean>(false);
  const [keyword, setKeyword] = React.useState<string>("");
  const { targetId } = useProfilePage();

  const { isLoading, refetch } = useFriends({
    userId: targetId,
    keyword: keyword,
    page: page,
    pageSize: pageSize,
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("Search keyword:", e.target.value);
    setKeyword(e.target.value);
    setPage(1);
    setIsFull(false);
  };

  useEffect(() => {
    const fetchFriends = async () => {
      const result = await refetch();
      if (page === 1) {
        setFriends(result.data?.friends || []);
      } else {
        setFriends((prev) => [...prev, ...(result.data?.friends || [])]);
      }
      if ((result.data?.friends || []).length < pageSize) {
        setIsFull(true);
      }
    };
    fetchFriends();
  }, [page, keyword, targetId]);

  return (
    <div className={`flex flex-1 justify-end ${className} flex-col w-full`}>
      <SearchBox
        placeholder={t("user:profileFriends.searchFriends")}
        className="p-1"
        onChange={handleOnChange}
      />
      {!isLoading ? (
        <div className="relative flex flex-wrap gap-2 w-full mt-2">
          {friends.map((friend, index) => (
            <FriendItem className="w-[calc(50%-4px)]" friendDto={friend} key={index} />
          ))}
          {friends.length === 0 && (
            <div className="flex w-full justify-center mb-10 mt-10">
              <div className="flex flex-col items-center text-[var(--text-color)] opacity-30">
                <Text size="xl-3" weight="bold">
                  <i className="fa-solid fa-user-xmark"></i>
                </Text>
                <Text size="md-2" className="mt-2">
                  {t("user:profileFriends.noFriends")}ks
                </Text>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative flex flex-wrap gap-2 w-full mt-4 items-center justify-center">
          <div className="fa-solid fa-spinner animate-spin text-2xl text-single-main"></div>
        </div>
      )}
    </div>
  );
};

export default ProfileFriends;
