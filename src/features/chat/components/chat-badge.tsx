import { Badge } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import { ChatMenu } from "./chat-menu";
// import { useNavigate } from "react-router-dom";
import { RefObject, useRef, useState } from "react";
import clsx from "clsx";
import useClickOutside from "@/hooks/use-click-outside";
import { useGetUnreadMessageCount } from "@/features/hooks/use-conversation";

interface ChatBadgeProps extends ComponentProps {}

export const ChatBadge: React.FC<ChatBadgeProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const navigate = useNavigate();
  const { data: count = 0 } = useGetUnreadMessageCount();

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
      <Badge count={count} onClick={() => setIsOpen(!isOpen)} ref={btnRef}>
        <i className="fa-solid fa-comment" />
      </Badge>
      {isOpen && (
        <ChatMenu
          className={clsx(
            "!absolute max-h-[600px] z-10 min-w-[350px] min-h-[100px]",
            "sm:top-[120%] sm:right-0 sm:w-auto sm:h-auto sm:p-2",
            "top-[108%] -right-[70px] w-screen h-screen p-6",
          )}
          ref={menuRef}
          onConversationClick={handleConversationClick}
        />
      )}
    </div>
  );
};
