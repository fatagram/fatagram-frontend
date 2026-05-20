import { ComponentProps } from "@/components/common/component-type";
import { MiniButton, Text } from "@/components/atoms";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChatList } from "./chat-list";
import { useState } from "react";
import { CreateGroupChat } from "./create-group-chat/create-group-chat";
import { useConversationStore } from "../services/conversation-manager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

interface ChatMenuProps extends ComponentProps {
  ref?: React.RefObject<HTMLDivElement | null>;
  onConversationClick?: (conversationId?: string) => void;
}

export const ChatMenu: React.FC<ChatMenuProps> = ({ className, onConversationClick, ref }) => {
  const [tab, setTab] = useState<"list" | "create">("list");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSelectConversation = (conversationId: string) => {
    onConversationClick?.(conversationId);
  };

  const handleCreateConversation = async () => {
    setTab("create");
  };

  return (
    <div
      className={clsx(
        "relative bg-bg-second shadow-xl rounded-xl flex flex-col gap-2 select-none",
        "animate-dropdown-slide origin-top scrollbar-hide !w-[380px]",
        "max-h-[650px]",
        className,
      )}
      ref={ref}
    >
      {tab === "list" && (
        <>
          <div className="absolute top-0 right-0 flex mt-4 mr-4 gap-2">
            <MiniButton sz="sm" className="bg-bg-fifth" onClick={handleCreateConversation}>
              <FontAwesomeIcon icon={faPenToSquare}  />
            </MiniButton>
          </div>
          <div className="flex items-center justify-between px-5 pt-4 pb-1">
            <Text sz="lg" weight="bold">
              {t("common:conversations.title")}
            </Text>
          </div>
        </>
      )}
      {tab === "list" && (
        <ChatList
          className="overflow-y-auto pt-0 h-full"
          onConversationClick={handleSelectConversation}
        />
      )}
      {tab === "create" && (
        <CreateGroupChat
          className="overflow-hidden h-full max-h-[90%] w-full pt-4"
          onTurnBack={() => setTab("list")}
          onCreateSuccess={() => setTab("list")}
        />
      )}

      {tab === "list" && (
        <div className="flex justify-center border-t border-text-main/10 pt-2 pb-2 px-3 mt-auto">
          <button
            className="p-2 rounded-lg hover:bg-bg-fourth transition-colors cursor-pointer flex items-center gap-2"
            onClick={() => {
              const firstId = useConversationStore.getState().conversations?.[0]?.id;
              navigate(`/fatalk/${firstId}`);
            }}
            title={t("common:conversations.openFatalk")}
          >
            <Text sz="sm" color="secondary">
              {t("common:conversations.openFatalk")}
            </Text>
            <Text sz="sm" color="secondary">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare}  />
            </Text>
          </button>
        </div>
      )}
    </div>
  );
};
