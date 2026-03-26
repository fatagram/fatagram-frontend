import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import FriendsNavbar from "@/features/friends/components/friends-navbar";
import { SidebarLayout } from "@/components/ui/sidebar-layout/sidebar-layout";

interface FriendsPageProps {}

const FriendPage: React.FC<FriendsPageProps> = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { t } = useTranslation() as { t: (key: string) => string };

  useEffect(() => {
    document.title = t("friends:title");
  }, [t]);

  return (
    <SidebarLayout
      title="Bạn bè"
      navbar={
        <FriendsNavbar
          className="h-full !rounded-none"
          onSelect={() => {
            setShowSidebar(false);
          }}
        />
      }
      showSidebar={showSidebar}
      setShowSidebar={setShowSidebar}
    >
      <div className={clsx("flex items-center justify-center flex-1  mt-1")}>
        <div className="w-full max-w-[750px]">
          <Outlet />
        </div>
      </div>
    </SidebarLayout>
  );
};

export default FriendPage;
