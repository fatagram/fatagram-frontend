import { Text, Avatar } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useRenderConversationContent } from "../hooks/use-render-conversation-content";
import { MediaType, MessageType } from "@/types/entities/message.type";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { isSystemMessage } from "../helpers/conversation-helpers";
import { useFormatTime } from "@/utils/time";
import { useAuth } from "@/contexts";
import { Conversation } from "@/types/entities/conversation.type";
import { Pin, MoreVertical } from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useMobile } from "@/hooks/use-mobile";
import { useLongPress } from "@/hooks/use-long-press";
import { useTogglePinConversation } from "../hooks/use-conversation";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import Dropdown, { DropdownItem } from "@/components/atoms/dropdown/dropdown";
import useClickOutside from "@/hooks/use-click-outside";

interface ChatItemProps extends ComponentProps {
  conversation: Conversation;
  isActive?: boolean;
  onClick: () => void;
}

interface TrailingStatusProps {
  isUnread: boolean;
  unreadLabel: string;
  isGroup?: boolean;
  isOtherUserRead: boolean;
  avatarUrl?: string | null;
}

const TrailingStatus: React.FC<TrailingStatusProps> = ({
  isUnread,
  unreadLabel,
  isGroup,
  isOtherUserRead,
  avatarUrl,
}) => {
  if (isUnread) {
    return (
      <div
        aria-hidden
        className="w-[18px] h-[18px] rounded-full bg-primary-500 flex items-center justify-center shadow-sm"
      >
        <span className="text-[10px] font-bold text-white leading-none">{unreadLabel}</span>
      </div>
    );
  }

  if (!isGroup && isOtherUserRead) {
    return (
      <Avatar
        sz="xs"
        src={avatarUrl || ""}
        alt="seen"
        className="opacity-80 border border-bg-fourth/50 shadow-sm"
      />
    );
  }

  return null;
};

const getItemBackgroundClass = (isCurrent: boolean, isUnread: boolean) => {
  if (isCurrent) {
    return "!bg-bg-fourth";
  }
  if (isUnread) {
    return "bg-primary-500/[0.04] hover:bg-bg-third/60";
  }
  return "hover:bg-bg-third/60";
};

const getMessagePreview = (
  conversation: Conversation,
  unreadCount: number,
  unreadLabel: string,
  userId: string | undefined,
  t: (key: string, options?: Record<string, unknown>) => string,
  renderSystemMessage: (message: NonNullable<Conversation["lastMessage"]>) => React.ReactNode,
) => {
  const lastMessage = conversation.lastMessage;

  if (unreadCount > 1) {
    return `Bạn có ${unreadLabel} tin nhắn chưa đọc`;
  }

  if (!lastMessage) {
    return t("common:conversations.noMessagesYet");
  }

  if (isSystemMessage(lastMessage.type || MessageType.System)) {
    return renderSystemMessage(lastMessage);
  }

  const senderName =
    userId === lastMessage.senderId ? t("common:conversations.you") : lastMessage.senderFullName;

  if (lastMessage.type === MessageType.Text) {
    return `${senderName}: ${lastMessage.content}`;
  }

  if (lastMessage.type === MessageType.Media) {
    const hasImage = lastMessage.media?.some((m) => m.type === MediaType.Image);
    if (hasImage) {
      return `${senderName}: ${t("common:conversations.sentImageMessage", { count: lastMessage.media?.length })}`;
    }
    return `${senderName}: ${t("common:conversations.sentMediaMessage")}`;
  }

  return "";
};

interface ChatItemMobileMenuProps {
  isMobile: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  isPinned: boolean;
  isTogglingPin: boolean;
  onTogglePin: (e?: React.MouseEvent) => void;
}

