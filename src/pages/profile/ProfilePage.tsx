import React from "react";
import "./ProfilePage.style.css";
import ProfileHeader from "@/features/user/components/ProfileHeader/ProfileHeader";
import NotFoundPage from "../not_found/NotFoundPage";
import { useParams } from "react-router-dom";
import useUserId from "@/features/user/hooks/useUserId";
import LoadingPage from "../loading/LoadingPage";

const ProfilePage: React.FC = () => {
    const { userParam } = useParams<{ userParam: string }>();
    const { userId, userExist, loading } = useUserId(userParam || "");

    if (loading) return <LoadingPage/>;
    if (!userExist || !userId) return <NotFoundPage/>;

    return (
        <div className="relative justify-start items-center flex flex-col pt-2 h-screen bg-[var(--bg-color)]">
            <div className="flex justify-center w-full pb-[280px] lg:pb-32 bg-[var(--bg-color-secondary)] pt-16">
                <ProfileHeader userId={userId ?? ""}/> 
            </div>
        </div>
    );
};

export default ProfilePage;