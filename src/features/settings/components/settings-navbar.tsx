import React from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import PageNavbar from "@/components/ui/navigation/page-navbar/page-navbar";

type SettingsNavbarProps = {
  className?: string;
  onSelect?: () => void;
};

/**
 * SettingsNavbar component
 * @param className - additional class name for the component
 * @param onSelect - callback function to be called when a setting is selected
 * @returns SettingsNavbar component
 */
const SettingsNavbar: React.FC<SettingsNavbarProps> = ({ className, onSelect }) => {
  // Other hooks
  const { t } = useTranslation() as { t: (key: string) => string }; // i18n translation hook

  // Route auth settings
  const authSettings: { icon: React.ReactNode; name: string; path: string }[] = [
    {
      icon: <i className="fa-solid fa-user"></i>,
      name: t("settings:navbar.privacy.account"),
      path: "/settings",
    },
    {
      icon: <i className="fa-solid fa-shield-halved"></i>,
      name: t("settings:navbar.privacy.privacy"),
      path: "/settings/privacy",
    },
  ];

  // Route general settings
  const generalSettings: { icon: React.ReactNode; name: string; path: string }[] = [
    {
      icon: <i className="fa-solid fa-language"></i>,
      name: t("settings:navbar.general.language"),
      path: "/settings/language",
    },
    {
      icon: <i className="fa-solid fa-bell"></i>,
      name: t("settings:navbar.general.notifications"),
      path: "/settings/notifications",
    },
    {
      icon: <i className="fa-solid fa-circle-info"></i>,
      name: t("settings:navbar.general.about"),
      path: "/settings/about",
    },
    {
      icon: <i className="fa-solid fa-palette"></i>,
      name: t("settings:navbar.general.theme"),
      path: "/settings/theme",
    },
  ];

  return (
    <PageNavbar title={t("settings:navbar.title")} className={clsx(className)}>
      <PageNavbar.Section title={t("settings:navbar.privacy.title")} className="px-2 space-y-1">
        {authSettings.map((item, index) => (
          <PageNavbar.Item
            key={index}
            path={item.path}
            icon={item.icon}
            title={item.name}
            onClick={onSelect}
          />
        ))}
      </PageNavbar.Section>
      <PageNavbar.Section title={t("settings:navbar.general.title")} className="px-2 space-y-1">
        {generalSettings.map((item, index) => (
          <PageNavbar.Item
            key={index}
            path={item.path}
            icon={item.icon}
            title={item.name}
            onClick={onSelect}
          />
        ))}
      </PageNavbar.Section>
    </PageNavbar>
  );
};

export default SettingsNavbar;
