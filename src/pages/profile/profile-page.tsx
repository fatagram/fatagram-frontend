import React from "react";
import ProfileHeader from "@/features/user/components/profile-header/profile-header";
import NotFoundPage from "../not-found/not-found-page";
import { useParams } from "react-router-dom";
import useUserId from "@/features/user/hooks/use-userid";
import ProfileBody from "@/pages/profile/profile-body";
import { useAuth } from "@/contexts/auth/auth-context";
import { AuthStatus } from "./auth-status";
import LoadingPage from "../loading/loading-page";

const ProfilePage: React.FC = () => {
    const { userParam } = useParams<{ userParam: string }>();
    const { userId, userExist, isLoading } = useUserId(userParam || "");

    const { isAuthenticated, userId: authUserId } = useAuth();

    const authStatus: AuthStatus = React.useMemo(() => {
        return {
            isAuthenticated: isAuthenticated || false,
            isOwner: Boolean(isAuthenticated && (authUserId === userId)),
            userId: userId || ""
        }
    }, [isAuthenticated, authUserId, userId]);

    if (isLoading) return <LoadingPage />;
    if (!userExist || !userId) return <NotFoundPage/>;

    return (
        <div className={`relative justify-start items-center flex flex-col bg-[var(--main-bg-color)]`}>
            <div className="flex justify-center w-full bg-[var(--second-bg-color)] z-10">
                <ProfileHeader className="layout-1000" authStatus={authStatus}/> 
            </div>
            <ProfileBody className="layout-1000" authStatus={authStatus} userParam={userParam}/>
        </div>
    );
};

export default ProfilePage;