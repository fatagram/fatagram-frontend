import React, { RefObject, useCallback, useRef, useState } from "react";
import clsx from "clsx";
import useClickOutside from "@/hooks/use-click-outside";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { List } from "@/components/atoms/list";
import { Avatar, Button, Text } from "@/components/atoms";
import { useAuth } from "@/hooks/contexts/use-auth";
import { useGetUserAvatar, useGetUserFullName } from "@/features/hooks/use-user-profile";

/**
 * ProfileMenu component displays a profile menu with options for the user.
 * It includes the user's avatar, full name, and options to navigate to their personal page,
 * settings, and logout.
 * @returns {JSX.Element} The rendered ProfileMenu component.
 */
const UserMenu: React.FC = () => {
  // const [avatar, setAvatar] = useState<string>("");
  // const [fullName, setFullName] = useState<string>("");
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const { userId, urlName, logOut } = useAuth();
  const { t } = useTranslation() as { t: (key: string) => string };

  const navigate = useNavigate();

  const { data: avatarData } = useGetUserAvatar(userId || "");
  const { data: fullNameData } = useGetUserFullName(userId || "");

  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = () => {
    if (isOpenMenu) setIsOpenMenu(false);
  };

  useClickOutside(
    menuRef as RefObject<HTMLDivElement>,
    btnRef as RefObject<HTMLDivElement>,
    handleClickOutside,
  );

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     const response = await userProfileService.getProfile(userId || "", "avatar,fullName");
  //     if (response.success) {
  //       setAvatar(response.data.infos.avatar);
  //       setFullName(response.data.infos.fullName);
  //     }
  //   };
  //   fetchProfile();
  // }, [userId]);

  // Navigation to personal page
  const handlePersonalPage = useCallback(() => {
    const user = urlName || userId;
    // console.log("Navigate to personal page: ", user);
    navigate(`/${user}`);
    setIsOpenMenu(false);
  }, [navigate, urlName, userId]);

  // Navigation to settings page
  const handleSettings = useCallback(() => {
    navigate("/settings");
    setIsOpenMenu(false);
  }, [navigate]);

  // Logout function
  const handleLogout = useCallback(async () => {
    await logOut?.();
    navigate("/login", { replace: true });
  }, [logOut, navigate]);

  return (
    <div className={clsx("flex items-center justify-center relative")} ref={btnRef}>
      <Button
        variant="secondary"
        className={clsx("!rounded-full !p-0")}
        onClick={() => {
          setIsOpenMenu(!isOpenMenu);
        }}
      >
        <Avatar
          src={avatarData?.avatar ?? ""}
          alt="Profile"
          sz="sm-1"
          className="border-4 border-bg-third"
        />
      </Button>
      {isOpenMenu && (
        <div
          className={clsx(
            "absolute top-[120%] right-0 bg-bg-second shadow-xl rounded-xl",
            "p-2 z-10 flex flex-col gap-2 min-w-[300px] min-h-[100px]",
            "animate-dropdown-slide origin-top-right",
          )}
          ref={menuRef}
        >
          <List className={clsx("flex flex-col gap-2 w-full")}>
            <List.Item>
              <Button
                sz="md-1"
                variant="secondary"
                className={clsx(
                  "flex items-center justify-start gap-3 w-full !pl-3 py-3",
                  "hover:!bg-bg-fourth transition-all duration-200",
                  "hover:scale-[1.02] active:scale-[0.98]",
                )}
                onClick={handlePersonalPage}
              >
                <Avatar src={avatarData?.avatar ?? ""} alt="avatar" sz="sm-1"></Avatar>
                <Text sz="lg-1" weight="bold">
                  {fullNameData?.fullName ?? ""}
                </Text>
              </Button>
            </List.Item>
            <List.Item
              className={clsx("items-center mx-auto w-[95%] h-[1px] bg-text-main/10 rounded-full")}
            />
            <List.Item>
              <Button
                sz="md-1"
                variant="secondary"
                className={clsx(
                  "flex items-center justify-start w-full gap-3",
                  "hover:!bg-bg-fourth transition-all duration-200",
                  "hover:scale-[1.02] active:scale-[0.98]",
                )}
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
                className={clsx(
                  "flex items-center justify-start w-full gap-3 text-red-400",
                  "hover:!bg-bg-fourth transition-all duration-200",
                  "hover:scale-[1.02] active:scale-[0.98]",
                )}
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
