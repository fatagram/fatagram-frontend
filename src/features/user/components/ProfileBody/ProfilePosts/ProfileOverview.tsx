import { userInfoService } from "@/api/user/user-info.api";
import Card from "@/components/common/container/Card"
import EditableTextArea from "@/components/common/container/Card/SettingItem/EditableTextArea";
import Button from "@/components/common/ui/Button";
import Text from "@/components/common/ui/Text";
import { AuthStatus } from "@/pages/profile/AuthStatus";
import React, { useEffect } from "react";

interface ProfileOverviewProps {
    className?: string;
    authStatus?: AuthStatus;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({
    className,
    authStatus
}) => {
    const [bio, setBio] = React.useState<string | null | undefined>(null);
    const [isEditBio, setIsEditBio] = React.useState<boolean>(false);
    const [description, setDescription] = React.useState<string | null | undefined>(null);
    const [isEditDescription, setIsEditDescription] = React.useState<boolean>(false);
    const [email, setEmail] = React.useState<string | null | undefined>(null);
    const [phone, setPhone] = React.useState<string | null | undefined>(null);
    // const [isOwner, setIsOwner] = React.useState<boolean | null | undefined>(null);

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

    return (
        <Card title="Overview" className={`bg-[var(--second-bg-color)] rounded-md mt-2 flex-col gap-4 ${className}`}>
            {authStatus?.isAuthenticated && authStatus.isOwner && <EditableTextArea editableMode="inline" isEdit={isEditBio}
                placeholder="Nhập tiểu sử"
                value={bio ?? undefined}
                onChangeClick={() => setIsEditBio(true)}
                onSaveClick={(value) => {
                    setBio(value);
                    setIsEditBio(false);
                }}
                valueClassName="text-[15px]"
                onCancelClick={() => setIsEditBio(false)}
                btnChildren={<Text><i className="fas fa-pencil-alt"></i> &nbsp; Cập nhật tiểu sử</Text>}
            />}

            {authStatus?.isAuthenticated && authStatus.isOwner && <EditableTextArea editableMode="inline" isEdit={isEditDescription}
                placeholder="Nhập mô tả"
                value={description ?? undefined}
                onChangeClick={() => setIsEditDescription(true)}
                onSaveClick={(value) => {
                    setDescription(value);
                    setIsEditDescription(false);
                }}
                onCancelClick={() => setIsEditDescription(false)}
                btnChildren={<Text><i className="fas fa-pencil-alt"></i> &nbsp; Cập nhật mô tả</Text>}
            />}
            
            {email && <div >
                <Text className="hover:text-[var(--main-single-color)]"><i className="fas fa-envelope"/> &nbsp; {email}</Text>
            </div>}
            {phone && <div>
                <Text className="hover:text-[var(--main-single-color)]"><i className="fas fa-phone"></i> &nbsp; {phone}</Text>
            </div>}
        </Card>
    )
}

export default ProfileOverview;