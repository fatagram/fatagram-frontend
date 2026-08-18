import { MiniButton, Text, Textbox, Skeleton } from "@/components/atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowUpRightFromSquare,
  faUserGroup,
  faPenToSquare,
  faCamera,
  faPalette,
  faUser,
  faPhotoFilm,
} from "@fortawesome/free-solid-svg-icons";
import { ConversationMediaGallery } from "./conversation-media-gallery/conversation-media-gallery";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDialog } from "@/contexts";
import {
  useGetConversation,
  useUpdateConversationAvatar,
  useUpdateConversationName,
  useUpdateConversationTheme,
  useUpdateConversationBackground,
} from "../hooks/use-conversation";
import { convManager, useConversationStore } from "../services/conversation-manager";
import { uploadService } from "@/api/upload/upload.api";
import { dataURLtoFile } from "../fatalk/conversation/chat-theme-utils";
import { ChatThemeDialogContent } from "../fatalk/conversation/conversation-page";
import { ParticipantList } from "./participant-list";
import clsx from "clsx";

interface FloatingChatSidebarProps {
  conversationId: string;
  onClose: () => void;
  isOpen: boolean;
}

export const FloatingChatSidebar: React.FC<FloatingChatSidebarProps> = ({ conversationId, onClose, isOpen }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { openDialog, closeDialog } = useDialog();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const { data: conversationData, isLoading: isLoadingConversation } = useGetConversation(
    conversationId,
    undefined,
    true,
  );

  const storeConv = useConversationStore((state) =>
    state.conversations.find((c) => c.id === conversationId),
  );
  const conv = conversationData ?? storeConv;

  const { fetch: updateAvatar, isFetching: isUpdatingAvatar } = useUpdateConversationAvatar(conversationId);
  const { fetch: updateName } = useUpdateConversationName(conversationId);
  const { fetch: updateTheme } = useUpdateConversationTheme(conversationId);
  const { fetch: updateBackground } = useUpdateConversationBackground(conversationId);

  if (isLoadingConversation || !conv) {
    return (
      <div
        className={clsx(
          "bg-bg-second border border-bg-fourth border-b-0 rounded-t-xl flex flex-col shrink-0 select-none shadow-lg transition-all duration-200 ease-out",
          isOpen ? "w-[240px] h-full opacity-100 mr-3" : "w-0 h-0 opacity-0 mr-0 border-none overflow-hidden"
        )}
      >
        <div className="flex items-center gap-3 px-4 h-[60px] border-b border-bg-fourth shrink-0">
          <MiniButton sz="sm" onClick={onClose}>
            <FontAwesomeIcon icon={faArrowLeft} className="text-primary-400" />
          </MiniButton>
          <Text weight="bold" sz="sm">
            Tùy chọn
          </Text>
        </div>
        <div className="flex flex-col flex-1 p-4 gap-3">
          <Skeleton sz="md" className="h-10 w-full rounded-lg" />
          <Skeleton sz="md" className="h-10 w-full rounded-lg" />
          <Skeleton sz="md" className="h-10 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    const nameToUpdate = renameInputRef.current?.value;
    if (!nameToUpdate?.trim()) return;

    await updateName(
      { name: nameToUpdate },
      {
        onSuccess: () => {
          convManager.updateConversation(conversationId, { name: nameToUpdate });
          closeDialog();
        },
      },
    );
  };

  const openRenameFlow = () => {
    const currentName = conv?.name || "";
    openDialog({
      title: t("common:conversations.settings.changeName"),
      content: (
        <div className="flex flex-col gap-4 min-w-[300px] p-1">
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
  };

  const handleSaveThemeAndBackground = async (
    selectedThemeKey: string,
    selectedBackgroundUrl: string | null,
  ) => {
    const originalTheme = conv?.theme || "default";
    const originalBackgroundUrl = conv?.backgroundUrl || null;

    if (selectedThemeKey !== originalTheme) {
      const finalTheme = selectedThemeKey === "default" ? "default" : selectedThemeKey;
      await updateTheme({ theme: finalTheme as any });
    }

    if (selectedBackgroundUrl !== originalBackgroundUrl) {
      if (!selectedBackgroundUrl) {
        await updateBackground({ backgroundUrl: null });
      } else if (selectedBackgroundUrl.startsWith("data:")) {
        const fileToUpload = dataURLtoFile(selectedBackgroundUrl, "background.png");
        if (fileToUpload) {
          const uploadRes = await uploadService.upload(fileToUpload, "image");
          if (uploadRes.success && uploadRes.data?.url) {
            await updateBackground({ backgroundUrl: uploadRes.data.url });
          }
        }
      } else {
        await updateBackground({ backgroundUrl: selectedBackgroundUrl });
      }
    }
  };

  const openThemePickerFlow = () => {
    const originalTheme = conv?.theme || "default";
    const originalBackgroundUrl = conv?.backgroundUrl || null;

    let selectedThemeKey = originalTheme;
    let selectedBackgroundUrl = originalBackgroundUrl;
    openDialog({
      title: t("common:conversations.settings.changeTheme", "Chủ đề đoạn chat"),
      className:
        "w-[calc(100vw-2rem)] md:w-[740px] max-w-3xl max-h-[90vh] flex flex-col overflow-hidden",
      content: (
        <ChatThemeDialogContent
          initialTheme={originalTheme}
          initialBackgroundUrl={originalBackgroundUrl}
          conversationId={conversationId}
          onSelect={(themeName) => {
            selectedThemeKey = themeName;
          }}
          onBackgroundUrlChange={(bgUrl) => {
            selectedBackgroundUrl = bgUrl;
          }}
        />
      ),
      primaryButton: {
        text: "Lưu",
        onClick: async () => {
          closeDialog();
          try {
            await handleSaveThemeAndBackground(selectedThemeKey, selectedBackgroundUrl);
          } catch (err) {
            console.error(err);
          }
        },
      },
      secondaryButton: {
        text: "Hủy",
        onClick: () => {
          closeDialog();
        },
      },
    });
  };

  const openMembersFlow = () => {
    openDialog({
      title: t("common:conversations.settings.viewMembers"),
      className: "w-[400px] h-[500px] flex flex-col overflow-hidden",
      content: (
        <div className="flex-1 overflow-hidden h-full min-h-0">
          <ParticipantList conversationId={conversationId} />
        </div>
      ),
    });
  };

  const openMediaGalleryFlow = () => {
    openDialog({
      title: t("common:conversations.settings.mediaAndFiles", "File phương tiện & file"),
      className:
        "w-[calc(100vw-2rem)] sm:w-[560px] md:w-[680px] max-w-2xl h-[540px] max-h-[85vh] !px-4 !py-4 sm:!px-6 sm:!py-5 flex flex-col overflow-hidden",
      content: (
        <div className="flex-1 overflow-hidden h-full min-h-0 flex flex-col pt-1">
          <ConversationMediaGallery conversationId={conversationId} />
        </div>
      ),
    });
  };

  return (
    <div
      className={clsx(
        "bg-bg-second border border-bg-fourth border-b-0 rounded-t-xl flex flex-col shrink-0 select-none shadow-lg transition-all duration-200 ease-out",
        isOpen ? "w-[240px] h-full opacity-100 mr-3" : "w-0 h-0 opacity-0 mr-0 border-none overflow-hidden"
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div className="flex items-center gap-3 px-4 h-[60px] border-b border-bg-fourth shrink-0">
        <MiniButton sz="sm" onClick={onClose}>
          <FontAwesomeIcon icon={faArrowLeft} className="text-primary-400" />
        </MiniButton>
        <Text weight="bold" sz="sm">
          Tùy chọn
        </Text>
      </div>
      <div className="flex flex-col flex-1 p-3 gap-2 overflow-y-auto scrollbar-hide">
        <button
          onClick={() => {
            navigate(`/fatalk/${conversationId}`);
            onClose();
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-third transition-colors text-left w-full text-text-main"
        >
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-primary-400 w-4 h-4 shrink-0" />
          <Text sz="sm" weight="medium">Mở trong Fatalk</Text>
        </button>

        {conv.isGroup && (
          <>
            <button
              onClick={openMembersFlow}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-third transition-colors text-left w-full text-text-main"
            >
              <FontAwesomeIcon icon={faUserGroup} className="text-primary-400 w-4 h-4 shrink-0" />
              <Text sz="sm" weight="medium">Xem thành viên</Text>
            </button>

            <button
              onClick={openRenameFlow}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-third transition-colors text-left w-full text-text-main"
            >
              <FontAwesomeIcon icon={faPenToSquare} className="text-primary-400 w-4 h-4 shrink-0" />
              <Text sz="sm" weight="medium">Đổi tên nhóm</Text>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUpdatingAvatar}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-third transition-colors text-left w-full text-text-main disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faCamera} className="text-primary-400 w-4 h-4 shrink-0" />
              <Text sz="sm" weight="medium">Thay đổi ảnh đại diện</Text>
            </button>
          </>
        )}

        {!conv.isGroup && conv.otherUserId && (
          <button
            onClick={() => {
              navigate(`/${conv.otherUserId}`);
              onClose();
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-third transition-colors text-left w-full text-text-main"
          >
            <FontAwesomeIcon icon={faUser} className="text-primary-400 w-4 h-4 shrink-0" />
            <Text sz="sm" weight="medium">Xem trang cá nhân</Text>
          </button>
        )}

        <button
          onClick={openMediaGalleryFlow}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-third transition-colors text-left w-full text-text-main cursor-pointer"
        >
          <FontAwesomeIcon icon={faPhotoFilm} className="text-primary-400 w-4 h-4 shrink-0" />
          <Text sz="sm" weight="medium">File phương tiện & file</Text>
        </button>

        <button
          onClick={openThemePickerFlow}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-third transition-colors text-left w-full text-text-main cursor-pointer"
        >
          <FontAwesomeIcon icon={faPalette} className="text-primary-400 w-4 h-4 shrink-0" />
          <Text sz="sm" weight="medium">Thay đổi chủ đề</Text>
        </button>
      </div>
    </div>
  );
};
