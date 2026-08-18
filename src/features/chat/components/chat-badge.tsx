import { Badge } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import { ChatMenu } from "./chat-menu";
// import { useNavigate } from "react-router-dom";
import { RefObject, useRef, useState } from "react";
import clsx from "clsx";
import useClickOutside from "@/hooks/use-click-outside";
import { useConversationStore } from "../services/conversation-manager";
import Transition, { AnimationLib } from "@/components/ui/utils/transition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

interface ChatBadgeProps extends ComponentProps {}

export const ChatBadge: React.FC<ChatBadgeProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const totalUnreadCount = useConversationStore((state) => state.totalUnreadCount);

  // Refs for the menu and button
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close the menu
  useClickOutside(menuRef as RefObject<HTMLDivElement>, btnRef as RefObject<HTMLDivElement>, () => {
    if (isOpen) setIsOpen(false);
  });

  const handleConversationClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Badge count={totalUnreadCount} onClick={() => setIsOpen(!isOpen)} ref={btnRef}>
        <FontAwesomeIcon icon={faComment}  />
      </Badge>
      <Transition
        show={isOpen}
        animation={AnimationLib.DropdownSlide}
        duration={150}
        className={clsx(
          "!absolute z-50 min-w-[340px] sm:w-[380px] max-h-[min(600px,calc(100dvh-var(--header-height,56px)-20px))] flex flex-col",
          "top-[120%] right-0",
        )}
      >
        <ChatMenu
          className="w-full flex-1 shadow-2xl max-h-[min(580px,calc(100dvh-var(--header-height,56px)-28px))]"
          ref={menuRef}
          onConversationClick={handleConversationClick}
        />
      </Transition>
    </div>
  );
};
