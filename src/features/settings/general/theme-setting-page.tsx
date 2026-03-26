import React from "react";
import ThemeSettings from "./components/theme-setting";
import { SidebarPage } from "@/features/components/sidebar-page-layout";

const ThemeSettingPage: React.FC = () => {
  return (
    <SidebarPage>
      <ThemeSettings />
    </SidebarPage>
  );
};

export default ThemeSettingPage;
