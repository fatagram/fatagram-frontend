import React, { useCallback } from "react";
import Text from "@/components/common/ui/Text";
import { useTranslation } from "react-i18next";
import PageNavbarItem from "@/components/common/container/PageNavbar/PageNavbarItem";
import PageNavbar from "@/components/common/container/PageNavbar/PageNavbar";

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
    // const [showAuthSettings, setShowAuthSettings] = React.useState<boolean>(true); 
    // const [showGeneralSettings, setShowGeneralSettings] = React.useState<boolean>(true); 

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

    // const createSettingItems = useCallback()


    return (
        <PageNavbar title={t("settings:navbar.title")} className={className}>
            <PageNavbar.Section title={t("settings:navbar.privacy.title")}>
                {authSettings.map((item, index) => (
                    <PageNavbar.Item key={index} path={item.path} icon={item.icon} title={item.name} />
                ))}
            </PageNavbar.Section>
            <PageNavbar.Section title={t("settings:navbar.general.title")}>
                {generalSettings.map((item, index) => (
                    <PageNavbar.Item key={index} path={item.path} icon={item.icon} title={item.name} />
                ))}
            </PageNavbar.Section>
        </PageNavbar>
    )
}

export default SettingsNavbar;