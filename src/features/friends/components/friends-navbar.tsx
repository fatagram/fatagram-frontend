import React from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import PageNavbar from "@/components/ui/navigation/page-navbar/page-navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faUserCheck } from "@fortawesome/free-solid-svg-icons";

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
const FriendsNavbar: React.FC<FriendsNavbarProps> = ({ className, onSelect }) => {
  // Other hooks
  const { t } = useTranslation() as { t: (key: string) => string }; // i18n translation hook

  // Route auth settings
  const friendPageItems: { icon: React.ReactNode; name: string; path: string }[] = [
    {
      icon: <FontAwesomeIcon icon={faUserPlus} />,
      name: t("friends:navbar.addFriends"),
      path: "/friends",
    },
    {
      icon: <FontAwesomeIcon icon={faUserCheck} />,
      name: t("friends:navbar.invite"),
      path: "requests",
    },
  ];

  return (
    <PageNavbar title={t("friends:navbar.title")} className={clsx(className)}>
      <PageNavbar.Section className="px-2 pb-3 space-y-1">
        {friendPageItems.map((item) => (
          <PageNavbar.Item
            key={item.path}
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

export default FriendsNavbar;
