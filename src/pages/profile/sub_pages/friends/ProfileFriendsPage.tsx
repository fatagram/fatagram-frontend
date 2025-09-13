import Card from "@/components/common/container/Card";
import Textbox from "@/components/common/ui/Textbox";
import SearchBox from "@/components/common/ui/Textbox/SearchBox";
import ProfileFriends from "@/features/user/components/ProfileBody/ProfileFriends/ProfileFriends";
import { useOutletContext } from "react-router-dom";
import { AuthStatus } from "../../AuthStatus";
import { useTranslation } from "react-i18next";

const ProfileFriendsPage = () => {
  const { t } = useTranslation() as { t: (key: string) => string };

  return (
    <Card title={t("user:profileFriends.friends")} className="bg-[var(--second-bg-color)] rounded-md mt-2">
        <ProfileFriends/>
    </Card>
  );
}

export default ProfileFriendsPage;