import React from "react";
import Text from "@/components/common/ui/Text";
import { useTranslation } from "react-i18next";
import PageNavbarItem from "@/components/common/container/PageNavbar/PageNavbarItem";

interface SettingsNavbarProps {
    className?: string;
    onSelect?: () => void;
}

/**
 * SettingsNavbar component
 * @param className - additional class name for the component
 * @param onSelect - callback function to be called when a setting is selected
 * @returns SettingsNavbar component
 */
const SettingsNavbar: React.FC<SettingsNavbarProps> = ({className, onSelect}) => {

    // State
    const [showAuthSettings, setShowAuthSettings] = React.useState<boolean>(true); 
    const [showGeneralSettings, setShowGeneralSettings] = React.useState<boolean>(true); 

    // Other hooks
    const { t } = useTranslation() as { t: (key: string) => string }; // i18n translation hook

    // Route auth settings
    const authSettings : {icon: React.ReactNode, name: string, path: string}[] = [
        {icon: <i className="fa-solid fa-user"></i>, name: t("settings:navbar.privacy.account"), path: "/settings"},
        {icon: <i className="fa-solid fa-shield-halved"></i>,name: t("settings:navbar.privacy.privacy"), path: "/settings/privacy"},
    ]

    // Route general settings
    const generalSettings : {icon: React.ReactNode, name: string, path: string}[] = [
        {icon: <i className="fa-solid fa-language"></i>, name: t("settings:navbar.general.language"), path: "/settings/language"},
        {icon: <i className="fa-solid fa-bell"></i>,name: t("settings:navbar.general.notifications"), path: "/settings/notifications"},
        {icon: <i className="fa-solid fa-circle-info"></i>,name: t("settings:navbar.general.about"), path: "/settings/about"},
        {icon: <i className="fa-solid fa-palette"></i>,name: t("settings:navbar.general.theme"), path: "/settings/theme"},
    ]

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
            <Text size="xl" weight="bold" className="p-2 pl-5 text-gradient-main">{t("settings:navbar.title")}</Text>

            <div className="h-[1px] bg-[var(--bg-color-secondary)] w-full"></div>
            <Text onClick={handleToggleAuthSettings} size="lg" className="p-2 pl-5 !font-bold">{t("settings:navbar.privacy.title")}</Text>
                { showAuthSettings && <ul className="w-full animate-dropdown-slide">
                    {authSettings.map((item, index) => (
                        <li key={index} className="flex" onClick={onSelect}>
                            <PageNavbarItem path={item.path}
                                icon={item.icon}
                                title={item.name}/>
                        </li>
                    ))}
                </ul> }
            <Text onClick={handleToggleGeneralSettings} size="lg" className="p-2 pl-5 !font-bold">{t("settings:navbar.general.title")}</Text>
            { showGeneralSettings && <ul className="w-full animate-dropdown-slide">
                {generalSettings.map((item, index) => (
                    <li key={index} className="flex" onClick={onSelect}>
                        <PageNavbarItem path={item.path}
                                icon={item.icon}
                                title={item.name}/>
                    </li>
                ))}
            </ul> }
        </div>
    )
}

export default SettingsNavbar;