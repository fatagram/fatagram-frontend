import React, { RefObject, useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/common/ui/Button/Button";
import Avatar from "@/components/common/display/Avatar/Avatar";
import { userProfileService } from "@/api/user/user_profile.api";
import useClickOutside from "@/hooks/useClickOutside";
import Text from "@/components/common/ui/Text";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

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
    const fetchProfiles = useCallback(async() => {
        // const profileService = new UserService();
        const response = await userProfileService.GetProfile(userId || "", "avatar,fullName");
        if (response.success) {
            setAvatar(response.data.infos.avatar);
            setFullName(response.data.infos.fullName);
        }
    }, [userId]);

    // Navigation to personal page
    const handlePersonalPage = () => {
        const user = urlName ? urlName : userId;
        navigate(`/${user}`);
        setIsOpenMenu(false);
    }

    // Navigation to settings page
    const handleSettings = () => {
        navigate('/settings');
        setIsOpenMenu(false);
    }
    
    // Logout function
    const handleLogout = async () => {
        await logout?.();
        navigate("/login", {replace: true});
    }

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    return (
        <div className="flex items-center justify-center relative" ref={btnRef}>
            <Button variant="secondary" className="!rounded-full !p-1"
                    onClick={() => {
                        setIsOpenMenu(!isOpenMenu);
                    }}>
                <Avatar src={avatar} alt="Profile" size="mini_4"/>
            </Button>
            {isOpenMenu && 
                <div className="absolute top-[120%] right-0 bg-[var(--bg-color)] shadow-xl rounded-xl 
                    sm:p-2 p-6 z-10
                    flex flex-col gap-2 min-w-[300px] min-h-[100px] sm:w-auto w-screen sm:h-auto h-screen"    
                            ref={menuRef}>
                    <ul className="flex flex-col gap-2 w-full">
                        <li><Button size="medium" variant="third" 
                            className="flex items-center justify-start gap-3 w-full !pl-3"
                            onClick={handlePersonalPage}>
                                <Avatar src={avatar} alt="avatar" size="small_1"></Avatar>
                                <Text size="lg" weight="bold">{fullName}</Text>
                            </Button></li>
                        <li className="items-center mx-auto w-[93%] h-[0.5px] bg-[var(--text-color)]"></li>
                        <li><Button size="medium" variant="third" className="flex items-center justify-start w-full gap-3"
                            onClick={handleSettings}>
                                <Text className="flex items-center gap-3" size="md">
                                    <i className="fa-solid fa-gear"></i>{t("navbar.profileMenu.settings")}
                                </Text>
                            </Button>
                        </li>
                        <li><Button size="medium" variant="third" className="flex items-center justify-start w-full gap-3 text-red-400"
                            onClick={handleLogout}>
                                <Text size="md" className="flex items-center gap-3">
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                    {t("navbar.profileMenu.logout")}
                                </Text>
                            </Button>
                        </li>
                    </ul>
            </div>}
        </div>
    )
}

export default ProfileMenu;