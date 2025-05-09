import { UserService } from "@/api/user/user.api";
import Card from "@/components/common/container/Card";
import FriendRequestItem from "@/components/common/container/Card/FriendRequestItem/FriendRequestItem";
import Text from "@/components/common/ui/Text";
import { TimeUnit, TimeUnitTranslateMap } from "@/utils/time_unit";
import React from "react";
import { useTranslation } from "react-i18next";

interface FriendRequestsProps {
    className?: string;
}

const FriendRequests: React.FC<FriendRequestsProps> = ({ className }) => {

    const [requests, setRequests] = React.useState<{
        senderId: string;
        senderUrlName: string;
        senderName: string;
        senderAvatar: string;
        createdAt: {
            value: number,
            unit: TimeUnit
        };
    }[]>([]);

    const { t } = useTranslation() as { t: (key: string, options?: any) => string };

    const userService = React.useMemo(() => new UserService(), []);

    React.useEffect(() => {
        const fetchFriendRequests = async () => {
            const response = await userService.GetFriendRequests(1, 10);
            if (response.success) {
                setRequests(response.data?.friendRequests || []);
            }
        };

        fetchFriendRequests();
    }, [userService]);

    const handleAcceptRequest = async (requestId: string) => {
        const response = await userService.AcceptAddFriendRequest(requestId);
        if (response.success) {
            setRequests((prevRequests) => prevRequests.filter((request) => request.senderId !== requestId));
        }
    }

    const handleRejectRequest = async (senderId: string) => {
        const response = await userService.DeclineAddFriendRequest(senderId);
        if (response.success) {
            setRequests((prevRequests) => prevRequests.filter((request) => request.senderId !== senderId));
        }
    }

    return (
        <Card title="Danh Sách Lời Mời" className={`${className}`}>
            <div className="flex flex-wrap gap-2 h-full w-full">
                {
                    requests.length > 0 ? 
                    <>
                        {requests.map((request, index) => (
                            <FriendRequestItem
                                key={index}
                                name={request.senderName}
                                avatar={request.senderAvatar}
                                path={`/${request.senderUrlName || request.senderId}`}
                                time={
                                    request.createdAt.unit === TimeUnit.Seconds || request.createdAt.unit === TimeUnit.Miliseconds
                                        ? t("times:just_now")
                                        : `${t(`${TimeUnitTranslateMap[request.createdAt.unit]}.${
                                            request.createdAt.value > 1 ? "one" : "other"}`, { count: request.createdAt.value })} 
                                        ${t("times:ago")}`
                                }
                                onAccept={() => handleAcceptRequest(request.senderId)}
                                onCancel={() => handleRejectRequest(request.senderId)}
                            />
                        ))}
                    </> : 
                    <Text size="md-2">
                        {t("friends:friendRequest.noRequests")}
                    </Text>
                }
            </div>
        </Card>
    );
};

export default FriendRequests;