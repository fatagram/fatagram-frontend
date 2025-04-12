import React from "react";
import SettingsNavbar from "../../features/settings/components/SettingsNavbar";
import { Outlet } from "react-router-dom";

interface SettingPageProps {
  // Define any props if needed
}

const SettingPage: React.FC<SettingPageProps> = () => {

    return (
        <div className="flex w-full h-full bg-[var(--bg-color-secondary)] p-2">
            <SettingsNavbar className="min-w-[150px] lg:min-w-[300px] shadow-lg rounded-2xl h-screen
                bg-[var(--bg-color)]"/>
            <div className="flex flex-1 justify-center">
                <Outlet/>
            </div>
        </div>
    )
}

export default SettingPage;