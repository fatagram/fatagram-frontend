import { userInfoService } from "@/api/user/user-info.api";
import { userProfileService } from "@/api/user/user-profile.api";
import Card from "@/components/common/container/Card"
import EditableTextArea from "@/components/common/container/Card/SettingItem/EditableTextArea";
import Button from "@/components/common/ui/Button";
import Text from "@/components/common/ui/Text";
import { AuthStatus } from "@/pages/profile/AuthStatus";
import { title } from "process";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ProfileOverviewProps {
    className?: string;
    authStatus?: AuthStatus;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({
    className,
    authStatus
}) => {
    const [bio, setBio] = React.useState<string | undefined>(undefined);
    const [isEditBio, setIsEditBio] = React.useState<boolean>(false);
    const [description, setDescription] = React.useState<string | undefined>(undefined);
    const [isEditDescription, setIsEditDescription] = React.useState<boolean>(false);
    const [email, setEmail] = React.useState<string | undefined>(undefined);
    const [phone, setPhone] = React.useState<string | undefined>(undefined);
    const [canEdit] = React.useState<boolean>((authStatus?.isAuthenticated && authStatus.isOwner) || false);
    // const [isOwner, setIsOwner] = React.useState<boolean | null | undefined>(null);

    const { t } = useTranslation() as { t: (key: string) => string };

    useEffect(() => {
        const fetchData = async (uid: string) => {
            const response = await userInfoService.GetUserInfoOverview(uid ?? "");
            if (response) {
                setBio(response.data?.bio);
                setDescription(response.data?.description);
                setEmail(response.data?.email);
                setPhone(response.data?.phone);
                // setIsOwner(response.data?.isOwner);
            }
        }
        fetchData(authStatus?.userId ?? "");
    },
    [authStatus]);

    // Handle save bio
    const handleSaveBio = async (value: string | undefined) => {
        var res = await userProfileService.UpdateProfile({ bio: value});
        if (res.success) {
            setBio(value);
            setIsEditBio(false);
        }
    }

    // Handle save description
    const handleSaveDescription = async (value: string | undefined) => {
        var res = await userProfileService.UpdateProfile({ description: value});
        if (res.success) {
            setDescription(value);
            setIsEditDescription(false);
        }
    }

    return (
        <Card title={t('user:profilePosts.overview')} 
            className={`bg-[var(--second-bg-color)] rounded-md mt-2 flex-col gap-4 ${className}`}
            titleClassName="text-[1.5rem] font-bold !mb-0">
                
            { (bio || canEdit) && <EditableTextArea editableMode="inline" isEdit={isEditBio}
                placeholder={t('user:profilePosts.bioPlaceholder')}
                value={bio}
                onChangeClick={() => setIsEditBio(true)}
                onSaveClick={(value) => handleSaveBio(value)}
                valueClassName="text-[1.2rem] font-semibold"
                canEdit={canEdit}
                onCancelClick={() => setIsEditBio(false)}
                btnChildren={<Text><i className="fas fa-pencil-alt"></i> &nbsp; {t('user:profilePosts.bioBtn')}</Text>}
            />}

            { description && <Text size="lg-1" weight="bold">{t('user:profilePosts.description')}</Text> }
            { (description || canEdit) && <EditableTextArea editableMode="inline" isEdit={isEditDescription}
                placeholder={t('user:profilePosts.descriptionPlaceholder')}
                value={description}
                canEdit={canEdit}
                valueClassName="text-[1.1rem]"
                onChangeClick={() => setIsEditDescription(true)}
                onSaveClick={(value) => handleSaveDescription(value)}
                onCancelClick={() => setIsEditDescription(false)}
                btnChildren={<Text><i className="fas fa-pencil-alt"></i> &nbsp; {t('user:profilePosts.descriptionBtn')}</Text>}
            />}

            {(bio || description) && <hr className="border-[var(--border-color)] w-full"/>}

            {email && <div>
                <Text className="hover:text-[var(--main-single-color)]"><i className="fas fa-envelope"/> &nbsp; {email}</Text>
            </div>}
            {phone && <div>
                <Text className="hover:text-[var(--main-single-color)]"><i className="fas fa-phone"></i> &nbsp; {phone}</Text>
            </div>}
        </Card>
    )
}

export default ProfileOverview;