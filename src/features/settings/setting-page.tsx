import React, { useEffect, useState } from "react";
import SettingsNavbar from "./components/settings-navbar";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SidebarPageLayout } from "../components/sidebar-page-layout";

type SettingPageProps = {
  // Define any props if needed
};

const SettingPage: React.FC<SettingPageProps> = () => {
  const { t } = useTranslation();
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  useEffect(() => {
    document.title = t("settings:title");
  }, [t]);

  return (
    <SidebarPageLayout
      title={t("settings:title")}
      showSidebar={showSidebar}
      setShowSidebar={setShowSidebar}
      navbar={<SettingsNavbar className="h-full w-full" onSelect={() => setShowSidebar(false)} />}
    >
      <Outlet />
    </SidebarPageLayout>
  );
};

export default SettingPage;
