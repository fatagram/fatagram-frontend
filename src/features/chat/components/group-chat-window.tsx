import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useChatStore } from "../hooks/use-floating-chat";
import { ChatPanel } from "./chat-panel";
import { MiniButton, Text } from "@/components/atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faTimes, faEllipsis, faArrowUpRightFromSquare, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface GroupChatWindowProps extends ComponentProps {}

export const GroupChatWindow: React.FC<GroupChatWindowProps> = ({ className }) => {
  const activeIds = useChatStore((state) => state.activeIds);
  const toggleMinimize = useChatStore((state) => state.toggleMinimize);
  const closeChat = useChatStore((state) => state.closeChat);
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className={clsx("flex gap-3", className)}>
      {activeIds.map((id) => {
        const isMenuOpen = openMenuId === id;
        return (
          <div key={id} className="flex-shrink-0 overflow-hidden animate-chat-grow-in flex">
            {isMenuOpen && (
              <div className="w-[200px] bg-bg-second border-r border-bg-fourth flex flex-col shrink-0 rounded-t-xl">
                <div className="flex items-center gap-3 px-4 h-[60px] border-b border-bg-fourth">
                  <MiniButton sz="sm" onClick={() => setOpenMenuId(null)}>
                    <FontAwesomeIcon icon={faArrowLeft} className="text-primary-400" />
                  </MiniButton>
                  <Text weight="bold" sz="sm">
                    Options
                  </Text>
                </div>
                <div className="flex flex-col flex-1 p-4 gap-3">
                  <button
                    onClick={() => {
                      navigate(`/fatalk/${id}`);
                      setOpenMenuId(null);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-third transition-colors text-left"
                  >
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-primary-400" />
                    <Text sz="sm">Open in Fatalk</Text>
                  </button>
                </div>
              </div>
            )}
            <div className="w-[350px]">
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
      })}
    </div>
  );
};
