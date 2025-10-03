import React, { RefObject, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
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
const UserMenu: React.FC = () => {
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
    // console.log(userId);
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
    <div className={clsx("flex items-center justify-center relative")} ref={btnRef}>
      <Button
        variant="secondary"
        className={clsx("!rounded-full !p-0")}
        onClick={() => {
          setIsOpenMenu(!isOpenMenu);
        }}
      >
        <Avatar border={2} src={avatar} alt="Profile" sz="sm-1" />
      </Button>
      {isOpenMenu && (
        <div
          className={clsx(
            "absolute top-[120%] right-0 bg-bg-second shadow-xl rounded-xl",
            "p-2 z-10 flex flex-col gap-2 min-w-[300px] min-h-[100px]"
          )}
          ref={menuRef}
        >
          <List className={clsx("flex flex-col gap-2 w-full")}>
            <List.Item>
              <Button
                sz="md-1"
                variant="secondary"
                className={clsx("flex items-center justify-start gap-3 w-full !pl-3 py-3 hover:!bg-bg-fourth")}
                onClick={handlePersonalPage}
              >
                <Avatar src={avatar} alt="avatar" sz="sm-1"></Avatar>
                <Text sz="lg-1" weight="bold">
                  {fullName}
                </Text>
              </Button>
            </List.Item>
            <List.Item
              className={clsx(
                "items-center mx-auto w-[95%] h-1 bg-text-main/20 rounded-full"
              )}
            ></List.Item>
            <List.Item>
              <Button
                sz="md-1"
                variant="secondary"
                className={clsx("flex items-center justify-start w-full gap-3 hover:!bg-bg-fourth")}
                onClick={handleSettings}
              >
                <Text className={clsx("flex items-center gap-3")} sz="md-1">
                  <i className="fa-solid fa-gear"></i>
                  {t("navbar.profileMenu.settings")}
                </Text>
              </Button>
            </List.Item>
            <List.Item>
              <Button
                sz="md-1"
                variant="secondary"
                className={clsx("flex items-center justify-start w-full gap-3 text-red-400 hover:!bg-bg-fourth")}
                onClick={handleLogout}
              >
                <Text sz="md-1" className={clsx("flex items-center gap-3")} color="danger">
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

export default UserMenu;
