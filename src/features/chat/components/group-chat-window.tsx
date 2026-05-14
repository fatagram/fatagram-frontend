import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useChatStore } from "../hooks/use-floating-chat";
import { ChatPanel } from "./chat-panel";
import { MiniButton } from "@/components/atoms";

interface GroupChatWindowProps extends ComponentProps {}

export const GroupChatWindow: React.FC<GroupChatWindowProps> = ({ className }) => {
  const activeIds = useChatStore((state) => state.activeIds);
  const toggleMinimize = useChatStore((state) => state.toggleMinimize);
  const closeChat = useChatStore((state) => state.closeChat);

  return (
    <div className={clsx("flex gap-3", className)}>
      {activeIds.map((id) => {
        return (
          <div key={id}>
            <ChatPanel
              conversationId={id}
              className="h-[500px] w-[380px] rounded-xl"
              headerRight={
                <div className="flex gap-2">
                  <MiniButton sz="sm" onClick={() => toggleMinimize(id)}>
                    <i className="fa-solid fa-minus text-primary-400" />
                  </MiniButton>
                  <MiniButton sz="sm" onClick={() => closeChat(id)}>
                    <i className="fa-solid fa-times text-primary-400" />
                  </MiniButton>
                </div>
              }
            />
          </div>
        );
      })}
    </div>
  );
};
