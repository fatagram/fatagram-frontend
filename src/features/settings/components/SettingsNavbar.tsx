import React from "react";
import Button from "@/components/common/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import Label from "@/components/common/ui/Label/Label";

interface SettingsNavbarProps {
    className?: string;
}

const SettingsNavbar: React.FC<SettingsNavbarProps> = ({className}) => {

    const navigate = useNavigate();
    const [showAuthSettings, setShowAuthSettings] = React.useState<boolean>(true); 
    const [showGeneralSettings, setShowGeneralSettings] = React.useState<boolean>(true); 

    const authSettings : {icon: React.ReactNode, name: string, path: string}[] = [
        {icon: <i className="fa-solid fa-user"></i>, name: "Account", path: "/settings/account"},
        {icon: <i className="fa-solid fa-shield-halved"></i>,name: "Privacy", path: "/settings/privacy"},
    ]

    const generalSettings : {icon: React.ReactNode, name: string, path: string}[] = [
        {icon: <i className="fa-solid fa-language"></i>, name: "Language", path: "/settings/language"},
        {icon: <i className="fa-solid fa-bell"></i>,name: "Notifications", path: "/settings/notifications"},
        {icon: <i className="fa-solid fa-circle-info"></i>,name: "About", path: "/settings/about"},
        {icon: <i className="fa-solid fa-palette"></i>,name: "Theme", path: "/settings/theme"},
    ]

    const handleSettingsClick = (path: string) => {
        navigate(path, {replace: true});
    }

    const handleToggleAuthSettings = () => {
        setShowAuthSettings(!showAuthSettings);
    }
    
    const handleToggleGeneralSettings = () => {
        setShowGeneralSettings(!showGeneralSettings);
    }

    return (
        <div className={`flex flex-col gap-2
            ${className}
        `}>
            <h1 className="text-[30px] font-semibold p-2 pl-5 text-gradient-main">Settings</h1>

            <div className="h-[1px] bg-[var(--bg-color-secondary)] w-full"></div>
            <Label onClick={handleToggleAuthSettings} size="large" className="p-2 pl-5 !font-bold">Privacy Settings</Label>
                { showAuthSettings && <ul className="w-full animate-dropdown-slide">
                    {authSettings.map((setting, index) => (
                        <li key={index} className="flex">
                            <div className="flex items-center w-full">
                                <Button variant="third"
                                    className="!w-full text-left !text-[17px] !px-3"
                                    onClick={() => handleSettingsClick(setting.path)}>
                                    <div className="grid grid-cols-10 items-start">
                                        <div className="flex justify-center items-center h-full col-span-2">{setting.icon}</div>
                                        <Label size="large" className="col-span-8 font-light !text-[17px]">{setting.name}</Label>
                                    </div>
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul> }
            <Label onClick={handleToggleGeneralSettings} size="large" className="p-2 pl-5 !font-bold">General Settings</Label>
            { showGeneralSettings && <ul className="w-full animate-dropdown-slide">
                {generalSettings.map((setting, index) => (
                    <li key={index} className="flex">
                        <div className="flex items-center w-full">
                            <Button variant="third"
                                className="!w-full text-left !text-[17px] !px-3"
                                onClick={() => handleSettingsClick(setting.path)}>
                                <div className="grid grid-cols-10 items-start">
                                    <div className="flex justify-center items-center h-full col-span-2">{setting.icon}</div>
                                    <Label size="large" className="col-span-8 font-light !text-[17px]">{setting.name}</Label>
                                </div>
                            </Button>
                        </div>
                    </li>
                ))}
            </ul> }
        </div>
    )
}

export default SettingsNavbar;