import React from "react";
import { useTranslation } from "react-i18next";
import PageNavbar from "@/components/common/container/PageNavbar/PageNavbar";
import PageNavbarItem from "@/components/common/container/PageNavbar/PageNavbarItem";

interface FriendsNavbarProps {
    className?: string;
    onSelect?: () => void;
}

/**
 * SettingsNavbar component
 * @param className - additional class name for the component
 * @param onSelect - callback function to be called when a setting is selected
 * @returns SettingsNavbar component
 */
const FriendsNavbar: React.FC<FriendsNavbarProps> = ({className, onSelect}) => {

    // Other hooks
    const { t } = useTranslation() as { t: (key: string) => string }; // i18n translation hook

    // Route auth settings
    const authSettings : {icon: React.ReactNode, name: string, path: string}[] = [
        {icon: <i className="fa-solid fa-user-plus"></i>, name: t("friends:navbar.suggestedFriends"), path: "/friends"},
        {icon: <i className="fa-solid fa-user-check"></i>, name: t("friends:navbar.invite"), path: "/friends/requests"},
    ]

    return (
        <PageNavbar className={`flex flex-col gap-2
            ${className}
        `} title={t("friends:navbar.title")}>

            <div className="h-[1px] bg-[var(--bg-color-secondary)] w-full"></div>
                <ul className="w-full animate-dropdown-slide">
                    {authSettings.map((item, index) => (
                        <li key={index} className="flex" onClick={onSelect}>
                            <PageNavbarItem path={item.path}
                                icon={item.icon}
                                title={item.name}/>
                        </li>
                    ))}
                </ul>
        </PageNavbar>
    )
}

export default FriendsNavbar;