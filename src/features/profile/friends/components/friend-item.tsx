import { FriendDto } from "@/api/user/dto/friend.dto";
import { friendshipService } from "@/api/user/friendship.api";
import useClickOutside from "@/hooks/use-click-outside";
import React, { RefObject, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AddFriendButton from "../../components/friend-button";
import clsx from "clsx";
import { Avatar, Text } from "@/components/atoms";
import { SmartDropdown } from "@/components/ui/smart-dropdown";

interface FriendItemProps {
  className?: string;
  friendDto: FriendDto;
}

const FriendItem: React.FC<FriendItemProps> = ({ className = "", friendDto }) => {
  const [isShowDrowdown, setIsShowDropdown] = useState<boolean>(false);
  const [isFriend, setIsFriend] = useState<boolean>(friendDto.isFriend);
  const navigate = useNavigate();
  const { t } = useTranslation() as { t: (key: string) => string };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useClickOutside(
    dropdownRef as RefObject<HTMLDivElement>,
    btnRef as RefObject<HTMLButtonElement>,
    () => {
      if (isShowDrowdown) setIsShowDropdown(false);
    },
  );

  // Accept friend request
  const handleUnfriend = useCallback(
    async (id: string | undefined) => {
      const response = await friendshipService.Unfriend(id ? id : "");
      if (response.success) {
        setIsFriend(false);
      }
    },
    [friendshipService],
  );

  const requestOptions = useMemo(
    () => [
      {
        id: "unfriend",
        content: (
          <div>
            <i className="fa-solid fa-user-xmark mr-2" /> {t("user:profileHeader.unfriendButton")}
          </div>
        ),
        onClick: async () => await handleUnfriend?.(friendDto.id),
      },
    ],
    [friendDto.id, handleUnfriend, t],
  );

  return (
    <div
      className={clsx(
        "relative flex items-center justify-between rounded-xl",
        "hover:bg-bg-fourth cursor-pointer transition-colors",
        className,
      )}
    >
      <div
        className="relative flex py-3 px-1 gap-4 items-center"
        onClick={() => navigate(`/${friendDto.id}`)}
      >
        <div>
          <Avatar alt="Avatar" src={friendDto.avatar ?? undefined} sz="sm" />
        </div>
        <div className="flex flex-col h-full justify-center flex-1">
          <Text sz="md" weight="bold">
            {friendDto.name}
          </Text>
        </div>
      </div>
      <div className="relative pr-2">
        {isFriend ? (
          <>
            <button
              aria-label="More options"
              ref={btnRef}
              className="w-10 h-10 rounded-full hover:bg-bg-third"
              onClick={(e) => {
                e.stopPropagation();
                setIsShowDropdown(!isShowDrowdown);
              }}
            >
              <i className="fa-solid fa-ellipsis-v"></i>
            </button>
            <SmartDropdown
              isShow={isShowDrowdown}
              className={clsx(
                "absolute flex sm:top-[130%] top-[110%] left-[1%] p-2",
                "rounded-lg shadow-md z-10 min-w-[200px] w-[calc(100%-2%)]",
              )}
              ref={dropdownRef}
              items={requestOptions}
              onClose={() => setIsShowDropdown(false)}
            />
          </>
        ) : (
          <AddFriendButton sz="sm" uid={friendDto.id} />
        )}
      </div>
    </div>
  );
};

export default FriendItem;
