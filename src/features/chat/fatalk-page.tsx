import { useParams } from "react-router-dom";
import { FatalkSidebar } from "./components/fatalk-sidebar";
import { FatalkChatPanel } from "./components/fatalk-chat-panel";
import { Text } from "@/components/atoms";
import { SidebarLayout } from "@/components/ui/sidebar-layout/sidebar-layout";
import clsx from "clsx";
import { useState } from "react";

const FatalkPage = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const { conversationId } = useParams<{ conversationId: string }>();

  return (
    <SidebarLayout
      title="Fatalk"
      navbar={<FatalkSidebar onConversationClick={() => setShowSidebar(false)} />}
      className="overflow-hidden"
      showMenuButton={false}
      sidebarClassName={clsx("lg:w-[400px] w-full", "max-w-full h-full")}
      showSidebar={showSidebar}
      setShowSidebar={setShowSidebar}
    >
      <div className="flex flex-col w-full h-full overflow-hidden">
        {conversationId ? (
          <FatalkChatPanel
            conversationId={conversationId}
            className="h-full"
            onTurnback={() => setShowSidebar(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
            <div className="w-20 h-20 rounded-full bg-bg-fourth flex items-center justify-center">
              <i className="fa-solid fa-message text-4xl text-primary-400" />
            </div>
            <Text sz="xl-1" weight="bold">
              Tin nhắn của bạn
            </Text>
            <Text sz="md-1">Chọn một cuộc trò chuyện để bắt đầu nhắn tin</Text>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default FatalkPage;
