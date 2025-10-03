import AccountSetting from "@/features/settings/privacy/components/account-setting";
import React from "react";
import { Outlet } from "react-router-dom";
import clsx from "clsx";

const AccountSettingPage: React.FC = () => {
  return (
    <div className={clsx("flex justify-center w-full")}>
      <AccountSetting className={clsx("w-full")} />
      <Outlet />
    </div>
  );
};

export default AccountSettingPage;
