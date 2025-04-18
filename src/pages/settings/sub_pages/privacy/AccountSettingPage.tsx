import React from "react";
import AccountSetting from "@/features/settings/components/privacy/AccountSetting";
import { Outlet } from "react-router-dom";

const AccountSettingPage: React.FC = () => {

    return (
        <div className="flex justify-center md:min-w-[700px] min-w-[300px]">
            <AccountSetting className="w-full"/>
            <Outlet/>
        </div>
    )
}

export default AccountSettingPage;