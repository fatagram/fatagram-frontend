import { friendshipService } from "@/api/user/friendship.api";
import Button from "@/components/atoms/Button";
import { Size } from "@/components/common/types/size";
import Dropdown from "@/components/molecules/Dropdown";
import { useAuth } from "@/contexts/AuthContext";
import useClickOutside from "@/hooks/useClickOutside";
import React, { RefObject, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

type FriendButtonProps = {
    uid?: string;
    size?: Size;
}

const FriendButton: React.FC<FriendButtonProps> = ({
    uid,
    size="md-1"
}) => {

    const { t } = useTranslation() as { t: (key: string) => string };

    if (!useAuth().isAuthenticated) return null;
    // console.log(useAuth().userId);

    const [friendshipStatus, setFriendshipStatus] = React.useState<string>("None");
    const [isShowFriendOptions, setIsShowFriendOptions] = React.useState<boolean>(false);
    const [isShowRequestOptions, setIsShowRequestOptions] = React.useState<boolean>(false);

    const btnFriendRef = React.useRef<HTMLButtonElement>(null);
    const btnRequestRef = React.useRef<HTMLButtonElement>(null);
    const friendOptionsRef = React.useRef<HTMLDivElement>(null);
    const requestOptionsRef = React.useRef<HTMLDivElement>(null);

    useClickOutside(friendOptionsRef as RefObject<HTMLDivElement>, 
        btnFriendRef as RefObject<HTMLButtonElement>, () => {
            if (isShowFriendOptions) setIsShowFriendOptions(false);
        }
    );

    useClickOutside(requestOptionsRef as RefObject<HTMLDivElement>, 
        btnRequestRef as RefObject<HTMLButtonElement>, () => {
            if (isShowRequestOptions) setIsShowRequestOptions(false);
        }
    );

    useEffect(() => {
        const fetchFriendshipStatus = async () => {
            const response = await friendshipService.GetFriendshipStatus(uid ? uid : "");
            if (response.success) {
                setFriendshipStatus(response.data?.status ?? "None");
            }
        }
        fetchFriendshipStatus();
    }, [uid, friendshipService, setFriendshipStatus]);  

    const handleSentAddFriendRequest = useCallback(async () => {
            const response = await friendshipService.SendAddFriendRequest(uid ? uid : "");
            if (response.success) {
                setFriendshipStatus("SentByMe");
            }
        }, [uid, friendshipService]);
    
    const handleCancelAddFriendRequest = useCallback(async () => {
        const response = await friendshipService.CancelAddFriendRequest(uid ? uid : "");
        if (response.success) {
            setFriendshipStatus("None");
        }
    }, [uid, friendshipService]);

    const handleAcceptAddFriendRequest = useCallback(async (id: string | undefined) => {
        const response = await friendshipService.AcceptAddFriendRequest(id ? id : "");
        if (response.success) {
            setFriendshipStatus("Friend");
        }
    }, [friendshipService]);

    const handleDeclineAddFriendRequest = useCallback(async (id: string | undefined) => {
        const response = await friendshipService.DeclineAddFriendRequest(id ? id : "");
        if (response.success) {
            setFriendshipStatus("None");
        }
    }, [friendshipService]);

    // Handle unfriend action
    const handleUnfriend = useCallback(async (id: string | undefined) => {
        const response = await friendshipService.Unfriend(id ? id : "");
        if (response.success) {
            setFriendshipStatus("None");
        }
    }, [friendshipService]);

    // Dropdown options for friend actions
    const friendOptions = useMemo(() => [
        {
            id: "unfriend",
            content: <div><i className="fa-solid fa-user-xmark mr-2"></i> {t("user:profileHeader.unfriendButton")}</div>,
            onClick: async () => { await handleUnfriend?.(uid); },
        }
    ], [uid, handleUnfriend, t]);

    // Dropdown options for request actions
    const requestOptions = useMemo(() => [
        {
            id: "acceptRequest",
            content: <div><i className="fa-solid fa-check mr-2"></i> {t("user:profileHeader.acceptButton")}</div>,
            onClick: async () => await handleAcceptAddFriendRequest?.(uid)
        },
        {
            id: "cancelRequest",
            content: <div><i className="fa-solid fa-xmark mr-2"></i> {t("user:profileHeader.declineButton")}</div>,
            onClick: async () => await handleDeclineAddFriendRequest?.(uid)
        }
    ], [uid, handleAcceptAddFriendRequest, handleDeclineAddFriendRequest, t]);

    return (
        <div>
            {friendshipStatus === "None" ? (
                <Button size={size}
                    onClick={handleSentAddFriendRequest}>
                    <i className="fa-solid fa-plus"></i> {t("user:profileHeader.addFriendButton")}
                </Button>
            ) : friendshipStatus === "SentByMe" ? (
                <Button size={size}
                    onClick={handleCancelAddFriendRequest}>
                    <i className="fa-solid fa-xmark"></i> {t("user:profileHeader.cancelRequestButton")}
                </Button>
            ) : friendshipStatus === "SentByThem" ? (
                <div className="sm:relative">
                    <Button size={size} ref={btnRequestRef}
                        onClick={() => { setIsShowRequestOptions(!isShowRequestOptions) }}>
                        <i className="fa-solid fa-reply"></i> {t("user:profileHeader.respondRequestButton")}
                    </Button>
                    <Dropdown ref={requestOptionsRef} isShow={isShowRequestOptions}
                        className="absolute flex sm:top-[130%] top-[110%] left-[1%] bg-[var(--main-bg-color)] p-2
                                                rounded-lg shadow-md z-10 sm:min-w-[200px] w-[calc(100%-2%)]"
                        items={requestOptions} />
                </div>
            ) : (
                <div className="sm:relative z-50">
                    <Button size={size} ref={btnFriendRef}
                        onClick={() => { setIsShowFriendOptions(!isShowFriendOptions) }}>
                        <i className="fa-solid fa-user-check"></i> {t("user:profileHeader.friendButton")}
                    </Button>
                    <Dropdown ref={friendOptionsRef} isShow = {isShowFriendOptions}
                        className="absolute sm:top-[130%] top-[110%] left-[1%] bg-[var(--main-bg-color)] p-2
                                    rounded-lg shadow-md z-[10] sm:min-w-[200px] w-[calc(100%-2%)] "
                        items={friendOptions} />
                </div>
            )} 
        </div>
    )
}

export default FriendButton;