import React, { useEffect, useState } from "react";
import SettingsNavbar from "./components/settings-navbar";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { SidebarLayout } from "@/components/ui/sidebar-layout/sidebar-layout";

type SettingPageProps = {
  // Define any props if needed
};

const SettingPage: React.FC<SettingPageProps> = () => {
  const { t } = useTranslation() as { t: (key: string) => string };
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  useEffect(() => {
    document.title = t("settings:title");
  }, [t]);

  return (
    <SidebarLayout
      title="Cài đặt"
      navbar={<SettingsNavbar className="h-full" onSelect={() => setShowSidebar(false)} />}
      showSidebar={showSidebar}
      setShowSidebar={setShowSidebar}
    >
      <div className={clsx("flex items-start justify-center flex-1")}>
        <div className={clsx("w-full mt-1 max-w-[750px]")}>
          <Outlet />
        </div>
      </div>
    </SidebarLayout>
  );
};

export default SettingPage;
