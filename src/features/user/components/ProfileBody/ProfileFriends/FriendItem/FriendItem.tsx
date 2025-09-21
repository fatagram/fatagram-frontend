import { FriendDto } from "@/api/user/dto/friend.dto";
import { friendshipService } from "@/api/user/friendship.api";
import Avatar from "@/components/atoms/Avatar";
import useClickOutside from "@/hooks/useClickOutside";
import React, { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AddFriendButton from "../../../ProfileHeader/FriendButton";
import Dropdown from "@/components/molecules/Dropdown";
import Text from "@/components/atoms/Text";

interface FriendItemProps {
    className?: string;
    friendDto: FriendDto;
}

const FriendItem: React.FC<FriendItemProps> = ({
    className = "",
    friendDto
}) => {

    const [isShowDrowdown, setIsShowDropdown] = React.useState<boolean>(false);
    const [isFriend, setIsFriend] = React.useState<boolean>(friendDto.isFriend);
    const navigate = useNavigate();
    const { t } = useTranslation() as { t: (key: string) => string };

    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const btnRef = React.useRef<HTMLButtonElement>(null);

    // Close dropdown when clicking outside
    useClickOutside(dropdownRef as RefObject<HTMLDivElement>, 
        btnRef as RefObject<HTMLButtonElement>, () => {
            if (isShowDrowdown) setIsShowDropdown(false);
        }
    );

    // Accept friend request
    const handleUnfriend = React.useCallback(async (id: string | undefined) => {
        const response = await friendshipService.Unfriend(id ? id : "");
        if (response.success) {
            setIsFriend(false);
        }
    }, [friendshipService]);

    const requestOptions = React.useMemo(() => [
        {
            id: "unfriend",
            content: <div><i className="fa-solid fa-user-xmark mr-2"></i> {t("user:profileHeader.unfriendButton")}</div>,
            onClick: async () => await handleUnfriend?.(friendDto.id)
        }
    ], [friendDto.id, handleUnfriend, t]);

    // console.log("FriendItem render", friendDto);

    return (
        <div className={`relative flex items-center justify-between bg-[var(--second-bg-color)] rounded-xl 
                hover:bg-[var(--fourth-bg-color)] cursor-pointer transition-colors ${className}`}>
            <div className={`relative flex p-3 gap-4 items-center`}
                onClick={() => navigate(`/${friendDto.id}`)}>
                <div>
                    <Avatar alt="Avatar" src={friendDto.avatar ?? undefined} size="small_1"/>
                </div>
                <div className="flex flex-col h-full justify-center flex-1">
                    <Text size="md-2" weight="bold">{friendDto.name}</Text>
                </div>
            </div>
            <div className="relative pr-2">
                { isFriend ? <>
                <button aria-label="More options"
                    ref={btnRef}
                    className="w-10 h-10 rounded-full hover:bg-[var(--main-bg-color)]"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsShowDropdown(!isShowDrowdown);
                    }}>
                        <i className="fa-solid fa-ellipsis-v"></i>
                </button>
                
                <Dropdown isShow={isShowDrowdown}
                    className="absolute flex sm:top-[130%] top-[110%] left-[1%] bg-[var(--main-bg-color)] p-2
                                rounded-lg shadow-md z-10 min-w-[200px] w-[calc(100%-2%)]"
                    ref={dropdownRef}
                    items={requestOptions}
                />
                </> : <AddFriendButton size="sm-1" uid={friendDto.id}/>}
            </div>
        </div>
    )
}

export default FriendItem;