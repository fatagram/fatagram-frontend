import React from "react";
import ThemeSettings from "../../../../features/settings/components/general/ThemeSetting";

const ThemeSettingPage: React.FC = () => {
    return (
        <div className="flex justify-center w-full">
            <ThemeSettings className="w-full" />
        </div>
    )
}

export default ThemeSettingPage;