import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { ChatPanel } from "../../components/chat-panel";
import { MessageRow } from "../../components/message-row";
import { ChatInput } from "../../components/chat-input";
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
import { useRef, useState, useEffect, useMemo } from "react";
import {
  useGetConversation,
  useUpdateConversationAvatar,
  useUpdateConversationBackground,
  useUpdateConversationName,
  useUpdateConversationTheme,
} from "../../hooks/use-conversation";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem } from "@/components/ui/menu";
import { ComponentProps } from "@/components/common/component-type";
import { useMobile } from "@/hooks/use-mobile";
import { useDialog, useTheme } from "@/contexts";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { ParticipantList } from "../../components/participant-list";
import { useRenderConversationContent } from "../../hooks/use-render-conversation-content";
import { themeDetails } from "./chat-themes.config";
import { dataURLtoFile } from "./chat-theme-utils";
import { uploadService } from "@/api/upload/upload.api";

interface ConversationPageProps extends ComponentProps {}

const renderThemeIconCircle = (item: (typeof themeDetails)[0], isDark: boolean) => {
  if (item.isDefault) {
    return (
      <div className="w-10 h-10 rounded-full overflow-hidden flex border border-border-main/30 shadow-sm shrink-0">
        <svg viewBox="0 0 56 56" className="w-full h-full flex-shrink-0">
          <path d="M28,0 A28,28 0 0,0 28,56 Z" fill="#ffffff" />
          <path d="M28,0 A28,28 0 0,1 28,56 Z" fill="#1f2937" />
          <circle cx="28" cy="28" r="12" fill="#ff6b8b" />
        </svg>
      </div>
    );
  }
  if ((item as any).bgImage) {
    return (
      <div
        className="w-10 h-10 rounded-full overflow-hidden flex border border-border-main/30 shadow-sm shrink-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${(item as any).bgImage})` }}
      />
    );
  }
  const colors = isDark ? item.dark : item.light;
  if (!colors) return null;
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden flex border border-border-main/30 shadow-sm shrink-0">
      <div className={clsx("w-1/2 h-full", colors.gradient)} />
      <div className="w-1/2 h-full flex flex-col">
        <div className="flex-1 flex">
          <div className="flex-1" style={{ backgroundColor: colors.primaryLight }} />
          <div className="flex-1" style={{ backgroundColor: colors.primaryMain }} />
        </div>
        <div className="flex-1 flex">
          <div className="flex-1" style={{ backgroundColor: colors.bgMain }} />
          <div className="flex-1" style={{ backgroundColor: colors.bgSecond }} />
        </div>
      </div>
    </div>
  );
};

