import React from "react";
import "./ProfilePage.style.css";
import ProfileHeader from "@/features/user/components/ProfileHeader/ProfileHeader";
import NotFoundPage from "../not_found/NotFoundPage";
import { useParams } from "react-router-dom";
import useUserId from "@/features/user/hooks/useUserId";
import LoadingPage from "../loading/LoadingPage";
import ProfileBody from "@/pages/profile/ProfileBody";
import { useAuth } from "@/contexts/AuthContext";
import { AuthStatus } from "./AuthStatus";


const ProfilePage: React.FC = () => {
    const { userParam } = useParams<{ userParam: string }>();
    const { userId, userExist, loading } = useUserId(userParam || "");

    const { isAuthenticated, userId: authUserId } = useAuth();

    const authStatus: AuthStatus = React.useMemo(() => {
        return {
            isAuthenticated: isAuthenticated || false,
            isOwner: Boolean(isAuthenticated && (authUserId === userId)),
            userId: userId || ""
        }
    }, [isAuthenticated, authUserId, userId]);

    // console.log(userParam);

    if (loading) return <LoadingPage/>;
    if (!userExist || !userId) return <NotFoundPage/>;

    return (
        <div className="relative justify-start items-center flex flex-col pt-2 h-screen bg-[var(--main-bg-color)]">
            <div className="flex justify-center w-full pb-[280px] lg:pb-32 bg-[var(--second-bg-color)] pt-16 z-10">
                <ProfileHeader authStatus={authStatus}/> 
            </div>
            <ProfileBody authStatus={authStatus} userParam={userParam}/>
        </div>
    );
};

export default ProfilePage;