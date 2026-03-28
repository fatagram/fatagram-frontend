import { ComponentProps } from "@/components/common/component-type";
import { useConversations } from "@/features/hooks/use-conversation";
import { MiniButton, Text } from "@/components/atoms";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChatList } from "./chat-list";
import { useChatStore } from "@/features/hooks/use-chat-store";
import { useState } from "react";
import { CreateGroupChat } from "./create-group-chat/create-group-chat";

interface ChatMenuProps extends ComponentProps {
  ref?: React.RefObject<HTMLDivElement | null>;
  onConversationClick?: (conversationId?: string) => void;
}

export const ChatMenu: React.FC<ChatMenuProps> = ({ className, onConversationClick, ref }) => {
  const [tab, setTab] = useState<"list" | "create">("list");
  const { data } = useConversations();
  const { openChat } = useChatStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSelectConversation = (conversationId: string) => {
    openChat(conversationId, { type: "conversation", conversationId: conversationId });
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
        "max-h-[500px]",
        className,
      )}
      ref={ref}
    >
      <div className="absolute top-0 right-0 flex mt-3 mr-3 gap-2">
        <MiniButton sz="sm-2" className="bg-bg-fifth" onClick={handleCreateConversation}>
          <i className="fa-regular fa-pen-to-square" />
        </MiniButton>
      </div>
      <div className="flex items-center justify-between px-2 pt-2">
        <Text sz="lg-1" weight="bold">
          {t("common:conversations.title")}
        </Text>
      </div>
      {tab === "list" && (
        <ChatList className="overflow-hidden" onConversationClick={handleSelectConversation} />
      )}
      {tab === "create" && (
        <CreateGroupChat
          className="overflow-hidden h-full max-h-[90%] w-full"
          onTurnBack={() => setTab("list")}
          onCreateSuccess={() => setTab("list")}
        />
      )}

      {tab === "list" && (
        <div className="flex justify-center border-t border-text-main/10 pt-2 pb-1 px-2 mt-auto">
          <button
            className="p-2 w-full rounded-lg hover:bg-bg-fourth transition-colors cursor-pointer flex items-center justify-center gap-2"
            onClick={() => {
              const firstId = data?.pages[0]?.items[0]?.id || "";
              navigate(`/fatalk/${firstId}`);
            }}
            title="Mở Fatalk"
          >
            <Text sz="sm-1" color="secondary">
              Mở Fatalk
            </Text>
            <Text sz="sm-1" color="secondary">
              <i className="fa-solid fa-arrow-up-right-from-square" />
            </Text>
          </button>
        </div>
      )}
    </div>
  );
};
