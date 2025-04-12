import React, { RefObject, useEffect, useRef, useState } from "react";
import Button from "../../../../components/common/Button/Button";
import Avatar from "../../../../components/common/Avatar/Avatar";
import { ProfileService } from "../../services/Profile/ProfileService";
import useClickOutside from "../../../../hooks/useClickOutside";
import Label from "../../../../components/common/Label/Label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { removeRefreshToken } from "../../../../utils/token";
import AuthService from "../../../auth/services/AuthService";

const ProfileMenu: React.FC = () => {

    const [avatar, setAvatar] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();
    const { setAuthenticated } = useAuth();


    const fetchAvatar = async() => {
        const profileService = new ProfileService();
        const response = await profileService.GetProfile(localStorage.getItem('userId') || "", "avatar,fullName");
        if (response.success) {
            setAvatar(response.data.infos.avatar);
            setFullName(response.data.infos.fullName);
        }
    }

    const handlePersonalPage = () => {
        const userid = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        const user = username === "null" ? userid : username;
        navigate(`/${user}`, {replace: true});
    }

    const handleLogout = async () => {
        const authService = new AuthService();
        await authService.logout();

        removeRefreshToken();
        setAuthenticated?.(false);

        navigate('/login', {replace: true});
    }

    const handleSettings = () => {
        navigate('/settings');
        setIsOpenMenu(false);
    }

    useClickOutside(menuRef as RefObject<HTMLDivElement>, btnRef as RefObject<HTMLDivElement>, () => {
        if (isOpenMenu) setIsOpenMenu(false);
    });

    useEffect(() => {
        fetchAvatar();
    }, []);

    return (
        <div className="flex items-center justify-center relative" ref={btnRef}>
            <Button variant="secondary" className="!rounded-full !p-1"
                    onClick={() => {
                        setIsOpenMenu(!isOpenMenu);
                    }}
                    >
                <Avatar src={avatar} alt="Profile" size="mini_4"/>
                
            </Button>
                {isOpenMenu && <div className="absolute top-[120%] right-0 bg-[var(--bg-color)] shadow-xl rounded-xl p-2 z-10
                        flex flex-col gap-2 min-w-[300px] min-h-[100px]"    
                                ref={menuRef}>
                        <ul className="flex flex-col gap-2 w-full">
                            <li><Button size="medium" variant="third" 
                                className="flex items-center justify-start gap-3 w-full !pl-3"
                                onClick={handlePersonalPage}>
                                    <Avatar src={avatar} alt="avatar" size="small_1"></Avatar>
                                    <Label size="large" weight="bold">{fullName}</Label>
                                </Button></li>
                            <li className="items-center mx-auto w-[93%] h-[0.5px] bg-[var(--text-color)]"></li>
                            <li><Button size="medium" variant="third" className="flex items-center justify-start w-full gap-3"
                                onClick={handleSettings}>
                                    <i className="fa-solid fa-gear"></i>Settings
                                </Button>
                            </li>
                            <li><Button size="medium" variant="third" className="flex items-center justify-start w-full gap-3 text-red-400"
                                onClick={handleLogout}>
                                <i className="fa-solid fa-right-from-bracket"></i> <span>Log out</span>
                                </Button>
                            </li>
                        </ul>
                </div>}
        </div>
    )
}

export default ProfileMenu;