import { ComponentProps } from "@/components/common/component-type";
import { GroupChatWindow } from "./components/group-chat-window";
import { BubbleChatList } from "./components/bubble-chat";
import clsx from "clsx";
import { useLocation } from "react-router-dom";

interface ChatLayerProps extends ComponentProps {
  // Define any props you want to pass to the ChatLayer component
}

export const ChatLayer: React.FC<ChatLayerProps> = ({ className }) => {
  const isFatalkPage = useLocation().pathname.startsWith("/fatalk");
  if (isFatalkPage) return null;

  return (
    <div className={clsx("flex items-end gap-4", className)}>
      <GroupChatWindow />
      <BubbleChatList className="mb-5" />
    </div>
  );
};
