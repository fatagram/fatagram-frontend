import React from "react";
import clsx from "clsx";
import ProfileHeader from "@/features/profile/components/profile-header";
import ProfileBody from "@/features/profile/components/profile-body";
import ProfilePageProvider from "@/features/profile/context/profile-page-context";

const ProfilePage: React.FC = () => {
  return (
    <ProfilePageProvider>
      <div className={clsx("relative", "justify-start", "items-center", "flex", "flex-col")}>
        <div className={clsx("flex", "justify-center", "w-full", "bg-transparent", "z-10")}>
          <ProfileHeader className="w-full" />
        </div>
        <div className={clsx("layout-1000", "w-full")}>
          <ProfileBody className="w-full" />
        </div>
      </div>
    </ProfilePageProvider>
  );
};

export default ProfilePage;
