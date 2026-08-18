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

export const ChatItem: React.FC<ChatItemProps> = ({ conversation, onClick }) => {
  const lastMessage = conversation.lastMessage;
  const location = useLocation();
  const currentConversationId = location.pathname.split("/").pop();

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

  const unreadCount = conversation.unreadMessageCount || 0;
  const isUnread = unreadCount > 0;
  const isPinned = Boolean(conversation.isPinned || conversation.pinnedAt);
  const isOtherUserRead =
    conversation.otherLastSeenMessageSeq &&
    conversation.lastMessage?.sequenceNumber &&
    conversation.otherLastSeenMessageSeq >= conversation.lastMessage.sequenceNumber;
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
    if (!isDropdownOpen && moreBtnRef.current) {
      const rect = moreBtnRef.current.getBoundingClientRect();
      setDropdownCoords({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
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
    if (isMobile) {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(50);
      }
      setIsBottomSheetOpen(true);
    }
  }, [isMobile]);

  const longPressHandlers = useLongPress(handleLongPress, 500);

  const renderMessagePreview = () => {
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

    switch (lastMessage.type) {
      case MessageType.Text:
        return `${senderName}: ${lastMessage.content}`;
      case MessageType.Media:
        if (lastMessage.media && lastMessage.media.some((m) => m.type === MediaType.Image)) {
          return `${senderName}: ${t("common:conversations.sentImageMessage", { count: lastMessage.media.length })}`;
        }
        return `${senderName}: ${t("common:conversations.sentMediaMessage")}`;
      default:
        return "";
    }
  };

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

  return (
    <div
      key={conversation.id}
      className={clsx(
        "group flex gap-3 p-3 pl-0 sm:pl-3 my-1 rounded-xl transition-all duration-300 ease-out",
        "cursor-pointer select-none",
        conversation.id === currentConversationId
          ? "bg-bg-third"
          : isUnread
            ? "bg-primary-500/[0.04] hover:bg-bg-third/60"
            : "hover:bg-bg-third/60",
      )}
      onClick={() => onClick()}
      onMouseDown={isMobile ? longPressHandlers.onMouseDown : undefined}
      onMouseMove={isMobile ? longPressHandlers.onMouseMove : undefined}
      onMouseUp={isMobile ? longPressHandlers.onMouseUp : undefined}
      onMouseLeave={isMobile ? longPressHandlers.onMouseLeave : undefined}
      onTouchStart={isMobile ? longPressHandlers.onTouchStart : undefined}
      onTouchMove={isMobile ? longPressHandlers.onTouchMove : undefined}
      onTouchEnd={isMobile ? longPressHandlers.onTouchEnd : undefined}
    >
      <div className="relative shrink-0">
        <Avatar
          src={conversation.avatarUrl ?? ""}
          alt="Conversation Avatar"
          sz="md"
          className="group-hover:scale-105 transition-transform duration-300 border border-bg-fourth/30"
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
            {renderConversationName(conversation)}
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
            {renderMessagePreview()}
          </Text>

          <div className="shrink-0 flex items-center justify-end min-w-[20px] gap-1">
            {Boolean(isUnread) === true ? (
              <div
                aria-hidden
                className={clsx(
                  "w-[18px] h-[18px] rounded-full bg-primary-500 flex items-center justify-center shadow-sm",
                )}
              >
                <span className="text-[10px] font-bold text-white leading-none">{unreadLabel}</span>
              </div>
            ) : !conversation.isGroup && isOtherUserRead && !isUnread ? (
              <Avatar
                sz="xs"
                src={conversation.avatarUrl || ""}
                alt="seen"
                className="opacity-80 border border-bg-fourth/50 shadow-sm"
              />
            ) : null}

            {/* Desktop '...' Button on hover */}
            <div className="hidden sm:block">
              <button
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

      {/* Desktop Portal Dropdown so it floats on top of all items and never gets clipped */}
      {!isMobile &&
        isDropdownOpen &&
        dropdownCoords &&
        typeof document !== "undefined" &&
        createPortal(
          <Dropdown
            ref={dropdownRef}
            items={dropdownItems}
            isShow={isDropdownOpen}
            showPolygon={false}
            style={{
              position: "fixed",
              top: `${dropdownCoords.top}px`,
              right: `${dropdownCoords.right}px`,
              zIndex: 99999,
            }}
            className="w-48 shadow-2xl border border-border-main/30 bg-bg-card animate-dropdown-slide"
          />,
          document.body,
        )}

      {/* Mobile Long Press Bottom Sheet */}
      {isMobile && (
        <BottomSheet
          open={isBottomSheetOpen}
          onOpenChange={setIsBottomSheetOpen}
          trigger={<span className="hidden" />}
          title={renderConversationName(conversation)}
        >
          <div
            className="flex flex-col w-full pb-6 px-3 gap-1"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleTogglePin}
              disabled={isTogglingPin}
              className="flex items-center gap-3.5 w-full p-3.5 rounded-xl hover:bg-bg-hover active:bg-bg-fourth transition-colors text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
                <Pin className={clsx("w-5 h-5", isPinned && "rotate-45 fill-primary-500/30")} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-text-primary text-base">
                  {isPinned
                    ? t("common:conversations.settings.unpinConversation")
                    : t("common:conversations.settings.pinConversation")}
                </span>
                <span className="text-xs text-text-secondary">
                  {isPinned
                    ? t("common:conversations.settings.unpinConversationDescription")
                    : t("common:conversations.settings.pinConversationDescription")}
                </span>
              </div>
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
};

