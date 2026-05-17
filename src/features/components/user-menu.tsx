import React, { RefObject, useCallback, useRef, useState } from "react";
import clsx from "clsx";
import useClickOutside from "@/hooks/use-click-outside";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, Button, Text, BackButton } from "@/components/atoms";
import { Menu, MenuItem, MenuSection } from "@/components/ui/menu";
import { useGetUserAvatar, useGetUserProfile } from "@/features/hooks/use-user-profile";
import { useAuth } from "@/contexts";
import { useMobile } from "@/hooks/use-mobile";
import Transition, { AnimationLib } from "@/components/ui/utils/transition";

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
  const isMobile = useMobile();

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
      <Transition
        show={isOpenMenu}
        animation={AnimationLib.DropdownSlide}
        duration={isMobile ? 180 : 150}
        className={clsx(
          "fixed inset-0 bg-bg-main z-50 flex flex-col p-6 w-full h-[100dvh] overflow-y-auto scrollbar-hide",
          "sm:absolute sm:inset-auto sm:top-[120%] sm:right-0 sm:bg-bg-second sm:shadow-xl sm:rounded-xl",
          "sm:p-3 sm:z-10 sm:flex sm:flex-col sm:gap-2 sm:min-w-[300px] sm:min-h-[100px] sm:w-auto sm:h-auto",
          menuClassName,
        )}
        style={menuStyle}
      >
        <div ref={menuRef} className="flex flex-col w-full h-full">
          <div className="flex items-center justify-between w-full mb-8 sm:hidden shrink-0">
            <BackButton sz="md" onClick={() => setIsOpenMenu(false)} />
            <Text weight="bold" sz="lg" className="text-text-main font-semibold">
              {t("navbar.profileMenu.title") || "Tài khoản"}
            </Text>
            <div className="w-10" />
          </div>

          <div className="flex flex-col items-center text-center mb-8 sm:hidden shrink-0">
            <Avatar
              src={avatarProfile?.infos.avatar ?? ""}
              alt="Profile"
              sz="xl"
              className="border-4 border-primary-500/20 shadow-lg mb-3"
            />
            <Text weight="bold" sz="xl" className="text-text-main">
              {userProfile?.infos.fullName ?? ""}
            </Text>
            <Text sz="sm" className="text-text-third mt-1">
              @{urlName || userId}
            </Text>
          </div>

          <Menu className="w-full bg-bg-second border border-bg-fourth rounded-2xl p-2 shadow-sm sm:bg-transparent sm:border-none sm:rounded-none sm:p-0 sm:shadow-none sm:min-w-[280px]">
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
                className="hidden sm:flex mb-1"
                hideIconContainer={true}
              />

              <div className="hidden sm:block h-[1px] bg-text-main/5 my-1 mx-2" />

              <MenuItem
                icon="fa-solid fa-user"
                title={t("navbar.profileMenu.personalPage")}
                onClick={handlePersonalPage}
                className="sm:hidden flex"
              />

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
      </Transition>
    </div>
  );
};

export default UserMenu;
