import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useChatStore } from "../hooks/use-floating-chat";
import { ChatPanel } from "./chat-panel";
import { MiniButton } from "@/components/atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faTimes } from "@fortawesome/free-solid-svg-icons";

interface GroupChatWindowProps extends ComponentProps {}

export const GroupChatWindow: React.FC<GroupChatWindowProps> = ({ className }) => {
  const activeIds = useChatStore((state) => state.activeIds);
  const toggleMinimize = useChatStore((state) => state.toggleMinimize);
  const closeChat = useChatStore((state) => state.closeChat);

  return (
    <div className={clsx("flex gap-3", className)}>
      {activeIds.map((id) => {
        return (
          <div key={id} className="w-[350px] flex-shrink-0">
            <ChatPanel
              conversationId={id}
              className="h-[500px] w-[350px] rounded-t-xl border border-bg-fourth border-b-0 shadow-lg"
              headerRight={
                <div className="flex gap-2">
                  <MiniButton sz="sm" onClick={() => toggleMinimize(id)}>
                    <FontAwesomeIcon icon={faMinus} className="text-primary-400"  />
                  </MiniButton>
                  <MiniButton sz="sm" onClick={() => closeChat(id)}>
                    <FontAwesomeIcon icon={faTimes} className="text-primary-400"  />
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
