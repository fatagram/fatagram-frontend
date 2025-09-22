import { Outlet } from "react-router-dom";
import ProfileNavbar from "./profile-navbar";
import React from "react";
import { AuthStatus } from "./auth-status";

type ProfileBodyProps = {
    userParam?: string;
    authStatus?: AuthStatus;
    className?: string;
}

const ProfileBody: React.FC<ProfileBodyProps> = ({
    userParam,
    authStatus,
    className
}) => {

    return (
        <div className={`bg-[var(--main-bg-color)] flex flex-col w-full ${className}`}>
            <ProfileNavbar className="bg-[var(--second-bg-color)] justify-start rounded-md shadow-md mt-2 p-2" 
                userParam={userParam} isOwner={authStatus?.isOwner}/>
            <div>
                <Outlet context={authStatus}/>
            </div>
        </div>
    )
}

export default ProfileBody;