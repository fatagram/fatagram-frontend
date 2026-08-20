import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FriendsNavbar from "@/features/friends/components/friends-navbar";
import { SidebarPageLayout } from "../components/sidebar-page-layout";

const FriendPage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { t } = useTranslation() as { t: (key: string) => string };

  useEffect(() => {
    document.title = t("friends:title");
  }, [t]);

  return (
    <SidebarPageLayout
      title={t("friends:title")}
      showSidebar={showSidebar}
      setShowSidebar={setShowSidebar}
      navbar={<FriendsNavbar className="h-full" onSelect={() => setShowSidebar(false)} />}
    >
      <Outlet />
    </SidebarPageLayout>
  );
};

export default FriendPage;
