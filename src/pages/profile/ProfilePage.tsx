import React from "react";
import "./ProfilePage.style.css";
import ProfileHeader from "@/features/user/components/ProfileHeader/ProfileHeader";
import NotFoundPage from "../not_found/NotFoundPage";
import { useParams } from "react-router-dom";
import { useCheckUserExist } from "@/hooks/useCheckUserExist";
import { useTranslation } from "react-i18next";

const ProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [userExist ] = useCheckUserExist(userId ? userId : "");
    const { t } = useTranslation() as { t: (key: string) => string };

    React.useEffect(() => {
        document.title = "Fatagram"
    }, [t])

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