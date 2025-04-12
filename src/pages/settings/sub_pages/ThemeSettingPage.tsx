import React from "react";
import ThemeSettings from "../../../features/settings/components/ThemeSetting";

const ThemeSettingPage: React.FC = () => {
    return (
        <div className="flex justify-center min-w-[500px]">
            <ThemeSettings className="w-full"></ThemeSettings>
        </div>
    )
}

export default ThemeSettingPage;