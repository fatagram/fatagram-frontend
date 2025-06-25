import { FriendDto, FriendsDto } from "@/api/user/dto/friend.dto";
import FriendItem from "@/components/common/container/Card/FriendItem/FriendItem";
import SearchBox from "@/components/common/ui/Textbox/SearchBox";
import useFriends from "@/features/user/hooks/useFriends";
import React, { useEffect } from "react";

interface ProfileFriendsProps {
    className?: string;
    userId?: string;
}

const ProfileFriends: React.FC<ProfileFriendsProps> = ({
    className = "",
    userId
}) => {

    const [friends, setFriends] = React.useState<FriendDto[]>([]);
    const [page, setPage] = React.useState<number>(1);
    const [pageSize, setPageSize] = React.useState<number>(12);
    const [isFull, setIsFull] = React.useState<boolean>(false);
    const [keyword, setKeyword] = React.useState<string>("");
    
    const { isLoading, refetch } = useFriends({
        userId: userId || "",
        keyword: keyword,
        page: page,
        pageSize: pageSize
    });

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log("Search keyword:", e.target.value);
        setKeyword(e.target.value);
        setPage(1);
        setIsFull(false);
    }

    useEffect(() => {
        const fetchFriends = async () => {
            const result = await refetch();
            if (page === 1) {
                setFriends(result.data?.friends || []);
            } else {
                setFriends(prev => [...prev, ...(result.data?.friends || [])]);
            }
            if ((result.data?.friends || []).length < pageSize) {
                setIsFull(true);
            }
        };
        fetchFriends();
    }, [page, keyword])

    return (
        <div className={`flex flex-1 justify-end ${className} flex-col w-full`}>
            <SearchBox placeholder="Search friends" className="p-1"
                onChange={handleOnChange}
            />
            <div className="relative flex flex-wrap gap-2 w-full mt-2">
                {friends.map((friend, index) => (
                    <FriendItem className="w-[calc(50%-4px)]" friendDto={friend} key={index} />    
                ))}
            </div>
        </div>
    )
}

export default ProfileFriends;