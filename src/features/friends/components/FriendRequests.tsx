import { userService } from "@/api/user/user.api";
import Card from "@/components/common/container/Card";
import FriendRequestItem from "@/components/common/container/Card/FriendRequestItem/FriendRequestItem";
import Text from "@/components/common/ui/Text";
import { TimeUnit, TimeUnitTranslateMap } from "@/utils/time_unit";
import React, { useCallback } from "react";
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

    const [page, setPage] = React.useState(1);
    const [limit] = React.useState(12);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isFull, setIsFull] = React.useState(false);
    const loaderRef = React.useRef<HTMLDivElement>(null);
    const [total, setTotal] = React.useState(0);

    const { t } = useTranslation() as { t: (key: string, options?: any) => string };

    const fetchFriendRequests = React.useCallback(async () => {
        setIsLoading(true);
        const response = await userService.GetFriendRequests(page, limit);
        if (response.success) {
            setRequests(prev => [...prev, ...response.data?.friendRequests ?? []]);
            setTotal(response.data?.total ?? 0);
            if (response.data?.friendRequests.length && response.data?.friendRequests.length < limit) {
                setIsFull(true);
            }
        }
        setIsLoading(false);
    }, [page, limit]);

    React.useEffect(() => {
        setIsLoading(true);
        fetchFriendRequests();
    }, [fetchFriendRequests]);

    React.useEffect(() => {
        // random number and set for total
        const randomTotal = Math.floor(Math.random() * 100) + 1;
        setTotal(randomTotal);
    }, [])

    React.useEffect(() => {
        if (!loaderRef.current || isFull) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setPage((prev) => prev + 1); 
            }
        });

        observer.observe(loaderRef.current); 
        return () => observer.disconnect(); 
    }, [loaderRef, isFull]);

    const handleAcceptRequest = useCallback(async (requestId: string) => {
        const response = await userService.AcceptAddFriendRequest(requestId);
        if (response.success) {
            setRequests((prevRequests) => prevRequests.filter((request) => request.senderId !== requestId));
        }
    }, []);

    const handleRejectRequest = useCallback(async (senderId: string) => {
        const response = await userService.DeclineAddFriendRequest(senderId);
        if (response.success) {
            setRequests((prevRequests) => prevRequests.filter((request) => request.senderId !== senderId));
        }
    }, []);

    return (
        <Card title={`Danh sách lời mời (${total})` } className={`${className}`}>
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

            <div ref={loaderRef} className="w-full h-0" />
            { isLoading && 
                <div className="flex justify-center items-center w-full h-10 gap-1 mt-5">
                    <span className="w-2 h-2 rounded-full bg-[var(--text-color)] animate-bounce [animation-delay:0s]"></span>
                    <span className="w-2 h-2 rounded-full bg-[var(--text-color)] animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-[var(--text-color)] animate-bounce [animation-delay:0.4s]"></span>
                </div>
            }
        </Card>
    );
};

export default React.memo(FriendRequests);