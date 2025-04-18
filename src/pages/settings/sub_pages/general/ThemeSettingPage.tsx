import React from "react";
import ThemeSettings from "../../../../features/settings/components/general/ThemeSetting";

const ThemeSettingPage: React.FC = () => {
    return (
        <div className="flex justify-center md:min-w-[600px] min-w-[300px]">
            <ThemeSettings className="w-full"></ThemeSettings>
        </div>
    )
}

export default ThemeSettingPage;