const ChatItemMobileMenu: React.FC<ChatItemMobileMenuProps> = ({
  isMobile,
  isOpen,
  onOpenChange,
  title,
  isPinned,
  isTogglingPin,
  onTogglePin,
}) => {
  const { t } = useTranslation();

  if (!isMobile) {
    return null;
  }

  const pinLabel = isPinned
    ? t("common:conversations.settings.unpinConversation")
    : t("common:conversations.settings.pinConversation");

  const pinDescription = isPinned
    ? t("common:conversations.settings.unpinConversationDescription")
    : t("common:conversations.settings.pinConversationDescription");

  return (
    <BottomSheet
      open={isOpen}
      onOpenChange={onOpenChange}
      trigger={<span className="hidden" />}
      title={title}
    >
      <div className="flex flex-col w-full pb-6 px-3 gap-1">
        <button
          type="button"
          onClick={onTogglePin}
          disabled={isTogglingPin}
          className="flex items-center gap-3.5 w-full p-3.5 rounded-xl hover:bg-bg-hover active:bg-bg-fourth transition-colors text-left cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
            <Pin className={clsx("w-5 h-5", isPinned && "rotate-45 fill-primary-500/30")} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-text-primary text-base">
              {pinLabel}
            </span>
            <span className="text-xs text-text-secondary">
              {pinDescription}
            </span>
          </div>
        </button>
      </div>
    </BottomSheet>
  );
};

interface ChatItemDesktopMenuProps {
  isMobile: boolean;
  isOpen: boolean;
  coords: { top: number; right: number } | null;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  items: DropdownItem[];
}

const ChatItemDesktopMenu: React.FC<ChatItemDesktopMenuProps> = ({
  isMobile,
  isOpen,
  coords,
  dropdownRef,
  items,
}) => {
  if (isMobile || !isOpen || !coords || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <Dropdown
      ref={dropdownRef}
      items={items}
      isShow={isOpen}
      showPolygon={false}
      style={{
        position: "fixed",
        top: `${coords.top}px`,
        right: `${coords.right}px`,
        zIndex: 99999,
      }}
      className="w-48 shadow-2xl border border-border-main/30 bg-bg-card animate-dropdown-slide"
    />,
    document.body,
  );
};

