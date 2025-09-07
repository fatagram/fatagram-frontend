import { Outlet } from "react-router-dom";
import ProfileNavbar from "./ProfileNavbar";
import React from "react";
import { AuthStatus } from "./AuthStatus";

interface ProfileBodyProps {
    userParam?: string;
    authStatus?: AuthStatus;
}

const ProfileBody: React.FC<ProfileBodyProps> = ({
    userParam,
    authStatus
}) => {

    return (
        <div className="layout bg-[var(--main-bg-color)] flex flex-col w-full">
            <ProfileNavbar className="bg-[var(--second-bg-color)] justify-start rounded-md shadow-md mt-2 p-2" 
                userParam={userParam} isOwner={authStatus?.isOwner}/>
            <div>
                <Outlet context={authStatus}/>
            </div>
        </div>
    )
}

export default ProfileBody;