import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useChatStore } from "../hooks/use-floating-chat";
import { FloatingChatItem } from "./floating-chat-item";
import { useState } from "react";

interface GroupChatWindowProps extends ComponentProps {}

export const GroupChatWindow: React.FC<GroupChatWindowProps> = ({ className }) => {
  const activeIds = useChatStore((state) => state.activeIds);
  const toggleMinimize = useChatStore((state) => state.toggleMinimize);
  const closeChat = useChatStore((state) => state.closeChat);
  const focusOnId = useChatStore((state) => state.focusOnId);
  const setFocusOn = useChatStore((state) => state.setFocusOn);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className={clsx("flex gap-3", className)}>
      {activeIds.map((id) => (
        <FloatingChatItem
          key={id}
          id={id}
          focusOnId={focusOnId}
          setFocusOn={setFocusOn}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          toggleMinimize={toggleMinimize}
          closeChat={closeChat}
        />
      ))}
    </div>
  );
};
