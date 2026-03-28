import { Outlet, useLocation } from "react-router-dom";
import { Text } from "@/components/atoms";
import { FatalkSidebar } from "./components/fatalk-sidebar";
import { SidebarLayout } from "@/components/ui/sidebar-layout/sidebar-layout";
import clsx from "clsx";

const FatalkPage = () => {
  const { pathname } = useLocation();
  const isExactPath = pathname === "/fatalk" || pathname === "/fatalk/";

  return (
    <SidebarLayout
      title="Fatalk"
      navbar={<FatalkSidebar className="h-full" />}
      showMenuButton={false}
      sidebarClassName={clsx("lg:w-[400px] w-full", "max-w-full !transition-none")}
      showSidebar={isExactPath}
      showOverlay={false}
    >
      <div className="flex flex-col flex-1 w-full h-full">
        <Outlet />

        {isExactPath && (
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
