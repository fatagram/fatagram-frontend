import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import PageNavbar from "@/components/ui/navigation/page-navbar/page-navbar";
import { ChatList } from "./chat-list";
import { useNavigate } from "react-router-dom";
import { MiniButton } from "@/components/atoms/button";
import { useCreateGroupConversation } from "@/features/hooks/use-conversation";
import { useCallback, useState } from "react";
import { CreateGroupChat } from "./create-group-chat/create-group-chat";

interface FatalkSidebarProps extends ComponentProps {
  onConversationClick?: () => void;
}

export const FatalkSidebar: React.FC<FatalkSidebarProps> = ({ className, onConversationClick }) => {
  const navigate = useNavigate();
  const { fetch: _createConversation } = useCreateGroupConversation();
  const [tab, setTab] = useState<"list" | "create">("list");

  const handleCreateConversation = useCallback(async () => {
    setTab("create");
  }, []);

  const handleSelectConversation = (conversationId: string) => {
    navigate(`/fatalk/${conversationId}`);
    onConversationClick?.();
  };

  return (
    <PageNavbar
      title="Fatalk"
      className={clsx(
        "flex flex-col relative !h-[calc(100dvh-var(--header-height))] !overflow-hidden bg-bg-second !rounded-none",
        className,
      )}
      header={
        <div className="flex">
          <MiniButton sz="sm-2" className="bg-bg-fifth" onClick={handleCreateConversation}>
            <i className="fa-regular fa-pen-to-square" />
          </MiniButton>
        </div>
      }
      headerClassName="justify-between !flex-row pr-3"
    >
      <div className="flex flex-col px-2 h-full overflow-hidden">
        {tab === "list" && (
          <ChatList className="h-full" onConversationClick={handleSelectConversation} />
        )}
        {tab === "create" && <CreateGroupChat className="h-full max-h-[90%]" />}
      </div>
    </PageNavbar>
  );
};
