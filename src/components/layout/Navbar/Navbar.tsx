import React, { useCallback } from "react";
import Logo from "@/components/common/ui/Logo/Logo";
import Button from "@/components/common/ui/Button/Button";
import { useAuth } from "@/contexts/AuthContext";
import ProfileMenu from "@/features/user/components/ProfileMenu/ProfileMenu";
import { useNavigate } from "react-router-dom";
import NavbarItem from "./NavbarItem";
import NotificationMenu from "@/features/notifications/components/NotificationMenu/NotificationButton";

interface NavbarProps {
    className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
    const { isAuthenticated, openLoginOverlay, openRegisterOverlay } = useAuth();

    const navItems: { icon: React.ReactNode, path: string }[] = [
        { icon: <i className="fa-solid fa-house"></i>, path: "/" },
        { icon: <i className="fa-solid fa-user-group"></i>, path: "/friends" },
    ]

    const navigate = useNavigate();

    const handleGoToHome = useCallback(() => {
        if (isAuthenticated) {
            navigate("/");
        } else {
            openLoginOverlay();
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className={`flex flex-wrap sm:flex-none py-1 sm:pl-10 sm:pr-10 pl-1 pr-1 bg-[var(--third-bg-color)] gap-3
            ${className}
            shadow-md items-center justify-between`}>
            <div onClick={handleGoToHome} className="cursor-pointer items-center gap-2">
                        <Logo hasSlogan={false} size="medium" />
            </div>
            {isAuthenticated ?
                <div className="flex flex-1 gap-3 items-center">
                    <div className="hidden sm:flex flex-1 justify-center w-full md:w-auto">
                        {navItems.map((item, index) => (
                            <NavbarItem path={item.path} key={index} className="!px-10">
                                {item.icon}
                            </NavbarItem>
                        ))}
                    </div>
                    <div className="flex gap-2 flex-1 sm:flex-none justify-end items-center">
                        <NotificationMenu />
                        <ProfileMenu />
                    </div>
                </div>
                :
                <div className="flex gap-2">
                    <Button size="sm-1" variant="secondary" onClick={() => openLoginOverlay()}>Sign in</Button>
                    <Button size="sm-1" variant="primary" onClick={() => openRegisterOverlay()}>Sign up</Button>
                </div>
            }
        </div>
    )
}

export default Navbar;