import { UserOptionTrigger } from "./user-option-trigger";
import React from "react";
import { useTranslation } from "react-i18next";
import { useGetParticipants } from "../hooks/use-conversation";
import { Avatar, Text, Skeleton } from "@/components/atoms";
import InfiniteScrollFlex from "@/components/ui/utils/infinite-scroll-flex";
import { UserPlus } from "lucide-react";
import { ConversationRole, type ParticipantDto } from "@/api/conversation/dto/participant.dto";
import { useConversationPermission } from "../hooks/use-conversation-permission";
import { useDialog } from "@/contexts";
import { AddMembersDialogContent } from "./add-members-dialog-content";

export const ParticipantList: React.FC<{ conversationId: string; onClose?: () => void }> = ({
  conversationId,
}) => {
  const { t } = useTranslation();
  const { openDialog, closeDialog } = useDialog();
  const capabilities = useConversationPermission(conversationId);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetParticipants(
    conversationId,
    { limit: 20 },
  );

  const participants = data?.pages.flatMap((page) => page.items) || [];

  const renderRoleBadge = (role?: ConversationRole | number | string) => {
    const isOwner =
      role === ConversationRole.Owner ||
      role === 0 ||
      (typeof role === "string" && role.toLowerCase() === "owner");

    const isAdmin =
      role === ConversationRole.Admin ||
      role === 1 ||
      (typeof role === "string" && role.toLowerCase() === "admin");

    if (isOwner) {
      return (
        <span className="text-xs font-medium text-primary-500 select-none">
          {t("conversations.roles.owner", "Trưởng nhóm")}
        </span>
      );
    }

    if (isAdmin) {
      return (
        <span className="text-xs font-medium text-text-fourth select-none">
          {t("conversations.roles.admin", "Phó nhóm")}
        </span>
      );
    }

    return null;
  };

  const itemTemplate = (p: ParticipantDto) => {
    const roleBadge = renderRoleBadge(p.role);

    return (
      <UserOptionTrigger
        key={p.userId}
        user={{
          userId: p.userId,
          fullName: p.fullname,
          avatarUrl: p.avatarUrl,
        }}
      >
        <div className="flex items-center justify-between gap-3 p-3 hover:bg-bg-second rounded-xl cursor-pointer transition-colors group w-full text-left">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar src={p.avatarUrl} alt={p.fullname} sz="md" className="group-hover:scale-105 transition-transform shrink-0" />
            <div className="flex flex-col min-w-0">
              <Text weight="bold" sz="sm" className="truncate">
                {p.fullname}
              </Text>
              {p.nickname && (
                <Text sz="xs" className="opacity-60 truncate">
                  {p.nickname}
                </Text>
              )}
            </div>
          </div>
          {roleBadge && (
            <div className="shrink-0">
              {roleBadge}
            </div>
          )}
        </div>
      </UserOptionTrigger>
    );
  };

  const loadingSkeleton = (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-3">
        <Skeleton sz="md" variant="circle" className="w-10 h-10" />
        <Skeleton sz="md" className="w-32 h-4" />
      </div>
      <Skeleton sz="sm" className="w-16 h-5 rounded-full" />
    </div>
  );

  const openAddMembersFlow = () => {
    openDialog({
      title: t("common:conversations.settings.addMembers", "Thêm thành viên"),
      className: "w-[calc(100vw-2rem)] sm:w-[480px] max-w-md flex flex-col overflow-hidden",
      content: (
        <AddMembersDialogContent
          conversationId={conversationId}
          onSuccess={() => closeDialog()}
          onCancel={() => closeDialog()}
        />
      ),
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden min-h-0 relative">
      {capabilities.canAddMember && (
        <div className="px-2 pt-2 pb-1 shrink-0 border-b border-bg-fourth/50">
          <button
            onClick={openAddMembersFlow}
            className="flex items-center gap-3 p-2.5 w-full hover:bg-bg-second rounded-xl cursor-pointer transition-colors text-primary-600 dark:text-primary-400 font-medium text-sm group"
          >
            <div className="w-9 h-9 rounded-full bg-primary-500/10 dark:bg-primary-500/20 flex items-center justify-center text-primary-500 group-hover:scale-105 transition-transform shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <span>{t("common:conversations.settings.addMembers", "Thêm thành viên")}</span>
          </button>
        </div>
      )}
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

