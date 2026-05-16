import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { ChatPanel } from "../../components/chat-panel";
import {
  Avatar,
  AvatarSkeletonLoading,
  MiniButton,
  Skeleton,
  Text,
  Button,
  Textbox,
} from "@/components/atoms";
import Transition, { AnimationLib } from "@/components/ui/utils/transition";
import { convManager, useConversationStore } from "../../services/conversation-manager";
import { useRef, useState } from "react";
import {
  useGetConversation,
  useUpdateConversationAvatar,
  useUpdateConversationName,
} from "../../hooks/use-conversation";
import { useRenderConversationContent } from "../../hooks/use-render-conversation-content";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem } from "@/components/ui/menu";
import { ComponentProps } from "@/components/common/component-type";
import { useMobile } from "@/hooks/use-mobile";
import { useDialog } from "@/contexts";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { ParticipantList } from "../../components/participant-list";

interface ConversationPageProps extends ComponentProps {}

export const ConversationPage: React.FC<ConversationPageProps> = ({}) => {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId: string }>();
  const [openSetting, setOpenSetting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = useConversationStore((state) => state.totalUnreadCount);
  const { t } = useTranslation();
  const { renderConversationName } = useRenderConversationContent();
  const { fetch: updateAvatar, isFetching } = useUpdateConversationAvatar(conversationId!);

  const { data: conversationData, isPending: isPendingConversation } = useGetConversation(
    conversationId!,
    undefined,
    true,
  );

  const isMobile = useMobile();
  const { openDialog, closeDialog } = useDialog();
  const [isRenaming, setIsRenaming] = useState(false);
  const [viewMode, setViewMode] = useState<"main" | "members">("main");
  const [newName, setNewName] = useState("");
  const { fetch: updateName, isFetching: isRenamingLoading } = useUpdateConversationName(
    conversationId!,
  );

  const handleTurnBack = () => {
    navigate("/fatalk");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversationId) return;

    await updateAvatar(
      { file },
      {
        onSuccess: () => {
          convManager.updateConversation(conversationId, { avatarUrl: URL.createObjectURL(file) });
        },
      },
    );
    e.target.value = "";
  };

  const handleUpdateName = async () => {
    const nameToUpdate = isMobile ? newName : renameInputRef.current?.value;
    if (!nameToUpdate?.trim() || !conversationId) return;

    await updateName(
      { name: nameToUpdate },
      {
        onSuccess: () => {
          convManager.updateConversation(conversationId, { name: nameToUpdate });
          setIsRenaming(false);
          closeDialog();
        },
      },
    );
  };

  const openRenameFlow = () => {
    const currentName = conversationData?.name || "";
    if (isMobile) {
      setNewName(currentName);
      setIsRenaming(true);
    } else {
      openDialog({
        title: t("common:conversations.settings.changeName"),
        content: (
          <div className="flex flex-col gap-4 min-w-[300px]">
            <Textbox
              ref={renameInputRef}
              defaultValue={currentName}
              placeholder={t("common:conversations.settings.changeNamePlaceholder")}
              autoFocus
              sz="md"
              type="text"
            />
          </div>
        ),
        primaryButton: {
          text: t("settings:editableField.saveButton"),
          onClick: handleUpdateName,
        },
        secondaryButton: {
          text: t("settings:editableField.cancelButton"),
          onClick: closeDialog,
        },
      });
    }
  };

  const openMembersFlow = () => {
    setViewMode("members");
  };

  const handleBackSetting = () => {
    if (viewMode === "members") {
      setViewMode("main");
    } else {
      setOpenSetting(false);
    }
  };

  return (
    <div className="flex relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <ChatPanel
        conversationId={conversationId!}
        className="w-full h-[calc(100dvh-var(--header-height))]"
        onTurnback={() => navigate("/fatalk")}
        headerLeft={
          <div className="flex items-center gap-1">
            <MiniButton sz="sm" onClick={handleTurnBack} className="block lg:hidden">
              <i className="fa-solid fa-arrow-left text-primary-400" />
            </MiniButton>
            <Transition show={unreadCount > 0} animation={AnimationLib.Fade}>
              <div className="rounded-full bg-primary-500 px-2 text-white">
                <Text className="text-white" weight="bold">
                  {unreadCount}
                </Text>
              </div>
            </Transition>
          </div>
        }
        headerRight={
          <MiniButton sz="sm" onClick={() => setOpenSetting((prev) => !prev)}>
            <i className="fa-solid fa-ellipsis text-primary-400" />
          </MiniButton>
        }
      />
      <Transition
        show={openSetting}
        animation={AnimationLib.SoftFade}
        duration={150}
        className={clsx(
          "bg-bg-main border-l border-bg-third h-[calc(100dvh-var(--header-height))]",
          "lg:w-[380px] lg:min-w-[380px] lg:relative lg:z-0",
          "fixed inset-0 z-50 shadow-2xl lg:shadow-none",
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
          <div className="flex items-center gap-3 px-4 h-[60px] border-b border-bg-fourth shrink-0">
            <MiniButton
              sz="sm"
              onClick={handleBackSetting}
              className={clsx(!isMobile && viewMode === "main" && "hidden")}
            >
              <i className="fa-solid fa-arrow-left text-primary-400" />
            </MiniButton>
            <Text weight="bold" sz="md">
              {viewMode === "members"
                ? t("common:conversations.settings.viewMembers")
                : t("common:conversations.settings.info")}
            </Text>
          </div>

          {conversationData && !isPendingConversation ? (
            <div className="flex flex-col flex-1 overflow-hidden">
              {viewMode === "main" ? (
                <div className="flex flex-col flex-1 pb-10 overflow-y-auto scrollbar-hide">
                  <div className="flex flex-col items-center px-4 py-8 gap-3">
                    <div className="relative group">
                      {!isFetching ? (
                        <Avatar
                          src={conversationData.avatarUrl || ""}
                          alt="Avatar"
                          sz="lg"
                          className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-bg-third shadow-lg"
                        />
                      ) : (
                        <AvatarSkeletonLoading alt={""} />
                      )}
                      {conversationData.isGroup && (
                        <button
                          onClick={triggerFileInput}
                          className="absolute bottom-1 right-1 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform active:scale-95"
                        >
                          <i className="fa-solid fa-camera text-xs" />
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Text
                        sz="lg"
                        weight="bold"
                        wrap="whitespace-pre-wrap"
                        className="text-center"
                      >
                        {renderConversationName(conversationData)}
                      </Text>
                      {conversationData.isGroup && (
                        <Text sz="xs" className="text-text-third">
                          {t("common:conversations.settings.members", {
                            count: conversationData.participantCount,
                          })}
                        </Text>
                      )}
                    </div>

                    {conversationData.isGroup && (
                      <div className="flex justify-center w-full gap-10 mt-6 px-4">
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
                          <MiniButton
                            sz="md"
                            className="bg-bg-third hover:bg-bg-fourth rounded-full w-12 h-12"
                            onClick={triggerFileInput}
                          >
                            <i className="fa-solid fa-image" />
                          </MiniButton>
                          <Text sz="xs" weight="medium" className="text-center">
                            {t("common:conversations.settings.changeAvatar")}
                          </Text>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
                          <MiniButton
                            sz="md"
                            className="bg-bg-third hover:bg-bg-fourth rounded-full w-12 h-12"
                            onClick={openRenameFlow}
                          >
                            <i className="fa-solid fa-pen-to-square" />
                          </MiniButton>
                          <Text sz="xs" weight="medium" className="text-center">
                            {t("common:conversations.settings.changeName")}
                          </Text>
                        </div>
                      </div>
                    )}
                    {!conversationData.isGroup && conversationData.otherUserId && (
                      <div className="flex justify-center w-full gap-10 mt-6 px-4">
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-[120px]">
                          <MiniButton
                            sz="md"
                            className="bg-bg-third hover:bg-bg-fourth rounded-full w-12 h-12"
                            onClick={() => navigate(`/${conversationData.otherUserId}`)}
                          >
                            <i className="fa-solid fa-user" />
                          </MiniButton>
                          <Text sz="xs" weight="medium" className="text-center">
                            {t("common:conversations.settings.viewProfile")}
                          </Text>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="h-2 bg-bg-secondary w-full" />

                  <Menu className="p-2">
                    {conversationData.isGroup && (
                      <MenuItem
                        icon="fa-solid fa-user-group"
                        title={t("common:conversations.settings.viewMembers")}
                        description={t("common:conversations.settings.viewMembersDescription")}
                        onClick={openMembersFlow}
                      />
                    )}
                  </Menu>
                </div>
              ) : (
                <div className="flex-1 overflow-hidden">
                  <ParticipantList conversationId={conversationId!} />
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 py-8">
              <Skeleton sz="lg" className="mx-auto mb-6 w-32 h-32" variant="circle" />
              <Skeleton sz="md" className="mx-auto mb-4 w-2/3 h-6" />
              <Skeleton sz="sm" className="mx-auto w-1/2 h-4" />
              <div className="flex justify-center gap-4 mt-8">
                <Skeleton variant="circle" className="w-12 h-12" />
                <Skeleton variant="circle" className="w-12 h-12" />
                <Skeleton variant="circle" className="w-12 h-12" />
              </div>
            </div>
          )}
        </div>
      </Transition>

      <BottomSheet
        open={isRenaming && isMobile}
        onOpenChange={setIsRenaming}
        title={t("common:conversations.settings.changeName")}
        trigger={<div className="hidden" />}
      >
        <div className="p-4 flex flex-col gap-6 pb-10">
          <Textbox
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t("common:conversations.settings.changeNamePlaceholder")}
            autoFocus
            sz="md"
            type="text"
          />
          <div className="flex gap-3">
            <Button
              className="flex-1"
              variant="secondary"
              onClick={() => setIsRenaming(false)}
              disabled={isRenamingLoading}
            >
              {t("settings:editableField.cancelButton")}
            </Button>
            <Button
              className="flex-1"
              onClick={handleUpdateName}
              disabled={!newName.trim() || isRenamingLoading}
            >
              {t("settings:editableField.saveButton")}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
