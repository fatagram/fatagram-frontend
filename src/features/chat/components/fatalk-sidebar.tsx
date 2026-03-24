import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import PageNavbar from "@/components/ui/navigation/page-navbar/page-navbar";
import { ChatList } from "./chat-list";
import { useNavigate } from "react-router-dom";

interface FatalkSidebarProps extends ComponentProps {
  onConversationClick?: () => void;
}

export const FatalkSidebar: React.FC<FatalkSidebarProps> = ({ className, onConversationClick }) => {
  const navigate = useNavigate();
  const handleSelectConversation = (conversationId: string) => {
    navigate(`/fatalk/${conversationId}`);
    onConversationClick?.();
  };
  return (
    <PageNavbar title="Fatalk" className={clsx("h-full bg-bg-second !rounded-none", className)}>
      <div className="px-2">
        <ChatList onConversationClick={handleSelectConversation} />
      </div>
    </PageNavbar>
  );
};
