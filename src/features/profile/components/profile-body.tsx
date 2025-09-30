import { Outlet } from "react-router-dom";
import ProfileNavbar from "./profile-navbar";
import React from "react";
import { ProfilePageState } from "@/types/profile-page-state";
import { Stack } from "@/components/atoms";

type ProfileBodyProps = {
  className?: string;
};

const ProfileBody: React.FC<ProfileBodyProps> = ({ className }) => {
  return (
    <Stack direction="down" className={`w-full ${className}`}>
      <ProfileNavbar
        className="bg-[var(--second-bg-color)] justify-start rounded-md shadow-md mt-2 p-2 w-full"
      />
      <div className="w-full">
        <Outlet />
      </div>
    </Stack>
  );
};

export default ProfileBody;
