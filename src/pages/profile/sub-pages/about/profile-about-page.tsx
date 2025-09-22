import Card from "@/components/molecules/card"
import ProfileAboutNavbar from "./profile-about-navbar";
import { Outlet, useOutletContext } from "react-router-dom";
import { AuthStatus } from "../../auth-status";

const ProfileAboutPage = () => {
    const authStatus = useOutletContext<AuthStatus>();

    return (
        <div className="flex gap-2 lg:flex-row flex-col ">
            <ProfileAboutNavbar className="bg-[var(--second-bg-color)] rounded-md mt-2 flex-[4]"/>
            <Card className="bg-[var(--second-bg-color)] rounded-md mt-2 flex-[8] pt-0">
                <Outlet context={authStatus}/>
            </Card>
        </div>
    )
}

export default ProfileAboutPage;