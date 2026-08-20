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
  useTogglePinConversation,
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
import { ConversationMediaGallery } from "../../components/conversation-media-gallery/conversation-media-gallery";
import { useRenderConversationContent } from "../../hooks/use-render-conversation-content";
import { useConversationMedia } from "../../hooks/use-conversation-media";
import { useMediaViewer } from "../../context/media-viewer-context";
import { useMediaBlob } from "@/hooks/use-media-blob";
import { MediaType } from "@/types/entities/message.type";
import { MessageMediaDto } from "@/api/message/dto/message.dto";
import { themeDetails } from "./chat-themes.config";
import { dataURLtoFile } from "./chat-theme-utils";
import { uploadService } from "@/api/upload/upload.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCloudArrowUp,
  faTrashCan,
  faArrowLeft,
  faEllipsis,
  faCamera,
  faImage,
  faPenToSquare,
  faPalette,
  faUser,
  faChevronRight,
  faUserGroup,
  faThumbtack,
  faPaperPlane,
  faPhotoFilm,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

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
  className?: string;
}> = ({ selectedTheme, onSelectTheme, className }) => {
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
    <div
      className={clsx(
        "overflow-y-auto overflow-x-hidden p-1 scrollbar-hide sm:scrollbar-default",
        className,
      )}
    >
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full">
        {sortedThemes.map((item) => {
          const isActive = selectedTheme === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectTheme(item.key)}
              className={clsx(
                "flex flex-col items-center justify-center gap-1.5 p-2 sm:p-2.5 rounded-xl border-2 transition-all duration-150 w-full h-[86px] sm:h-[98px] shrink-0",
                "hover:scale-[1.02] active:scale-95 cursor-pointer relative overflow-hidden",
                isActive
                  ? "border-primary-500 bg-primary-500/[0.06] shadow-sm"
                  : "border-border-main/20 hover:border-border-main/50 bg-bg-third/15",
              )}
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden flex border border-border-main/30 shadow-sm shrink-0 bg-cover bg-center relative">
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
                className="text-center text-text-main text-[11px] sm:text-xs truncate max-w-full px-1"
              >
                {t(`common:conversations.themes.${item.key.replace("chat-", "")}`, item.label)}
              </Text>
              {isActive && (
                <div className="absolute top-1 right-1 bg-primary-500 text-white w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-fade-in">
                  <FontAwesomeIcon icon={faCheck} className="text-[8px]" />
                </div>
              )}
              {(item as any).isEvent && (
                <div className="absolute top-1 left-1 bg-secondary-500/15 text-secondary-600 dark:text-secondary-400 border border-secondary-500/25 text-[7px] sm:text-[8px] font-bold px-1 py-0.2 rounded scale-90 origin-top-left uppercase tracking-wider">
                  Sự kiện
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const ChatThemeDialogContent: React.FC<{
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
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full select-none flex-1 min-h-0 md:h-[350px]">
      {/* Cột Trái / Top: Xem trước */}
      <div className="flex flex-col gap-1.5 shrink-0 md:w-[320px] md:max-w-[340px] md:h-full">
        <div className="flex items-center justify-between pl-1 shrink-0">
          <Text sz="sm" weight="bold" className="text-text-second">
            Xem trước
          </Text>
          <div className="flex items-center gap-1.5">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-fourth hover:bg-bg-fifth text-text-main text-xs font-medium transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              title="Tải ảnh nền"
            >
              <FontAwesomeIcon icon={faCloudArrowUp} className="text-xs text-primary-500" />
              <span>Ảnh nền</span>
            </button>
            {backgroundUrl && (
              <button
                type="button"
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium transition-colors cursor-pointer animate-fade-in"
                onClick={handleRemoveBackground}
                title="Xóa ảnh nền"
              >
                <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                <span>Xóa</span>
              </button>
            )}
          </div>
        </div>

        <div
          data-chat-theme={selectedTheme === "default" ? undefined : selectedTheme}
          className="relative flex flex-col bg-bg-main rounded-xl border border-border-main/60 shadow-inner overflow-hidden h-[215px] md:h-[318px] transition-colors duration-200"
        >
          <div
            data-chat-scrollable="true"
            style={
              backgroundUrl
                ? ({ "--chat-custom-bg": `url(${backgroundUrl})` } as React.CSSProperties)
                : undefined
            }
            className="flex-1 py-2 overflow-hidden flex flex-col justify-center px-2.5 pointer-events-none select-none gap-2"
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
          <div className="pointer-events-none px-2 py-1.5 border-t border-border-main/20 bg-bg-main/90 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-fourth/60 rounded-full border border-border-main/30">
              <FontAwesomeIcon icon={faImage} className="text-primary-500 text-xs shrink-0" />
              <span className="text-xs text-text-third flex-1 truncate">Tin nhắn của bạn...</span>
              <FontAwesomeIcon icon={faPaperPlane} className="text-primary-500 text-xs shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Cột Phải / Bottom: Chọn chủ đề */}
      <div className="flex flex-col gap-1.5 flex-1 min-h-0 md:h-full overflow-hidden">
        <Text sz="sm" weight="bold" className="text-text-second pl-1 shrink-0">
          Chọn chủ đề
        </Text>
        <ChatThemePicker
          selectedTheme={selectedTheme}
          onSelectTheme={handleSelectTheme}
          className="flex-1 min-h-0 h-full"
        />
      </div>
    </div>
  );
};

const RecentMediaThumbnail: React.FC<{
  item: MessageMediaDto;
  isLastWithMore?: boolean;
  moreCount?: number;
  onOpenViewer: () => void;
  onOpenGallery: () => void;
}> = ({ item, isLastWithMore, moreCount, onOpenViewer, onOpenGallery }) => {
  const isVideo = item.type === MediaType.Video;
  const displayUrl = isVideo ? item.url.replace(/\.[^/.]+$/, ".jpg") : item.url;
  const { blobUrl } = useMediaBlob(displayUrl);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      onClick={isLastWithMore ? onOpenGallery : onOpenViewer}
      className="group relative aspect-square rounded-xl overflow-hidden bg-bg-fourth/40 border border-border-main/30 cursor-pointer shadow-xs select-none"
    >
      {hasError ? (
        <div className="w-full h-full flex items-center justify-center bg-bg-third text-text-fourth">
          <FontAwesomeIcon icon={isVideo ? faPlay : faImage} className="text-sm opacity-50" />
        </div>
      ) : (
        <img
          src={blobUrl || displayUrl}
          alt="Recent media"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
      )}

      {/* Video badge if not overlay */}
      {isVideo && !isLastWithMore && (
        <div className="absolute bottom-1 left-1 z-10 flex items-center justify-center w-4 h-4 rounded-full bg-black/60 text-white text-[8px] pl-[1px]">
          <FontAwesomeIcon icon={faPlay} />
        </div>
      )}

      {/* Last item overlay: +N */}
      {isLastWithMore ? (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-white font-bold text-sm sm:text-base group-hover:bg-black/70 transition-colors">
          +{moreCount}
        </div>
      ) : (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
      )}
    </div>
  );
};

const RecentMediaSection: React.FC<{
  conversationId: string;
  onOpenGallery: () => void;
}> = ({ conversationId, onOpenGallery }) => {
  const { t } = useTranslation();
  const { onOpen: openMediaViewer } = useMediaViewer();
  const mediaFilter = useMemo(() => [MediaType.Image, MediaType.Video, MediaType.Gif], []);
  const { mediaList, isLoading } = useConversationMedia(conversationId, {
    types: mediaFilter,
    limit: 20,
  });

  if (isLoading) {
    return (
      <div className="px-4 py-3 border-t border-bg-fourth/60">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="w-32 h-4 rounded" />
          <Skeleton className="w-16 h-3 rounded" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (mediaList.length === 0) return null;

  const displayItems = mediaList.slice(0, 4);
  const totalCount = mediaList.length;
  const hasMore = totalCount > 4;
  const remainingCount = totalCount - 3;

  return (
    <div className="px-4 py-3 border-t border-bg-fourth/60 bg-bg-main/50">
      <div className="flex items-center justify-between mb-2">
        <Text sz="sm" weight="bold" className="text-text-main">
          {t("common:conversations.settings.recentMedia", "Phương tiện gần đây")}
        </Text>
        <button
          type="button"
          onClick={onOpenGallery}
          className="text-xs text-primary-500 hover:text-primary-600 font-medium hover:underline flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>{t("common:conversations.settings.seeAll", "Xem tất cả")}</span>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {displayItems.map((item, index) => {
          const isLast = index === 3;
          const isLastWithMore = isLast && hasMore;

          return (
            <RecentMediaThumbnail
              key={item.id || item.url || index}
              item={item}
              isLastWithMore={isLastWithMore}
              moreCount={remainingCount}
              onOpenViewer={() => {
                openMediaViewer({
                  id: item.id || item.url,
                  url: item.url,
                  type: item.type,
                  conversationId,
                });
              }}
              onOpenGallery={onOpenGallery}
            />
          );
        })}
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
  const conv = storeConv ?? conversationData;

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
  const [viewMode, setViewMode] = useState<"main" | "members" | "theme" | "media">("main");
  const mobileSelectedThemeRef = useRef<string>(conv?.theme || "default");
  const mobileSelectedBackgroundUrlRef = useRef<string | null>(conv?.backgroundUrl || null);
  const [newName, setNewName] = useState("");
  const { fetch: updateName, isFetching: isRenamingLoading } = useUpdateConversationName(
    conversationId!,
  );
  const { fetch: updateTheme } = useUpdateConversationTheme(conversationId!);
  const { fetch: updateBackground } = useUpdateConversationBackground(conversationId!);
  const { fetch: togglePin, isFetching: isTogglingPin } = useTogglePinConversation(conversationId!);

  const isPinned = Boolean(conv?.isPinned || conv?.pinnedAt);

  const handleTogglePin = async () => {
    if (!conversationId || isTogglingPin) return;
    await togglePin();
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
        className: "w-[calc(100vw-2rem)] md:w-[740px] max-w-3xl max-h-[90vh] flex flex-col overflow-hidden",
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

  const openMediaGalleryFlow = () => {
    if (isMobile) {
      setViewMode("media");
    } else {
      openDialog({
        title: t("common:conversations.settings.mediaAndFiles", "File phương tiện & file"),
        className:
          "w-[calc(100vw-2rem)] sm:w-[560px] md:w-[680px] max-w-2xl h-[560px] max-h-[85vh] !px-4 !py-4 sm:!px-6 sm:!py-5 flex flex-col overflow-hidden",
        content: (
          <div className="flex-1 overflow-hidden h-full min-h-0 flex flex-col pt-1">
            <ConversationMediaGallery conversationId={conversationId!} />
          </div>
        ),
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
    }
  };

  const openMembersFlow = () => {
    setViewMode("members");
  };

  const handleBackSetting = () => {
    if (viewMode !== "main") {
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
      {isMobile ? (
        <Transition
          key={conversationId}
          show={true}
          animation={AnimationLib.SlideRightToLeftFull}
          className="w-full"
        >
          <ChatPanel
            conversationId={conversationId!}
            className="w-full h-[calc(100dvh-var(--header-height))]"
            onTurnback={() => navigate("/fatalk")}
            headerLeft={
              <div className="flex items-center gap-1">
                <MiniButton sz="sm" onClick={handleTurnBack} className="block lg:hidden">
                  <FontAwesomeIcon icon={faArrowLeft} className="text-primary-400" />
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
                <FontAwesomeIcon icon={faEllipsis} className="text-primary-400" />
              </MiniButton>
            }
          />
        </Transition>
      ) : (
        <ChatPanel
          conversationId={conversationId!}
          className="w-full h-[calc(100dvh-var(--header-height))]"
          onTurnback={() => navigate("/fatalk")}
          headerLeft={
            <div className="flex items-center gap-1">
              <MiniButton sz="sm" onClick={handleTurnBack} className="block lg:hidden">
                <FontAwesomeIcon icon={faArrowLeft} className="text-primary-400" />
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
              <FontAwesomeIcon icon={faEllipsis} className="text-primary-400" />
            </MiniButton>
          }
        />
      )}
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
              <FontAwesomeIcon icon={faArrowLeft} className="text-primary-400" />
            </MiniButton>
            <Text weight="bold" sz="md">
              {viewMode === "members"
                ? t("common:conversations.settings.viewMembers")
                : viewMode === "theme"
                  ? t("common:conversations.settings.changeTheme", "Chủ đề đoạn chat")
                  : viewMode === "media"
                    ? t("common:conversations.settings.mediaAndFiles", "File phương tiện & file")
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
                          <FontAwesomeIcon icon={faCamera} className="text-xs" />
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
                      <div className="flex justify-center w-full gap-4 sm:gap-6 mt-6 px-2">
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-[72px]">
                          <MiniButton
                            sz="md"
                            className="bg-bg-third hover:bg-bg-fourth rounded-full w-12 h-12"
                            onClick={triggerFileInput}
                          >
                            <FontAwesomeIcon icon={faImage} />
                          </MiniButton>
                          <Text sz="xs" weight="medium" className="text-center">
                            {t("common:conversations.settings.changeAvatar")}
                          </Text>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-[72px]">
                          <MiniButton
                            sz="md"
                            className="bg-bg-third hover:bg-bg-fourth rounded-full w-12 h-12"
                            onClick={openRenameFlow}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </MiniButton>
                          <Text sz="xs" weight="medium" className="text-center">
                            {t("common:conversations.settings.changeName")}
                          </Text>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-[72px]">
                          <MiniButton
                            sz="md"
                            className="bg-bg-third hover:bg-bg-fourth rounded-full w-12 h-12"
                            onClick={openThemePickerFlow}
                          >
                            <FontAwesomeIcon icon={faPalette} />
                          </MiniButton>
                          <Text sz="xs" weight="medium" className="text-center">
                            {t("common:conversations.settings.changeTheme", "Chủ đề")}
                          </Text>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-[72px]">
                          <MiniButton
                            sz="md"
                            className={clsx(
                              "rounded-full w-12 h-12 transition-colors",
                              isPinned
                                ? "bg-primary-500 text-white hover:bg-primary-600 shadow-sm"
                                : "bg-bg-third hover:bg-bg-fourth",
                            )}
                            onClick={handleTogglePin}
                            disabled={isTogglingPin}
                          >
                            <FontAwesomeIcon
                              icon={faThumbtack}
                              className={clsx(isPinned && "rotate-45")}
                            />
                          </MiniButton>
                          <Text sz="xs" weight="medium" className="text-center">
                            {isPinned
                              ? t("common:conversations.settings.unpin", "Bỏ ghim")
                              : t("common:conversations.settings.pin", "Ghim")}
                          </Text>
                        </div>
                      </div>
                    )}
                    {!conv.isGroup && conv.otherUserId && (
                      <div className="flex justify-center w-full gap-6 sm:gap-8 mt-6 px-2">
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-[72px]">
                          <MiniButton
                            sz="md"
                            className="bg-bg-third hover:bg-bg-fourth rounded-full w-12 h-12"
                            onClick={() => navigate(`/${conv.otherUserId}`)}
                          >
                            <FontAwesomeIcon icon={faUser} />
                          </MiniButton>
                          <Text sz="xs" weight="medium" className="text-center">
                            {t("common:conversations.settings.viewProfile")}
                          </Text>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-[72px]">
                          <MiniButton
                            sz="md"
                            className="bg-bg-third hover:bg-bg-fourth rounded-full w-12 h-12"
                            onClick={openThemePickerFlow}
                          >
                            <FontAwesomeIcon icon={faPalette} />
                          </MiniButton>
                          <Text sz="xs" weight="medium" className="text-center">
                            {t("common:conversations.settings.changeTheme", "Chủ đề")}
                          </Text>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-[72px]">
                          <MiniButton
                            sz="md"
                            className={clsx(
                              "rounded-full w-12 h-12 transition-colors",
                              isPinned
                                ? "bg-primary-500 text-white hover:bg-primary-600 shadow-sm"
                                : "bg-bg-third hover:bg-bg-fourth",
                            )}
                            onClick={handleTogglePin}
                            disabled={isTogglingPin}
                          >
                            <FontAwesomeIcon
                              icon={faThumbtack}
                              className={clsx(isPinned && "rotate-45")}
                            />
                          </MiniButton>
                          <Text sz="xs" weight="medium" className="text-center">
                            {isPinned
                              ? t("common:conversations.settings.unpin", "Bỏ ghim")
                              : t("common:conversations.settings.pin", "Ghim")}
                          </Text>
                        </div>
                      </div>
                    )}
                  </div>

                  <RecentMediaSection
                    conversationId={conversationId!}
                    onOpenGallery={openMediaGalleryFlow}
                  />

                  <div className="h-2 bg-bg-secondary w-full" />

                  <Menu className="p-2">
                    {conv.isGroup && (
                      <MenuItem
                        icon={<FontAwesomeIcon icon={faUserGroup} />}
                        title={t("common:conversations.settings.viewMembers")}
                        description={t("common:conversations.settings.viewMembersDescription")}
                        onClick={openMembersFlow}
                      />
                    )}
                    <MenuItem
                      icon={
                        <FontAwesomeIcon
                          icon={faThumbtack}
                          className={clsx(
                            "text-sm transition-transform",
                            isPinned ? "text-primary-500 rotate-45" : "text-text-secondary",
                          )}
                        />
                      }
                      title={
                        isPinned
                          ? t("common:conversations.settings.unpinConversation", "Bỏ ghim hội thoại")
                          : t("common:conversations.settings.pinConversation", "Ghim hội thoại")
                      }
                      description={
                        isPinned
                          ? t(
                              "common:conversations.settings.unpinConversationDescription",
                              "Bỏ ghim cuộc trò chuyện này khỏi đầu danh sách",
                            )
                          : t(
                              "common:conversations.settings.pinConversationDescription",
                              "Giữ cuộc trò chuyện này luôn ở trên cùng danh sách",
                            )
                      }
                      rightElement={
                        <div className="flex items-center gap-2 shrink-0">
                          <Text
                            sz="xs"
                            className={clsx(
                              "px-2 py-0.5 rounded-full border text-[11px] font-medium",
                              isPinned
                                ? "text-primary-500 bg-primary-500/10 border-primary-500/30"
                                : "text-text-third bg-bg-third border-border-main/50",
                            )}
                          >
                            {isPinned ? "Đã ghim" : "Chưa ghim"}
                          </Text>
                        </div>
                      }
                      onClick={handleTogglePin}
                    />
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
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className="text-[10px] text-text-fourth"
                          />
                        </div>
                      }
                      onClick={openThemePickerFlow}
                    />
                    <MenuItem
                      icon={<FontAwesomeIcon icon={faPhotoFilm} />}
                      title={t("common:conversations.settings.mediaAndFiles", "File phương tiện & file")}
                      description={t(
                        "common:conversations.settings.mediaAndFilesDescription",
                        "Xem ảnh, video, tập tin và âm thanh trong đoạn chat",
                      )}
                      rightElement={
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="text-[10px] text-text-fourth"
                        />
                      }
                      onClick={openMediaGalleryFlow}
                    />
                  </Menu>
                </div>
              ) : viewMode === "members" ? (
                <div className="flex-1 overflow-hidden">
                  <ParticipantList conversationId={conversationId!} />
                </div>
              ) : viewMode === "media" ? (
                <div className="flex-1 overflow-hidden p-3 sm:p-4 bg-bg-main flex flex-col">
                  <ConversationMediaGallery conversationId={conversationId!} />
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
