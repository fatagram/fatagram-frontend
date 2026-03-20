import { ComponentProps } from "@/components/common/component-type";
import { GroupChatWindow } from "./components/group-chat-window";
import { BubbleChatList } from "./components/bubble-chat";
import clsx from "clsx";

interface ChatLayerProps extends ComponentProps {
  // Define any props you want to pass to the ChatLayer component
}

export const ChatLayer: React.FC<ChatLayerProps> = ({ className }) => {
  return (
    <div className={clsx("flex items-end gap-4", className)}>
      <GroupChatWindow />
      <BubbleChatList className="mb-5" />
    </div>
  );
};
