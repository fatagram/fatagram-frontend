import { Text, Avatar, Textbox } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import { MultiSelect } from "@/components/ui/multi-select/multi-select";
import { useAuth } from "@/contexts";
import { useCreateGroupConversation } from "@/features/chat/hooks/use-conversation";
import { useGetInfiniteUsers } from "@/features/hooks/use-user";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import clsx from "clsx";
import { useCallback, useRef } from "react";
import { t } from "i18next";

interface CreateGroupChatProps extends ComponentProps {
  onTurnBack?: () => void;
  onCreateSuccess?: (conversationId: string) => void;
}

export const CreateGroupChat: React.FC<CreateGroupChatProps> = ({
  className,
  onTurnBack,
  onCreateSuccess,
}) => {
  const { userId } = useAuth();
  const { data: me } = useGetUserProfile(userId!);
  const { data: users, fetchNextPage, hasNextPage } = useGetInfiniteUsers();
  const { fetch: createGroupChat, isFetching } = useCreateGroupConversation();
  const textboxRef = useRef<HTMLInputElement | null>(null);

  const options = users?.pages.flatMap((page) =>
    page.items
      .filter((user) => user.id !== userId)
      .map((user) => ({
        item: { name: user.fullName, avatar: user.avatar },
        value: user.id,
      })),
  );

  const defaultSelected = me
    ? [
        {
          item: { name: me.infos.fullName, avatar: me.infos.avatar },
          value: userId,
        },
      ]
    : [];

  const handleCreateGroupChat = useCallback(
    async (selectedValues: any[]) => {
      const name = textboxRef.current?.value;
      await createGroupChat(
        { participantIds: selectedValues, name: name || null },
        {
          onSuccess: (data) => {
            if (data) onCreateSuccess?.(data);
          },
        },
      );
    },
    [createGroupChat],
  );

  return (
    <div className={clsx("flex flex-col h-full overflow-hidden px-2 pb-4", className)}>
      <div className="ml-1">
        <Text weight="bold" sz="md">
          {t("common:conversations.createGroupChat")}
        </Text>
      </div>
      <Textbox
        sz="sm"
        placeholder={t("common:conversations.enterGroupNameOptional")}
        className="w-full !rounded-lg my-2"
        ref={textboxRef}
        disabled={isFetching}
        type="text"
      />
      <MultiSelect
        options={options}
        defaultSelected={defaultSelected}
        itemTemplate={(item, isSelected) => (
          <div
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
              isSelected ? "bg-bg-third" : "hover:bg-bg-third/60",
            )}
          >
            <div className="relative flex-shrink-0">
              <Avatar src={item.avatar} alt={item.name} sz="md" />
            </div>

            <div className="flex-1 min-w-0">
              <span
                className={clsx(
                  "text-sm truncate",
                  isSelected ? "font-medium text-text-main" : "text-text-main/80",
                )}
              >
                {item.name}
              </span>
            </div>

            {isSelected && <div className="w-2 h-2 rounded-full bg-primary-500" />}
          </div>
        )}
        selectItemTemplate={(item, onRemove) => (
          <div
            className={clsx(
              "flex items-center gap-1 px-3 py-2 rounded-md  text-primary-500 bg-primary-500/15 text-xs",
            )}
          >
            <span className="truncate max-w-[100px]">{item.name}</span>
            <button
              className="flex items-center justify-center w-4 h-4 rounded-sm hover:bg-primary-500/20 transition-colors"
              onClick={onRemove}
            >
              ×
            </button>
          </div>
        )}
        defaultItemTemplate={(item) => (
          <div className="flex items-center gap-1 px-3 py-2 rounded-md bg-gray-500/15 text-xs">
            <span className="truncate max-w-[100px]">{item.name}</span>
          </div>
        )}
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage}
        selectClassName={clsx(
          "flex flex-wrap gap-1 border-2 border-bg-third bg-bg-sixth rounded-lg px-2 py-2",
          "min-h-[50px] max-h-[300px] overflow-y-auto scrollbar-hide",
        )}
        optionClassName="h-full overflow-y-auto pr-1 border-2 rounded-md border-bg-third"
        className="flex-1"
        canRemoveDefaultSelected={false}
        onAccept={handleCreateGroupChat}
        onCancel={onTurnBack}
        isLoading={isFetching}
      />
    </div>
  );
};
