import React from "react";
import SettingsNavbar from "../../features/settings/components/SettingsNavbar";
import { Outlet } from "react-router-dom";

interface SettingPageProps {
  // Define any props if needed
}

const SettingPage: React.FC<SettingPageProps> = () => {

    return (
        <div className="grid grid-cols-10 w-full h-full bg-[var(--bg-color-secondary)] p-2 gap-4">
            <SettingsNavbar className="w-full col-span-2 min-w-[150px] lg:min-w-[300px] shadow-lg rounded-2xl h-screen
                bg-[var(--bg-color)] p-2"/>
            <div className="col-span-8 flex justify-center">
                <Outlet/>
            </div>
        </div>
    )
}

export default SettingPage;