export const ChatItem: React.FC<ChatItemProps> = ({ conversation, onClick, isActive }) => {
  const location = useLocation();
  const match = location.pathname.match(/\/fatalk\/([^/?#]+)/);
  const currentConversationId = match ? match[1] : location.pathname.split("/").pop();

  const { t } = useTranslation();
  const { renderConversationName, renderSystemMessage } = useRenderConversationContent();
  const { formatTime } = useFormatTime();
  const isMobile = useMobile();
  const { fetch: togglePin, isFetching: isTogglingPin } = useTogglePinConversation(
    conversation.id,
  );

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState<{ top: number; right: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);

  const lastSeq = conversation.lastMessage?.sequenceNumber ?? conversation.lastMessageNumber ?? 0;
  const mySeenSeq = conversation.myLastSeenMessageSeq ?? 0;
  const calculatedUnread = Math.max(0, lastSeq - mySeenSeq);
  const unreadCount =
    conversation.unreadMessageCount !== undefined && conversation.unreadMessageCount > 0
      ? conversation.unreadMessageCount
      : calculatedUnread;
  const isUnread = unreadCount > 0;
  const isPinned = Boolean(conversation.isPinned || conversation.pinnedAt);
  const otherSeq = conversation.otherLastSeenMessageSeq;
  const isOtherUserRead = Boolean(otherSeq && lastSeq && otherSeq >= lastSeq);
  const unreadLabel = unreadCount > 99 ? "99+" : String(unreadCount);

  const { userId } = useAuth();

  // Close desktop dropdown on click outside
  useClickOutside(
    dropdownRef as React.RefObject<HTMLElement>,
    moreBtnRef as React.RefObject<HTMLElement>,
    () => setIsDropdownOpen(false),
    isDropdownOpen,
  );

  // Position portal dropdown when opened
  const handleOpenDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDropdownOpen || !moreBtnRef.current) {
      setIsDropdownOpen(false);
      return;
    }

    const rect = moreBtnRef.current.getBoundingClientRect();
    setDropdownCoords({
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
    });
    setIsDropdownOpen(true);
  };

  // Close dropdown on scroll or resize
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleScrollOrResize = () => setIsDropdownOpen(false);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isDropdownOpen]);

  const handleTogglePin = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      e?.preventDefault();
      setIsDropdownOpen(false);
      setIsBottomSheetOpen(false);
      togglePin(conversation.id);
    },
    [conversation.id, togglePin],
  );

  // Long press for mobile to open system BottomSheet
  const handleLongPress = useCallback(() => {
    if (!isMobile) return;
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
    setIsBottomSheetOpen(true);
  }, [isMobile]);

  const longPressHandlers = useLongPress(handleLongPress, 500);
  const pressHandlers = isMobile ? longPressHandlers : {};

  const dropdownItems: DropdownItem[] = [
    {
      id: "pin",
      content: (
        <div className="flex items-center gap-2.5 py-0.5 text-text-primary">
          <Pin className={clsx("w-4 h-4 text-primary-500", isPinned && "rotate-45 fill-primary-500/20")} />
          <span className="text-sm font-medium">
            {isPinned
              ? t("common:conversations.settings.unpinConversation")
              : t("common:conversations.settings.pinConversation")}
          </span>
        </div>
      ),
      onClick: handleTogglePin,
    },
  ];

  const isCurrent = Boolean(currentConversationId) && conversation.id === currentConversationId;
  const conversationTitle = renderConversationName(conversation);

  return (
    <>
      <button
        type="button"
        key={conversation.id}
        className={clsx(
          "group flex gap-3 p-3 my-0.5 rounded-xl transition-colors duration-150",
          "cursor-pointer select-none w-full text-left font-inherit",
          getItemBackgroundClass(isCurrent, isUnread),
        )}
        onClick={() => onClick()}
        {...pressHandlers}
      >
        <div className="relative shrink-0">
          <Avatar
            src={conversation.avatarUrl ?? ""}
            alt="Conversation Avatar"
            sz="md"
            className="group-hover:scale-105 transition-transform duration-200 border border-bg-fourth/30"
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0 justify-between py-[2px]">
          <div className="flex justify-between items-baseline gap-2">
            <Text
              sz="sm"
              weight={isUnread ? "bold" : "medium"}
              className={clsx(
                "line-clamp-1 truncate max-w-full font-semibold",
                isUnread ? "text-text-main" : "text-text-main/90",
              )}
            >
              {conversationTitle}
            </Text>
            <div className="flex items-center gap-1.5 shrink-0">
              {isPinned && (
                <Pin className="w-3.5 h-3.5 text-primary-500 fill-primary-500/20 rotate-45" />
              )}
              <span
                className={clsx(
                  "text-xs shrink-0 font-normal",
                  isUnread ? "text-primary-500 font-semibold" : "text-text-secondary",
                )}
              >
                {formatTime(conversation.lastMessage?.createdAt ?? "")}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center gap-2 mt-1">
            <Text
              sz="xs"
              className={clsx(
                "truncate max-w-full leading-normal",
                isUnread ? "text-text-main font-semibold" : "text-text-third",
              )}
            >
              {getMessagePreview(
                conversation,
                unreadCount,
                unreadLabel,
                userId,
                t,
                renderSystemMessage,
              )}
            </Text>

            <div className="shrink-0 flex items-center justify-end min-w-[20px] gap-1">
              <TrailingStatus
                isUnread={isUnread}
                unreadLabel={unreadLabel}
                isGroup={conversation.isGroup}
                isOtherUserRead={Boolean(isOtherUserRead)}
                avatarUrl={conversation.avatarUrl}
              />

              {/* Desktop '...' Button on hover */}
              <div className="hidden sm:block">
                <button
                  type="button"
                  ref={moreBtnRef}
                  aria-label="More options"
                  onClick={handleOpenDropdown}
                  className={clsx(
                    "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200",
                    "hover:bg-bg-fourth active:scale-95 text-text-secondary hover:text-text-main",
                    isDropdownOpen ? "opacity-100 bg-bg-fourth" : "opacity-0 group-hover:opacity-100",
                  )}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Desktop Portal Dropdown */}
      <ChatItemDesktopMenu
        isMobile={isMobile}
        isOpen={isDropdownOpen}
        coords={dropdownCoords}
        dropdownRef={dropdownRef}
        items={dropdownItems}
      />

      {/* Mobile Long Press Bottom Sheet */}
      <ChatItemMobileMenu
        isMobile={isMobile}
        isOpen={isBottomSheetOpen}
        onOpenChange={setIsBottomSheetOpen}
        title={conversationTitle}
        isPinned={isPinned}
        isTogglingPin={isTogglingPin}
        onTogglePin={handleTogglePin}
      />
    </>
  );
};

