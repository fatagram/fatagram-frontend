import clsx from "clsx";
import { useState, useEffect } from "react";
import { FloatingChatSidebar } from "./floating-chat-sidebar";
import { ChatPanel } from "./chat-panel";
import { MiniButton } from "@/components/atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faMinus, faTimes } from "@fortawesome/free-solid-svg-icons";

interface FloatingChatItemProps {
  id: string;
  focusOnId: string | null;
  setFocusOn: (id: string | null) => void;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  toggleMinimize: (id: string) => void;
  closeChat: (id: string) => void;
}

export const FloatingChatItem: React.FC<FloatingChatItemProps> = ({
  id,
  focusOnId,
  setFocusOn,
  openMenuId,
  setOpenMenuId,
  toggleMinimize,
  closeChat,
}) => {
  const isMenuOpen = openMenuId === id;
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldAnimate(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onMouseDown={() => setFocusOn(id)}
      className="relative flex-shrink-0 flex transition-[width,max-width] duration-200 ease-out"
      style={{
        width: isMenuOpen ? "602px" : "350px",
        maxWidth: isMenuOpen ? "602px" : "350px",
        zIndex: isMenuOpen ? 50 : (focusOnId === id ? 40 : 10),
      }}
    >
      <FloatingChatSidebar conversationId={id} onClose={() => setOpenMenuId(null)} isOpen={isMenuOpen} />
      <div className={clsx("w-[350px]", shouldAnimate && "animate-chat-grow-in")}>
        <ChatPanel
          conversationId={id}
          className="h-[500px] w-[350px] rounded-t-xl border border-bg-fourth border-b-0 shadow-lg"
          headerRight={
            <div className="flex gap-2">
              <MiniButton sz="sm" onClick={() => setOpenMenuId(isMenuOpen ? null : id)}>
                <FontAwesomeIcon icon={faEllipsis} className="text-primary-400" />
              </MiniButton>
              <MiniButton sz="sm" onClick={() => toggleMinimize(id)}>
                <FontAwesomeIcon icon={faMinus} className="text-primary-400" />
              </MiniButton>
              <MiniButton sz="sm" onClick={() => closeChat(id)}>
                <FontAwesomeIcon icon={faTimes} className="text-primary-400" />
              </MiniButton>
            </div>
          }
        />
      </div>
    </div>
  );
};
