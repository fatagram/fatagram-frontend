import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Text } from "@/components/atoms";
import clsx from "clsx";
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

  const handleNavigate = () => {
    navigate(path);
  };

  return (
    <>
      {/* Mobile view (< sm): Instant CSS, eliminates reload flash */}
      <div className="flex sm:hidden items-center gap-3 p-3 bg-bg-second rounded-2xl w-full border border-bg-fourth">
        <button type="button" className="cursor-pointer shrink-0" onClick={handleNavigate}>
          <Avatar
            src={avatar || undefined}
            alt="avatar"
            shape="rounded"
            className="w-14 h-14 object-cover"
          />
        </button>
        <div className="flex-1 min-w-0">
          <Text
            sz="md"
            weight="bold"
            wrap="whitespace-normal"
            onClick={handleNavigate}
            className="truncate cursor-pointer hover:text-primary-500 transition-colors"
          >
            {name}
          </Text>
        </div>
        <div className="shrink-0 min-w-[110px] flex justify-end">
          <FriendButton uid={id} initialStatus={status} className="w-full" />
        </div>
      </div>

      {/* Desktop view (>= sm): Instant CSS, eliminates reload flash */}
      <div
        className={clsx(
          "hidden sm:flex flex-col items-start bg-bg-main w-full",
          "h-auto",
          "rounded-2xl border-2 border-bg-fourth p-4 gap-1",
          "hover:border-primary-500/40 transition-colors duration-300",
        )}
      >
        <button
          type="button"
          className="w-full cursor-pointer aspect-square mb-2"
          onClick={handleNavigate}
        >
          <Avatar
            src={avatar || undefined}
            alt="avatar"
            shape="rounded"
            className="w-full h-full object-cover"
          />
        </button>
        <Text
          sz="md"
          weight="bold"
          wrap="whitespace-normal"
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
    </>
  );
};

export const SearchUserSkeleton: React.FC = () => {
  return (
    <>
      <div className="flex sm:hidden items-center gap-3 p-3 bg-bg-second rounded-2xl w-full border border-bg-fourth animate-pulse">
        <div className="w-14 h-14 bg-bg-fourth rounded-2xl shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-bg-fourth rounded w-3/4 mb-2" />
          <div className="h-3 bg-bg-fourth rounded w-1/2" />
        </div>
        <div className="w-[100px] h-8 bg-bg-fourth rounded-lg shrink-0" />
      </div>

      <div className="hidden sm:flex flex-col items-start bg-bg-main rounded-2xl border-2 border-bg-fourth p-4 gap-2 w-full animate-pulse">
        <div className="w-full aspect-square bg-bg-fourth rounded-2xl mb-2" />
        <div className="h-5 bg-bg-fourth rounded w-3/4 mb-1" />
        <div className="w-full h-8 bg-bg-fourth rounded-lg mt-2" />
      </div>
    </>
  );
};

export default SearchUserItem;
