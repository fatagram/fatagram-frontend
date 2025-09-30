import React from "react";
import ProfileHeader from "@/features/profile/components/profile-header";
import ProfileBody from "@/features/profile/components/profile-body";
import { ProfilePageProvider } from "@/features/profile/context/profile-page-context";

const ProfilePage: React.FC = () => {  
  return (
    <ProfilePageProvider>
      <div className={`relative justify-start items-center flex flex-col bg-[var(--main-bg-color)]`}>
        <div className="flex justify-center w-full bg-[var(--second-bg-color)] z-10 ">
          <ProfileHeader className="layout-1000"/>
        </div>
        <div className="layout-1000 w-full">
          <ProfileBody className="w-full"/>
        </div>
      </div>
    </ProfilePageProvider>
  );
};

export default ProfilePage;
