import React, { useEffect, useState } from "react";
import SettingsNavbar from "./components/settings-navbar";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SidebarPageLayout } from "../components/sidebar-page-layout";

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
    <SidebarPageLayout
      title="Cài đặt"
      showSidebar={showSidebar}
      setShowSidebar={setShowSidebar}
      navbar={<SettingsNavbar className="h-full" onSelect={() => setShowSidebar(false)} />}
    >
      <Outlet />
    </SidebarPageLayout>
  );
};

export default SettingPage;
