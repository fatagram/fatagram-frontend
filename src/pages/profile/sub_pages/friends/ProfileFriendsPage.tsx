import Card from "@/components/molecules/Card";
import ProfileFriends from "@/features/user/components/ProfileBody/ProfileFriends/ProfileFriends";
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