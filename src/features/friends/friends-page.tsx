import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import FriendsNavbar from "@/features/friends/components/friends-navbar";
import { SidebarLayout } from "@/components/ui/sidebar-layout/sidebar-layout";

interface FriendsPageProps {}

const FriendPage: React.FC<FriendsPageProps> = () => {
  const { t } = useTranslation() as { t: (key: string) => string };

  useEffect(() => {
    document.title = t("friends:title");
  }, [t]);

  return (
    <SidebarLayout
      title="Bạn bè"
      className="flex-1"
      navbar={<FriendsNavbar className="h-full !rounded-none" />}
    >
      <div className={clsx("w-full max-w-[700px]")}>
        <Outlet />
      </div>
    </SidebarLayout>
  );
};

export default FriendPage;
