import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import PageNavbar from "@/components/ui/navigation/page-navbar/page-navbar";
import { ChatList } from "./chat-list";
import { useNavigate } from "react-router-dom";
import { MiniButton } from "@/components/atoms/button";
import { useCreateGroupConversation } from "@/features/hooks/use-conversation";

interface FatalkSidebarProps extends ComponentProps {
  onConversationClick?: () => void;
}

export const FatalkSidebar: React.FC<FatalkSidebarProps> = ({ className, onConversationClick }) => {
  const navigate = useNavigate();
  const { fetch: createConversation } = useCreateGroupConversation();

  const handleCreateConversation = async () => {
    await createConversation([
      "bfbe9a52-72cd-482a-9198-89dbc865f7b6",
      "04fa4528-81fd-444f-b60f-64d129e51cbc",
    ]);
  };
  const handleSelectConversation = (conversationId: string) => {
    navigate(`/fatalk/${conversationId}`);
    onConversationClick?.();
  };
  return (
    <PageNavbar
      title="Fatalk"
      className={clsx("relative h-full bg-bg-second !rounded-none", className)}
    >
      <div className="absolute top-0 right-0 flex mt-3 mr-3 gap-2">
        <MiniButton sz="sm-2" className="bg-bg-fifth" onClick={handleCreateConversation}>
          <i className="fa-regular fa-pen-to-square" />
        </MiniButton>
      </div>
      <div className="px-2">
        <ChatList onConversationClick={handleSelectConversation} />
      </div>
    </PageNavbar>
  );
};
