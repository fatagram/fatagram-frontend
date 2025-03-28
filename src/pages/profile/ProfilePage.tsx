import React from "react";
import "./ProfilePage.style.css";
import { useParams } from "react-router-dom";
import ProfileHeader, { ProfileData } from "../../features/user/components/ProfileHeader/ProfileHeader";
import { ProfileService } from "../../features/user/services/Profile/ProfileService";
import NotFoundPage from "../not_found/NotFoundPage";
import LoadingPage from "../loading/LoadingPage";


const ProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();

    const [profile, setProfile] = React.useState<ProfileData | undefined>(undefined);
    const [isOwner, setIsOwner] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const fetchProfile = async () => {
            const service = new ProfileService();
            const response = await service.GetProfileHeader(userId? userId : "");
            if (response.success) {
                setProfile(response.data.infos);
                setIsOwner(response.data.isOwner);
            }
            else {
                console.log(response.errorCodes);
            }
            setLoading(false);
        }
        if (userId) fetchProfile();
    }, [userId]);

    if (loading) return <LoadingPage/>
    
    return (
        <div className="relative justify-start items-center flex flex-col pt-2 h-screen bg-[var(--bg-color)]">
            {profile? <div className="flex justify-center w-full pb-[280px] lg:pb-32 bg-[var(--bg-color-secondary)] pt-16">
                 <ProfileHeader profileData={profile} isOwner={isOwner}/> 
            </div> : <NotFoundPage/>}
        </div>
    )
}

export default ProfilePage;