import React from "react";
import SelectBox from "../../../components/common/SelectBox/SelectBox";
import { useTheme } from "../../../contexts/ThemeContext";

interface ThemeSettingsProps {
    className?: string;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({className}) => {

    const { theme, setTheme, availableThemes } = useTheme(); 

    return (
        <div className={`${className}`}>
            <div className="flex flex-col items-start bg-[var(--bg-color)] p-5 rounded-2xl shadow-lg">
                <h1 className="text-2xl font-bold text-left m-2 mb-5">Theme settings</h1>
                <div className="flex justify-between items-center w-full">
                    <p className="text-lg font-light m-2">Select your theme</p>
                    <SelectBox selectedOption={theme} options={availableThemes} onSelect={(e) => {setTheme(e)}}></SelectBox>
                </div>
            </div>
        </div>
    )
}

export default ThemeSettings;