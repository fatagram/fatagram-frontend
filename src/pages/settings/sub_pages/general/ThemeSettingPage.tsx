import ThemeSettings from "@/features/settings/components/general/ThemeSetting";
import React from "react";

const ThemeSettingPage: React.FC = () => {
    return (
        <div className="flex justify-center w-full">
            <ThemeSettings className="w-full" />
        </div>
    )
}

export default ThemeSettingPage;