const ChatThemePicker: React.FC<{
  selectedTheme: string;
  onSelectTheme: (themeKey: string) => void;
}> = ({ selectedTheme, onSelectTheme }) => {
  const { theme: currentGlobalTheme } = useTheme();
  const { t } = useTranslation();
  const isSystemDark =
    currentGlobalTheme === "system"
      ? typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
      : currentGlobalTheme === "dark" || currentGlobalTheme === "dark-old";

  const sortedThemes = useMemo(() => {
    const defaultTheme = themeDetails.filter((t) => t.isDefault);
    const eventThemes = themeDetails.filter((t) => !t.isDefault && (t as any).isEvent);
    const hasBgThemes = themeDetails.filter(
      (t) => !t.isDefault && !(t as any).isEvent && (t as any).bgImage,
    );
    const normalThemes = themeDetails.filter(
      (t) => !t.isDefault && !(t as any).isEvent && !(t as any).bgImage,
    );
    return [...defaultTheme, ...eventThemes, ...hasBgThemes, ...normalThemes];
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3 w-full p-1 overflow-y-auto flex-1 min-h-[160px] scrollbar-thin">
      {sortedThemes.map((item) => {
        const isActive = selectedTheme === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onSelectTheme(item.key)}
            className={clsx(
              "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-155 w-full h-[106px] shrink-0",
              "hover:scale-[1.02] active:scale-95 cursor-pointer relative overflow-hidden",
              isActive
                ? "border-primary-500 bg-primary-500/[0.04] shadow-sm"
                : "border-border-main/20 hover:border-border-main/50 bg-bg-third/10",
            )}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden flex border border-border-main/30 shadow-sm shrink-0 bg-cover bg-center relative">
              {item.isDefault ? (
                <svg viewBox="0 0 56 56" className="w-full h-full flex-shrink-0">
                  <path d="M28,0 A28,28 0 0,0 28,56 Z" fill="#ffffff" />
                  <path d="M28,0 A28,28 0 0,1 28,56 Z" fill="#1f2937" />
                  <circle cx="28" cy="28" r="12" fill="#ff6b8b" />
                </svg>
              ) : (item as any).bgImage ? (
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${(item as any).bgImage})` }}
                />
              ) : (
                (() => {
                  const colors = isSystemDark ? item.dark : item.light;
                  if (!colors) return null;
                  return (
                    <>
                      <div className={clsx("w-1/2 h-full", colors.gradient)} />
                      <div className="w-1/2 h-full flex flex-col">
                        <div className="flex-1 flex">
                          <div
                            className="flex-1"
                            style={{ backgroundColor: colors.primaryLight }}
                          />
                          <div className="flex-1" style={{ backgroundColor: colors.primaryMain }} />
                        </div>
                        <div className="flex-1 flex">
                          <div className="flex-1" style={{ backgroundColor: colors.bgMain }} />
                          <div className="flex-1" style={{ backgroundColor: colors.bgSecond }} />
                        </div>
                      </div>
                    </>
                  );
                })()
              )}
            </div>
            <Text
              sz="xs"
              weight={isActive ? "bold" : "medium"}
              className="text-center text-text-main"
            >
              {t(`common:conversations.themes.${item.key.replace("chat-", "")}`, item.label)}
            </Text>
            {isActive && (
              <div className="absolute top-1 right-1 bg-primary-500 text-white w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-fade-in">
                <i className="fa-solid fa-check text-[9px]" />
              </div>
            )}
            {(item as any).isEvent && (
              <div className="absolute top-1 left-1 bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 border border-secondary-500/20 text-[8px] font-bold px-1.5 py-0.5 rounded scale-90 origin-top-left uppercase tracking-wider">
                Sự kiện
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

const ChatThemeDialogContent: React.FC<{
  initialTheme: string;
  initialBackgroundUrl: string | null;
  conversationId: string;
  onSelect: (themeKey: string) => void;
  onBackgroundUrlChange: (bgUrl: string | null) => void;
}> = ({ initialTheme, initialBackgroundUrl, onSelect, onBackgroundUrlChange }) => {
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(initialBackgroundUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMobile();

  const handleSelectTheme = (themeName: string) => {
    setSelectedTheme(themeName);
    onSelect(themeName);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setBackgroundUrl(base64String);
      onBackgroundUrlChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = () => {
    setBackgroundUrl(null);
    onBackgroundUrlChange(null);
  };

  const mockMsg1 = {
    id: "mock-1",
    conversationId: "mock-conv",
    senderId: "other-user",
    content: "Xin chào! Đây là tin nhắn của bạn bè.",
    type: "Text" as any,
    sequenceNumber: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    isGroup: false,
  };

  const mockMsg1Meta = {
    _isFirstInGroup: true,
    _isLastInGroup: true,
    _isOnlyOneInGroup: true,
    _isLastMessage: false,
    _isShowTime: false,
    _isShowAvatar: true,
    _isMyMessage: false,
    _messageBubbleShapeClass: "rounded-2xl rounded-bl-sm",
    _isOnlyEmoji: false,
    _type: "Text" as any,
    _isShowName: false,
    _isOlderThanOneMinute: false,
    _shouldAnimate: false,
  };

  const mockMsg2 = {
    id: "mock-2",
    conversationId: "mock-conv",
    senderId: "my-user",
    content: "Trông tuyệt vời quá! Đây là tin nhắn của bạn.",
    type: "Text" as any,
    sequenceNumber: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    isGroup: false,
  };

  const mockMsg2Meta = {
    _isFirstInGroup: true,
    _isLastInGroup: true,
    _isOnlyOneInGroup: true,
    _isLastMessage: true,
    _isShowTime: false,
    _isShowAvatar: false,
    _isMyMessage: true,
    _messageBubbleShapeClass: "rounded-2xl rounded-br-sm",
    _isOnlyEmoji: false,
    _type: "Text" as any,
    _isShowName: false,
    _isOlderThanOneMinute: false,
    _shouldAnimate: false,
  };

  return (
    <div className="flex flex-col gap-4 w-full select-none flex-1 min-h-0">
      <div className="flex flex-col gap-2 shrink-0">
        <Text sz="sm" weight="bold" className="text-text-second pl-1">
          Xem trước
        </Text>
        <div
          data-chat-theme={selectedTheme === "default" ? undefined : selectedTheme}
          className="relative flex flex-col bg-bg-main rounded-xl border border-border-main/60 shadow-inner overflow-hidden min-h-[240px] transition-colors duration-200"
        >
          <div
            className={clsx(
              "absolute top-2 right-2 z-30 flex items-center pointer-events-auto",
              isMobile ? "gap-2" : "gap-1.5",
            )}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <MiniButton
              sz={isMobile ? "md" : "sm"}
              variant="secondary"
              className=" bg-black/40 hover:bg-black/60 text-white border-none shadow-md"
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="fa-solid fa-cloud-arrow-up text-xs"></i>
            </MiniButton>
            {backgroundUrl && (
              <MiniButton
                sz={isMobile ? "md" : "sm"}
                className="bg-red-600/50 hover:bg-red-600/35 text-white border-none shadow-md animate-fade-in"
                onClick={handleRemoveBackground}
              >
                <i className="fa-solid fa-trash-can text-xs"></i>
              </MiniButton>
            )}
          </div>
          <div
            data-chat-scrollable="true"
            style={
              backgroundUrl
                ? ({ "--chat-custom-bg": `url(${backgroundUrl})` } as React.CSSProperties)
                : undefined
            }
            className="flex-1 py-2 overflow-y-auto flex flex-col justify-end px-2 pb-4 pointer-events-none select-none"
          >
            <MessageRow
              message={mockMsg1 as any}
              userId="my-user"
              conversationId="mock-conv"
              userInfo={{
                name: "Bạn bè",
                avatarUrl: "",
              }}
              userProfileMap={{}}
              meta={mockMsg1Meta as any}
            />
            <MessageRow
              message={mockMsg2 as any}
              userId="my-user"
              conversationId="mock-conv"
              meta={mockMsg2Meta as any}
            />
          </div>
          <div className="pointer-events-none opacity-90 border-t border-border-main/30 shrink-0">
            <ChatInput
              className="!bg-bg-main h-auto py-2 px-1 touch-none"
              conversationId="mock-conv"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-1 min-h-0">
        <Text sz="sm" weight="bold" className="text-text-second pl-1 shrink-0">
          Chọn chủ đề
        </Text>
        <ChatThemePicker selectedTheme={selectedTheme} onSelectTheme={handleSelectTheme} />
      </div>
    </div>
  );
};

export const ConversationPage: React.FC<ConversationPageProps> = ({}) => {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId: string }>();
  const [openSetting, setOpenSetting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOpenSetting(false);
    setViewMode("main");
  }, [conversationId]);

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

  const storeConv = useConversationStore((state) =>
    state.conversations.find((c) => c.id === conversationId),
  );
  const conv = conversationData ?? storeConv;

  const { theme: currentGlobalTheme } = useTheme();
  const isSystemDark =
    currentGlobalTheme === "system"
      ? typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
      : currentGlobalTheme === "dark" || currentGlobalTheme === "dark-old";

  const themeLabels: Record<string, string> = {
    default: "Mặc định",
    "chat-emerald": "Emerald",
    "chat-sunset": "Sunset",
    "chat-cyberpunk": "Cyberpunk",
    "chat-lavender": "Lavender",
    "chat-ocean": "Ocean Deep",
    "chat-bubblegum": "Bubblegum",
    "chat-worldcup": "World Cup",
    "chat-vietnam": "Việt Nam",
    "chat-vutru": "Vũ trụ",
  };
  const activeThemeKey = conv?.theme || "default";
  const currentThemeLabel = t(
    `common:conversations.themes.${activeThemeKey.replace("chat-", "")}`,
    themeLabels[activeThemeKey] || "Mặc định",
  );
  const activeThemeObj = themeDetails.find((t) => t.key === activeThemeKey) || themeDetails[0];

  const { openDialog, closeDialog } = useDialog();
  const [isSaving, setIsSaving] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [viewMode, setViewMode] = useState<"main" | "members" | "theme">("main");
  const mobileSelectedThemeRef = useRef<string>("default");
  const mobileSelectedBackgroundUrlRef = useRef<string | null>(null);
  const [newName, setNewName] = useState("");
  const { fetch: updateName, isFetching: isRenamingLoading } = useUpdateConversationName(
    conversationId!,
  );
  const { fetch: updateTheme } = useUpdateConversationTheme(conversationId!);
  const { fetch: updateBackground } = useUpdateConversationBackground(conversationId!);

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
          } else {
            console.error("Failed to upload background to Cloudinary:", uploadRes.error);
          }
        }
      } else {
        await updateBackground({ backgroundUrl: selectedBackgroundUrl });
      }
    }
  };

  const handleTurnBack = () => {
    navigate("/fatalk");
  };

  const openThemePickerFlow = () => {
    const originalTheme = conv?.theme || "default";
    const originalBackgroundUrl = conv?.backgroundUrl || null;

    if (isMobile) {
      mobileSelectedThemeRef.current = originalTheme;
      mobileSelectedBackgroundUrlRef.current = originalBackgroundUrl;
      setViewMode("theme");
    } else {
      let selectedThemeKey = originalTheme;
      let selectedBackgroundUrl = originalBackgroundUrl;
      openDialog({
        title: t("common:conversations.settings.changeTheme", "Chủ đề đoạn chat"),
        className: "w-[480px] max-h-[90vh] flex flex-col overflow-hidden",
        content: (
          <ChatThemeDialogContent
            initialTheme={originalTheme}
            initialBackgroundUrl={originalBackgroundUrl}
            conversationId={conversationId!}
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
            setIsSaving(true);
            try {
              await handleSaveThemeAndBackground(selectedThemeKey, selectedBackgroundUrl);
            } finally {
              setIsSaving(false);
            }
          },
        },
        secondaryButton: {
          text: "Hủy",
          onClick: () => {
            closeDialog();
          },
        },
        onClose: () => {},
      });
    }
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
    const currentName = conv?.name || "";
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
    if (viewMode === "members" || viewMode === "theme") {
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
                : viewMode === "theme"
                  ? t("common:conversations.settings.changeTheme", "Chủ đề đoạn chat")
                  : t("common:conversations.settings.info")}
            </Text>
          </div>

          {conv && !isPendingConversation ? (
            <div className="flex flex-col flex-1 overflow-hidden">
              {viewMode === "main" ? (
                <div className="flex flex-col flex-1 pb-10 overflow-y-auto scrollbar-hide">
                  <div className="flex flex-col items-center px-4 py-8 gap-3">
                    <div className="relative group">
                      {!isFetching ? (
                        <Avatar
                          src={conv.avatarUrl || ""}
                          alt="Avatar"
                          sz="lg"
                          className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-bg-third shadow-lg"
                        />
                      ) : (
                        <AvatarSkeletonLoading alt={""} />
                      )}
                      {conv.isGroup && (
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
                        {renderConversationName(conv)}
                      </Text>
                      {conv.isGroup && (
                        <Text sz="xs" className="text-text-third">
                          {t("common:conversations.settings.members", {
                            count: conv.participantCount,
                          })}
                        </Text>
                      )}
                    </div>

                    {conv.isGroup && (
                      <div className="flex justify-center w-full gap-8 mt-6 px-4">
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
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
                          <MiniButton
                            sz="md"
                            className="bg-bg-third hover:bg-bg-fourth rounded-full w-12 h-12"
                            onClick={openThemePickerFlow}
                          >
                            <i className="fa-solid fa-palette" />
                          </MiniButton>
                          <Text sz="xs" weight="medium" className="text-center">
                            {t("common:conversations.settings.changeTheme", "Chủ đề")}
                          </Text>
                        </div>
                      </div>
                    )}
                    {!conv.isGroup && conv.otherUserId && (
                      <div className="flex justify-center w-full gap-10 mt-6 px-4">
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
                          <MiniButton
                            sz="md"
                            className="bg-bg-third hover:bg-bg-fourth rounded-full w-12 h-12"
                            onClick={() => navigate(`/${conv.otherUserId}`)}
                          >
                            <i className="fa-solid fa-user" />
                          </MiniButton>
                          <Text sz="xs" weight="medium" className="text-center">
                            {t("common:conversations.settings.viewProfile")}
                          </Text>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
                          <MiniButton
                            sz="md"
                            className="bg-bg-third hover:bg-bg-fourth rounded-full w-12 h-12"
                            onClick={openThemePickerFlow}
                          >
                            <i className="fa-solid fa-palette" />
                          </MiniButton>
                          <Text sz="xs" weight="medium" className="text-center">
                            {t("common:conversations.settings.changeTheme", "Chủ đề")}
                          </Text>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="h-2 bg-bg-secondary w-full" />

                  <Menu className="p-2">
                    {conv.isGroup && (
                      <MenuItem
                        icon="fa-solid fa-user-group"
                        title={t("common:conversations.settings.viewMembers")}
                        description={t("common:conversations.settings.viewMembersDescription")}
                        onClick={openMembersFlow}
                      />
                    )}
                    <MenuItem
                      icon={renderThemeIconCircle(activeThemeObj, isSystemDark)}
                      hideIconContainer={true}
                      title={t("common:conversations.settings.changeTheme", "Chủ đề đoạn chat")}
                      description={t(
                        "common:conversations.settings.changeThemeDescription",
                        "Thay đổi giao diện màu sắc của riêng cuộc trò chuyện này",
                      )}
                      rightElement={
                        <div className="flex items-center gap-2 shrink-0">
                          <Text
                            sz="xs"
                            className="text-text-third bg-bg-third px-2 py-0.5 rounded-full border border-border-main/50"
                          >
                            {currentThemeLabel}
                          </Text>
                          <i className="fa-solid fa-chevron-right text-[10px] text-text-fourth" />
                        </div>
                      }
                      onClick={openThemePickerFlow}
                    />
                  </Menu>
                </div>
              ) : viewMode === "members" ? (
                <div className="flex-1 overflow-hidden">
                  <ParticipantList conversationId={conversationId!} />
                </div>
              ) : (
                <div className="flex flex-col flex-1 overflow-hidden p-4 bg-bg-main">
                  <ChatThemeDialogContent
                    initialTheme={conv?.theme || "default"}
                    initialBackgroundUrl={conv?.backgroundUrl || null}
                    conversationId={conversationId!}
                    onSelect={(themeName) => {
                      mobileSelectedThemeRef.current = themeName;
                    }}
                    onBackgroundUrlChange={(bgUrl) => {
                      mobileSelectedBackgroundUrlRef.current = bgUrl;
                    }}
                  />
                  <div className="mt-4 pt-4 border-t border-bg-fourth flex gap-3 bg-bg-main shrink-0">
                    <Button variant="third" className="flex-1" onClick={() => setViewMode("main")}>
                      Hủy
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={async () => {
                        setViewMode("main");
                        setIsSaving(true);
                        try {
                          await handleSaveThemeAndBackground(
                            mobileSelectedThemeRef.current,
                            mobileSelectedBackgroundUrlRef.current,
                          );
                        } finally {
                          setIsSaving(false);
                        }
                      }}
                    >
                      Lưu
                    </Button>
                  </div>
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
      {isSaving && (
        <div className="absolute inset-0 z-[999] flex flex-col items-center justify-center bg-bg-main/60 backdrop-blur-md animate-fade-in">
          <div className="flex flex-col items-center gap-3 p-6 bg-bg-second border border-border-main/50 rounded-2xl shadow-xl max-w-xs text-center animate-scale-up">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <Text weight="bold" className="text-text-main">
              Đang lưu thay đổi...
            </Text>
            <Text sz="xs" className="text-text-third">
              Vui lòng đợi trong giây lát
            </Text>
          </div>
        </div>
      )}
    </div>
  );
};
