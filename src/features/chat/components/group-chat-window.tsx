import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { ChatWindow } from "./chat-window";
import { useChatStore } from "../hooks/use-floating-chat";

interface GroupChatWindowProps extends ComponentProps {}

export const GroupChatWindow: React.FC<GroupChatWindowProps> = ({ className }) => {
  const activeIds = useChatStore((state) => state.activeIds);
  return (
    <div className={clsx("flex gap-3", className)}>
      {activeIds.map((id) => {
        return (
          <div key={id}>
            <ChatWindow className="rounded-b-none" conversationId={id} />
          </div>
        );
      })}
    </div>
  );
};
