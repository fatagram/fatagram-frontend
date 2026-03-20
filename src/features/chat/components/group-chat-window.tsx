import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { ChatWindow } from "./chat-window";
import { useChatStore } from "../../hooks/use-chat-store";

interface GroupChatWindowProps extends ComponentProps {}

export const GroupChatWindow: React.FC<GroupChatWindowProps> = ({ className }) => {
  const { activeIds } = useChatStore();
  return (
    <div className={clsx("flex gap-3", className)}>
      {activeIds.map((id) => {
        console.log("Rendering ChatWindow for conversationId:", id);
        return (
          <div key={id}>
            <ChatWindow className="rounded-b-none" conversationId={id} />
          </div>
        );
      })}
    </div>
  );
};
