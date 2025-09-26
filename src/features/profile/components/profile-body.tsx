import { Outlet } from "react-router-dom";
import ProfileNavbar from "./profile-navbar";
import React from "react";
import { ProfilePageState } from "@/types/profile-page-state";

type ProfileBodyProps = {
  className?: string;
};

const ProfileBody: React.FC<ProfileBodyProps> = ({ className }) => {
  return (
    <div className={`bg-[var(--main-bg-color)] flex flex-col w-full ${className}`}>
      <ProfileNavbar
        className="bg-[var(--second-bg-color)] justify-start rounded-md shadow-md mt-2 p-2"
      />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileBody;
