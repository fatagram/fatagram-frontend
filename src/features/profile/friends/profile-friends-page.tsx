import Card from "@/components/ui/card";
import ProfileFriends from "@/features/profile/friends/components/profile-friend";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

const ProfileFriendsPage = () => {
  const { t } = useTranslation() as { t: (key: string) => string };

  return (
    <Card
      title={t("user:profileFriends.friends")}
      className={clsx("sm:rounded-2xl rounded-none sm:mt-2")}
    >
      <ProfileFriends />
    </Card>
  );
};

export default ProfileFriendsPage;
