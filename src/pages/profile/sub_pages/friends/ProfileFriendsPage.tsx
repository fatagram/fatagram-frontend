import Card from "@/components/common/container/Card";
import Textbox from "@/components/common/ui/Textbox";
import SearchBox from "@/components/common/ui/Textbox/SearchBox";
import ProfileFriends from "@/features/user/components/ProfileBody/ProfileFriends/ProfileFriends";
import { useOutletContext } from "react-router-dom";
import { AuthStatus } from "../../AuthStatus";

const ProfileFriendsPage = () => {
  const authStatus = useOutletContext<AuthStatus>();
  return (
    <Card title="Friends" className="bg-[var(--second-bg-color)] rounded-md mt-2">
        <ProfileFriends userId={authStatus.userId}/>
    </Card>
  );
}

export default ProfileFriendsPage;