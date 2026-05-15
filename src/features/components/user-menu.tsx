import React, { RefObject, useCallback, useRef, useState } from "react";
import clsx from "clsx";
import useClickOutside from "@/hooks/use-click-outside";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, Button } from "@/components/atoms";
import { Menu, MenuItem, MenuSection } from "@/components/ui/menu";
import { useGetUserAvatar, useGetUserProfile } from "@/features/hooks/use-user-profile";
import { useAuth } from "@/contexts";

interface UserMenuProps {
  menuClassName?: string;
  menuStyle?: any;
}

/**
 * ProfileMenu component displays a profile menu with options for the user.
 * It includes the user's avatar, full name, and options to navigate to their personal page,
 * settings, and logout.
 * @returns {JSX.Element} The rendered ProfileMenu component.
 */
const UserMenu: React.FC<UserMenuProps> = ({ menuClassName, menuStyle }) => {
  // const [avatar, setAvatar] = useState<string>("");
  // const [fullName, setFullName] = useState<string>("");
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const { userId, urlName, logOut } = useAuth();
  const { t } = useTranslation() as { t: (key: string) => string };

  const navigate = useNavigate();

  const { data: userProfile } = useGetUserProfile(userId!);
  const { data: avatarProfile } = useGetUserAvatar(userId!);
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

  // Navigation to personal page
  const handlePersonalPage = useCallback(() => {
    const user = urlName || userId;
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
          src={avatarProfile?.infos.avatar ?? ""}
          alt="Profile"
          sz="md"
          className="border-4 border-bg-third"
        />
      </Button>
      {isOpenMenu && (
        <div
          className={clsx(
            "absolute top-[120%] right-0 bg-bg-second shadow-xl rounded-xl",
            "p-3 z-10 flex flex-col gap-2 min-w-[300px] min-h-[100px]",
            menuClassName,
          )}
          style={menuStyle}
          ref={menuRef}
        >
          <Menu className="min-w-[280px]">
            <MenuSection>
              <MenuItem
                icon={
                  <Avatar
                    src={avatarProfile?.infos.avatar ?? ""}
                    alt="avatar"
                    sz="md"
                    className="border-2 border-primary-500/20"
                  />
                }
                title={userProfile?.infos.fullName ?? ""}
                description={t("navbar.profileMenu.personalPage")}
                onClick={handlePersonalPage}
                className="mb-2"
                hideIconContainer={true}
              />
            </MenuSection>

            <div className="h-[1px] bg-text-main/5 my-1 mx-2" />

            <MenuSection>
              <MenuItem
                icon="fa-solid fa-gear"
                title={t("navbar.profileMenu.settings")}
                onClick={handleSettings}
              />
              <MenuItem
                icon="fa-solid fa-right-from-bracket"
                title={t("navbar.profileMenu.logout")}
                variant="danger"
                onClick={handleLogout}
              />
            </MenuSection>
          </Menu>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
