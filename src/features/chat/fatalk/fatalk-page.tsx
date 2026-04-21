import { Outlet, useLocation } from "react-router-dom";
import { FatalkSidebar } from "./components/fatalk-sidebar";
import { SidebarLayout } from "@/components/ui/sidebar-layout/sidebar-layout";
import clsx from "clsx";
import { NotFound } from "../../components/not-found";
import { useTranslation } from "react-i18next";

const FatalkPage = () => {
  const { pathname } = useLocation();
  const isExactPath = pathname === "/fatalk" || pathname === "/fatalk/";
  const { t } = useTranslation();

  return (
    <SidebarLayout
      title="Fatalk"
      navbar={<FatalkSidebar className="h-full" />}
      showMenuButton={false}
      sidebarClassName={clsx("lg:w-[400px] w-full", "max-w-full !transition-none")}
      showSidebar={isExactPath}
      showOverlay={false}
    >
      <div className="flex flex-col w-full h-[calc(100dvh-var(--header-height))] overscroll-y-contain">
        <Outlet />

        {isExactPath && (
          <div
            className={clsx(
              "flex flex-col items-center justify-center flex-1",
              "",
              "gap-4 opacity-50",
            )}
          >
            <NotFound
              title={t("common:conversations.noSelectConversation")}
              icon={"fa-solid fa-message"}
              description={t("common:conversations.noSelectConversationMessage")}
            />
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default FatalkPage;
