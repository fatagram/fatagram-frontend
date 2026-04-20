import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import PageNavbar from "@/components/ui/navigation/page-navbar/page-navbar";
import { ChatList } from "./chat-list";
import { useNavigate } from "react-router-dom";
import { MiniButton } from "@/components/atoms/button";
import { useCreateGroupConversation, useConversations } from "@/features/hooks/use-conversation";
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

  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isPending } = useConversations();

  const handleSelectConversation = (_conversationId: string) => {
    onConversationClick?.();
  };

  return (
    <PageNavbar
      title="Fatalk"
      className={clsx(
        "flex flex-col relative !h-[calc(100dvh-var(--header-height))] !overflow-hidden !rounded-none",
        className,
      )}
      header={
        <div className="flex ">
          <MiniButton sz="sm" className="bg-bg-fifth" onClick={handleCreateConversation}>
            <i className="fa-regular fa-pen-to-square" />
          </MiniButton>
        </div>
      }
      headerClassName="justify-between !flex-row pr-3 "
    >
      {tab === "list" && (
        <div className="flex flex-col px-2 h-full overflow-hidden">
          <ChatList
            className="pt-0 h-full"
            onConversationClick={handleSelectConversation}
            data={data}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isLoading={isLoading || isPending}
            isFetching={isFetching}
          />
        </div>
      )}
      {tab === "create" && (
        <CreateGroupChat
          className="flex-1 min-h-0"
          onCreateSuccess={(conversationId) => {
            navigate(`/fatalk/${conversationId}`);
            setTab("list");
          }}
          onTurnBack={() => setTab("list")}
        />
      )}
    </PageNavbar>
  );
};
