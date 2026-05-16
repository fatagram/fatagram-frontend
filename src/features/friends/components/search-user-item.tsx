import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Text } from "@/components/atoms";
import clsx from "clsx";
import { useMobile } from "@/hooks/use-mobile";
import FriendButton from "@/features/profile/components/friend-button";

type SearchUserItemProps = {
  id: string;
  avatar?: string | null;
  name?: string;
  status?: string;
  path?: string;
};

const SearchUserItem: React.FC<SearchUserItemProps> = ({ id, avatar, name, status, path = "" }) => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  const handleNavigate = () => {
    navigate(path);
  };

  if (isMobile) {
    return (
      <div className="flex items-center gap-3 p-3 bg-bg-second sm:bg-bg-main rounded-2xl shadow-sm w-full border border-border-main/10">
        <div className="cursor-pointer shrink-0" onClick={handleNavigate}>
          <Avatar
            src={avatar || undefined}
            alt="avatar"
            shape="rounded"
            className="w-16 h-16 object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Text
            sz="md"
            weight="bold"
            onClick={handleNavigate}
            className="truncate cursor-pointer hover:text-primary-500 transition-colors"
          >
            {name}
          </Text>
        </div>
        <div className="shrink-0 min-w-[120px] flex justify-end">
          <FriendButton uid={id} initialStatus={status} className="w-full" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex flex-col items-start bg-bg-main",
        "h-auto",
        "rounded-2xl shadow-lg p-4 gap-1",
      )}
    >
      <div className="w-full cursor-pointer aspect-square mb-2" onClick={handleNavigate}>
        <Avatar
          src={avatar || undefined}
          alt="avatar"
          shape="rounded"
          className="w-full h-full object-cover"
        />
      </div>
      <Text
        sz="md"
        weight="bold"
        onClick={handleNavigate}
        className={clsx(
          "truncate overflow-hidden w-full cursor-pointer hover:text-primary-500 transition-colors",
        )}
      >
        {name}
      </Text>

      <div className="w-full mt-2 mb-1">
        <FriendButton uid={id} initialStatus={status} />
      </div>
    </div>
  );
};

export const SearchUserSkeleton: React.FC = () => {
  const isMobile = useMobile();

  if (isMobile) {
    return (
      <div className="flex items-center gap-3 p-3 bg-bg-second sm:bg-bg-main rounded-2xl shadow-sm w-full border border-border-main/10 animate-pulse">
        <div className="w-16 h-16 bg-bg-fourth rounded-2xl shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-bg-fourth rounded w-3/4 mb-2" />
          <div className="h-3 bg-bg-fourth rounded w-1/2" />
        </div>
        <div className="w-[100px] h-8 bg-bg-fourth rounded-lg shrink-0" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start bg-bg-main rounded-2xl shadow-lg p-4 gap-2 w-full animate-pulse">
      <div className="w-full aspect-square bg-bg-fourth rounded-2xl mb-2" />
      <div className="h-5 bg-bg-fourth rounded w-3/4 mb-1" />
      <div className="w-full h-8 bg-bg-fourth rounded-lg mt-2" />
    </div>
  );
};

export default SearchUserItem;
