import { userInfoService } from "@/api/user/user-info.api";
import { AuthStatus } from "@/pages/profile/auth-status";
import Text from "@/components/atoms/text";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ProfileAboutSection from "./profile-about-section";
import Button from "@/components/atoms/button";

type ProfileOverviewProps = {
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({
}) => {
    const authStatus = useOutletContext<AuthStatus>();
    const [emails, setEmails] = useState<string[]>([]);
    const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await userInfoService.GetUserInfoOverview(authStatus?.userId ?? "");
            if (response) {
                if (response.data?.email) {
                    setEmails([...emails, response.data.email]);
                }
                if (response.data?.phone) {
                    setPhoneNumbers([...phoneNumbers, response.data.phone]);
                }
            }
        }
        fetchData();
    }, [])

    return (
        <div>
            <ProfileAboutSection title="Liên hệ" className="mb-4 w-full ">
                {emails.length > 0 && 
                    <div className="flex items-start w-full gap-4 mb-6 mt-4">
                        <Text size="lg-3" className="opacity-50">
                            <i className="fa-solid fa-envelope"></i>
                        </Text>
                        <div>
                            {emails.map((email, index) => (
                                <div className="flex flex-col">
                                    <Text key={index} weight="bold">{email}</Text>
                                    <Text size="sm-3" className="opacity-50">Email</Text>
                                </div>
                            ))}
                        </div>
                        { authStatus.isOwner && <div className="ml-auto">
                            <Button variant="secondary" className="!rounded-full !p-0 w-10 h-10">
                                <i className="fa-solid fa-pencil-alt"></i>
                            </Button>
                        </div>}
                    </div>
                }
                {phoneNumbers.length > 0 && 
                    <div className="flex items-start gap-4">
                        <Text size="lg-3" className="opacity-50">
                            <i className="fa-solid fa-phone"></i>
                        </Text>
                        <div>
                            {phoneNumbers.map((phone, index) => (
                                <div className="flex flex-col">
                                    <Text key={index} weight="bold">{phone}</Text>
                                    <Text size="sm-3" className="opacity-50">Di động</Text>
                                </div>
                            ))}
                        </div>
                        { authStatus.isOwner && 
                            <div className="ml-auto">
                                <Button variant="secondary" className="!rounded-full !p-0 w-10 h-10">
                                    <i className="fa-solid fa-pencil-alt"></i>
                                </Button>
                            </div>
                        }
                    </div>
                }
            </ProfileAboutSection>
        </div>
    )
}

export default ProfileOverview;