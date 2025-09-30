import React, { RefObject, useCallback, useEffect, useRef, useState } from "react";
import Avatar from "@/components/atoms/avatar/avatar";
import { userProfileService } from "@/api/user/user-profile.api";
import useClickOutside from "@/hooks/use-click-outside";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth/auth-context";
import { useTranslation } from "react-i18next";
import Text from "@/components/atoms/text";
import Button from "@/components/atoms/button";
import { List } from "@/components/atoms/list";

/**
 * ProfileMenu component displays a profile menu with options for the user.
 * It includes the user's avatar, full name, and options to navigate to their personal page,
 * settings, and logout.
 * @returns {JSX.Element} The rendered ProfileMenu component.
 */
const ProfileMenu: React.FC = () => {
  // States
  const [avatar, setAvatar] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

  // Refs
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  // Other hooks
  const navigate = useNavigate();
  const { userId, urlName, logout } = useAuth();
  const { t } = useTranslation() as { t: (key: string) => string };
  // Click outside hook to close the menu
  useClickOutside(menuRef as RefObject<HTMLDivElement>, btnRef as RefObject<HTMLDivElement>, () => {
    if (isOpenMenu) setIsOpenMenu(false);
  });

  // Fetch user avatar and full name
  const fetchProfiles = useCallback(async () => {
    // const profileService = new UserService();
    const response = await userProfileService.GetProfile(userId || "", "avatar,fullName");
    console.log(userId);
    if (response.success) {
      setAvatar(response.data.infos.avatar);
      setFullName(response.data.infos.fullName);
    }
  }, [userId]);

  // Navigation to personal page
  const handlePersonalPage = () => {
    const user = urlName || userId;
    // console.log("Navigate to personal page: ", user);
    navigate(`/${user}`);
    setIsOpenMenu(false);
  };

  // Navigation to settings page
  const handleSettings = () => {
    navigate("/settings");
    setIsOpenMenu(false);
  };

  // Logout function
  const handleLogout = async () => {
    await logout?.();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return (
    <div className="flex items-center justify-center relative" ref={btnRef}>
      <Button
        variant="secondary"
        className="!rounded-full !p-0"
        onClick={() => {
          setIsOpenMenu(!isOpenMenu);
        }}
      >
        <Avatar border={2} src={avatar} alt="Profile" sz="sm-1" />
      </Button>
      {isOpenMenu && (
        <div
          className="absolute top-[120%] right-0 bg-[var(--main-bg-color)] shadow-xl rounded-xl 
                    p-2 z-10
                    flex flex-col gap-2 min-w-[300px] min-h-[100px]"
          ref={menuRef}
        >
          <List className="flex flex-col gap-2 w-full">
            <List.Item>
              <Button
                sz="md-1"
                variant="third"
                className="flex items-center justify-start gap-3 w-full !pl-3"
                onClick={handlePersonalPage}
              >
                <Avatar src={avatar} alt="avatar" sz="sm-1"></Avatar>
                <Text sz="lg-1" weight="bold">
                  {fullName}
                </Text>
              </Button>
            </List.Item>
            <List.Item className="items-center mx-auto w-[93%] h-[0.5px] bg-[var(--text-color)]"></List.Item>
            <List.Item>
              <Button
                sz="md-1"
                variant="third"
                className="flex items-center justify-start w-full gap-3"
                onClick={handleSettings}
              >
                <Text className="flex items-center gap-3" sz="md-1">
                  <i className="fa-solid fa-gear"></i>
                  {t("navbar.profileMenu.settings")}
                </Text>
              </Button>
            </List.Item>
            <List.Item>
              <Button
                sz="md-1"
                variant="third"
                className="flex items-center justify-start w-full gap-3 text-red-400"
                onClick={handleLogout}
              >
                <Text sz="md-1" className="flex items-center gap-3" color="danger">
                  <i className="fa-solid fa-right-from-bracket"></i>
                  {t("navbar.profileMenu.logout")}
                </Text>
              </Button>
            </List.Item>
          </List>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
