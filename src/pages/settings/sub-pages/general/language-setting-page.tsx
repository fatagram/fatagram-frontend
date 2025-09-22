import LanguageSettings from "@/features/settings/components/general/language-setting";
import React from "react";

const LanguageSettingPage = () => {
    return (
        <div className="flex justify-center w-full">
            <LanguageSettings className="w-full !min-w-[200px]"/>
        </div>
    )
}

export default LanguageSettingPage;