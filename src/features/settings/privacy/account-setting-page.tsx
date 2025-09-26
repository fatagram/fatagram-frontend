import AccountSetting from "@/features/settings/privacy/components/account-setting";
import React from "react";
import { Outlet } from "react-router-dom";

const AccountSettingPage: React.FC = () => {
  return (
    <div className="flex justify-center w-full">
      <AccountSetting className="w-full" />
      <Outlet />
    </div>
  );
};

export default AccountSettingPage;
