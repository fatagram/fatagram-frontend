import React, { useState, useCallback } from "react";
import { Avatar } from "@/components/atoms";
import { MultiSelect } from "@/components/ui/multi-select";
import { useAuth } from "@/contexts";
import { useGetInfiniteUsers, useSearchUsers } from "@/features/hooks/use-user";
import { useAddParticipants, useGetParticipants } from "../hooks/use-conversation";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { User } from "@/types/entities/user.type";
import { SearchUserDto } from "@/api/user/dto/search-user.dto";

interface UserItemData {
  name?: string;
  avatar?: string;
}

interface UserOptionItemProps {
  item: UserItemData;
  isSelected?: boolean;
}

const UserOptionItem: React.FC<UserOptionItemProps> = ({ item, isSelected }) => (
  <div
    className={clsx(
      "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
      isSelected ? "bg-bg-third" : "hover:bg-bg-third/60",
    )}
  >
    <div className="relative shrink-0">
      <Avatar src={item.avatar} alt={item.name || ""} sz="md" />
    </div>

    <div className="flex-1 min-w-0">
      <span
        className={clsx(
          "text-sm truncate block",
          isSelected ? "font-medium text-text-main" : "text-text-main/80",
        )}
      >
        {item.name}
      </span>
    </div>

    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shrink-0" />}
  </div>
);

interface SelectedUserBadgeProps {
  item: UserItemData;
  onRemove: () => void;
}

const SelectedUserBadge: React.FC<SelectedUserBadgeProps> = ({ item, onRemove }) => (
  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-primary-600 bg-primary-500/15 text-xs font-medium">
    <span className="truncate max-w-[120px]">{item.name}</span>
    <button
      type="button"
      className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-500/20 transition-colors text-xs leading-none"
      onClick={onRemove}
    >
      ×
    </button>
  </div>
);

const renderUserOptionItem = (item: UserItemData, isSelected: boolean) => (
  <UserOptionItem item={item} isSelected={isSelected} />
);

const renderSelectedUserBadge = (item: UserItemData, onRemove: () => void) => (
  <SelectedUserBadge item={item} onRemove={onRemove} />
);

const renderDefaultItem = () => null;

interface AddMembersDialogContentProps {
  conversationId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddMembersDialogContent: React.FC<AddMembersDialogContentProps> = ({
  conversationId,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const [keyword, setKeyword] = useState("");

  const { data: participantsData } = useGetParticipants(conversationId, { limit: 100 });
  const existingParticipantIds = new Set(
    participantsData?.pages.flatMap((page) => page.items.map((p) => p.userId)) || [],
  );

  const {
    data: allUsers,
    fetchNextPage: fetchNextAll,
    hasNextPage: hasNextAll,
  } = useGetInfiniteUsers();
  const {
    data: searchResult,
    fetchNextPage: fetchNextSearch,
    hasNextPage: hasNextSearch,
  } = useSearchUsers({ keyword });

  const users = keyword ? searchResult : allUsers;
  const fetchNextPage = keyword ? fetchNextSearch : fetchNextAll;
  const hasNextPage = keyword ? hasNextSearch : hasNextAll;

  const { fetch: addParticipants, isFetching } = useAddParticipants(conversationId);

  const items: (User | SearchUserDto)[] =
    users?.pages.flatMap((page) => page.items as (User | SearchUserDto)[]) || [];

  const options = items
    .filter(
      (user): user is (User | SearchUserDto) & { id: string } =>
        Boolean(user.id) && user.id !== userId && !existingParticipantIds.has(user.id!),
    )
    .map((user) => ({
      item: { name: user.fullName, avatar: user.avatar ?? undefined },
      value: user.id,
    }));

  const handleAdd = useCallback(
    async (selectedValues: string[]) => {
      if (selectedValues.length === 0) return;
      await addParticipants(
        { participantIds: selectedValues },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        },
      );
    },
    [addParticipants, onSuccess],
  );

  return (
    <div className="flex flex-col h-[420px] w-full overflow-hidden p-1">
      <MultiSelect
        options={options}
        defaultSelected={[]}
        itemTemplate={renderUserOptionItem}
        selectItemTemplate={renderSelectedUserBadge}
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage}
        selectClassName={clsx(
          "flex flex-wrap gap-1 border border-bg-fourth bg-bg-second rounded-lg px-2.5 py-2",
          "min-h-[44px] max-h-[85px] overflow-y-auto scrollbar-hide",
        )}
        optionClassName="h-full overflow-y-auto pr-1 border border-bg-fourth rounded-lg mt-2"
        className="flex-1 min-h-0"
        onAccept={handleAdd}
        onCancel={onCancel}
        isLoading={isFetching}
        emptyComponent={
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <span className="text-sm text-text-third">
              {t("common:conversations.noUsersFound", "Không tìm thấy người dùng")}
            </span>
          </div>
        }
        searchElement={
          <input
            type="text"
            className="flex-1 min-w-[100px] bg-transparent border-0 outline-none text-xs text-text-main py-1 px-1 placeholder-text-third caret-primary-500"
            placeholder={t("common:conversations.searchPlaceholder", "Tìm kiếm bạn bè...")}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        }
        defaultItemTemplate={renderDefaultItem}
      />
    </div>
  );
};
