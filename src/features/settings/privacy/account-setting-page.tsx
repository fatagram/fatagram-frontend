import { SidebarPage } from "@/features/components/sidebar-page-layout";
import AccountSetting from "@/features/settings/privacy/components/account-setting";
import React from "react";
import { Outlet } from "react-router-dom";

const AccountSettingPage: React.FC = () => {
  return (
    <SidebarPage>
      <AccountSetting />
      <Outlet />
    </SidebarPage>
  );
};

export default AccountSettingPage;
