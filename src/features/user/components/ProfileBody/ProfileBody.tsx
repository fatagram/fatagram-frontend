import { Outlet } from "react-router-dom";
import ProfileNavbar from "./ProfileNavbar";

interface ProfileBodyProps {
    userParam?: string;
}

const ProfileBody: React.FC<ProfileBodyProps> = ({
    userParam
}) => {

    return (
        <div className="layout bg-[var(--main-bg-color)] flex flex-col">
            <ProfileNavbar userParam={userParam}/>
            <div>
                <Outlet/>
            </div>
        </div>
    )
}

export default ProfileBody;