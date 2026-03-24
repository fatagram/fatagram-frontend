import { Outlet } from "react-router-dom";
import ProfileNavbar from "./profile-navbar";
import React from "react";
import clsx from "clsx";

type ProfileBodyProps = {
  className?: string;
};

const ProfileBody: React.FC<ProfileBodyProps> = ({ className }) => {
  return (
    <div className={clsx("w-full flex flex-col", className)}>
      <ProfileNavbar className="bg-bg-main justify-start sm:rounded-2xl shadow-md sm:mt-2 p-2 w-full" />
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileBody;
