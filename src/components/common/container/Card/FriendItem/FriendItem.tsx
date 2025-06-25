import { FriendDto } from "@/api/user/dto/friend.dto";
import Avatar from "@/components/common/display/Avatar";
import Text from "@/components/common/ui/Text";
import { useNavigate } from "react-router-dom";

interface FriendItemProps {
    className?: string;
    friendDto: FriendDto;
}

const FriendItem: React.FC<FriendItemProps> = ({
    className = "",
    friendDto
}) => {

    const navigate = useNavigate();

    return (
        <div className={`flex bg-[var(--second-bg-color)] rounded-xl p-3 gap-4 items-center 
            hover:bg-[var(--fourth-bg-color)] cursor-pointer transition-colors ${className}`}
            onClick={() => navigate(`/${friendDto.id}`)}>
            <div>
                <Avatar alt="Avatar" src={friendDto.avatar ?? undefined} size="small_3"/>
            </div>
            <div className="flex flex-col h-full justify-center flex-1">
                <Text size="md-2" weight="bold">{friendDto.name}</Text>
            </div>
        </div>
    )
}

export default FriendItem;