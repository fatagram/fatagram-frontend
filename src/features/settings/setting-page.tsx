import React, { useEffect } from "react";
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

  useEffect(() => {
    document.title = t("settings:title");
  }, [t]);

  return (
    <SidebarLayout
      className="flex-1"
      navbar={<SettingsNavbar className="h-full lg:!rounded-none !rounded-r-xl" />}
    >
      <div className={clsx("w-full max-w-[700px]")}>
        <Outlet />
      </div>
    </SidebarLayout>
  );
};

export default SettingPage;
