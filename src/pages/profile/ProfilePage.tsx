import React from "react";
import "./ProfilePage.style.css";
import ProfileHeader from "@/features/user/components/ProfileHeader/ProfileHeader";
import NotFoundPage from "../not_found/NotFoundPage";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserService } from "@/api/user/user.api";

const ProfilePage: React.FC = () => {
    const { userParam } = useParams<{ userParam: string }>();
    const [userExist, setUserExist] = React.useState<boolean>(true);
    const [userId, setUserId] = React.useState<string>("");
    const { t } = useTranslation() as { t: (key: string) => string };

    React.useEffect(() => {
        document.title = "Fatagram"
    }, [t]);

    React.useEffect(() => {
        const userService = new UserService();
        const fetchUserId = async () => {
            if (!userParam) {
                setUserExist(false);
                return;
            }
            const response = await userService.GetProfile(userParam, "id");
            if (response.success) {
                setUserId(response.data.infos.id);
                setUserExist(true);
            }
            else {
                setUserExist(false);
            }
        }
        fetchUserId();
    }, [userParam]);

    if (!userExist) return <NotFoundPage/>

    return (
        <div className="relative justify-start items-center flex flex-col pt-2 h-screen bg-[var(--bg-color)]">
            <div className="flex justify-center w-full pb-[280px] lg:pb-32 bg-[var(--bg-color-secondary)] pt-16">
                    <ProfileHeader userId={userId}/> 
            </div>
        </div>
    )
}

export default ProfilePage;