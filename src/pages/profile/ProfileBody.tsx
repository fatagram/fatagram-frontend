import { Outlet } from "react-router-dom";
import ProfileNavbar from "./ProfileNavbar";

interface ProfileBodyProps {
    userParam?: string;
    userId?: string;
}

const ProfileBody: React.FC<ProfileBodyProps> = ({
    userParam,
    userId
}) => {

    return (
        <div className="layout bg-[var(--main-bg-color)] flex flex-col w-full">
            <ProfileNavbar className="bg-[var(--second-bg-color)] justify-start rounded-md shadow-md mt-2 p-2" 
                userParam={userParam}/>
            <div>
                <Outlet context={userId}/>
            </div>
        </div>
    )
}

export default ProfileBody;