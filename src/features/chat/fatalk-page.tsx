import { useNavigate, useParams } from "react-router-dom";
import { FatalkSidebar } from "./components/fatalk-sidebar";
import { FatalkChatPanel } from "./components/fatalk-chat-panel";
import { Text } from "@/components/atoms";
import { SidebarLayout } from "@/components/ui/sidebar-layout/sidebar-layout";
import clsx from "clsx";

const FatalkPage = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();

  // Check if the current path is the main fatalk page (not a specific conversation)
  const isMainFatalkPage = !conversationId;

  return (
    <SidebarLayout
      title="Fatalk"
      navbar={<FatalkSidebar />}
      className="overflow-hidden"
      showMenuButton={false}
      sidebarClassName={clsx("lg:w-[400px] w-full", "max-w-full transition-none")}
      showSidebar={isMainFatalkPage}
    >
      <div className="flex flex-col w-full h-full overflow-">
        {conversationId ? (
          <FatalkChatPanel
            conversationId={conversationId}
            className=""
            onTurnback={() => navigate("/fatalk")}
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
