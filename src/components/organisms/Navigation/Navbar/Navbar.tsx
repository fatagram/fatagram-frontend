import React, { useCallback } from "react";
import ProfileMenu from "@/features/user/components/user-menu";
import { useNavigate } from "react-router-dom";
import NotificationMenu from "@/features/notifications/components/notification-menu/notification-badge";
import { Button, Logo } from "@/components/atoms";
import clsx from "clsx";
import NavbarItem from "./navbar-item";

interface NavbarProps {
  className?: string;
  isAuthenticated: boolean | null;
  onLogin?: () => void;
  onSignup?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ className, isAuthenticated, onLogin, onSignup }) => {
  const navItems: { icon: React.ReactNode; path: string; isIndex: boolean }[] = [
    { icon: <i className="fa-solid fa-house"></i>, path: "/", isIndex: true },
    { icon: <i className="fa-solid fa-user-group"></i>, path: "/friends", isIndex: false },
  ];

  const navigate = useNavigate();

  const handleGoToHome = useCallback(() => {
    if (isAuthenticated) {
      navigate("/");
    } else {
      onLogin?.();
    }
  }, [isAuthenticated, navigate]);

  return (
    <nav
      className={clsx(
        "flex items-center justify-between",
        "bg-bg-main p-[2px] shadow-md sm:px-8",
        className
      )}
    >
      <div onClick={handleGoToHome} className="cursor-pointer items-center gap-2">
        <Logo hasSlogan={false} sz="sm-3" />
      </div>
      {isAuthenticated ? (
        <div className="flex flex-row gap-3 flex-1">
          <div
            className={clsx(
              "hidden w-full justify-center flex-row",
              "sm:flex sm:flex-1"
            )}
          >
            {navItems.map((item, index) => (
              <NavbarItem path={item.path} key={index} className="!px-10" activeRoute={item.isIndex}>
                {item.icon}
              </NavbarItem>
            ))}
          </div>
          <div className={clsx("flex flex-row gap-2 flex-1 justify-end sm:flex-none")}>
            <NotificationMenu />
            <ProfileMenu />
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-2">
          <Button sz="sm-1" variant="secondary" onClick={() => onLogin?.()}>
            Sign in
          </Button>
          <Button sz="sm-1" variant="primary" onClick={() => onSignup?.()}>
            Sign up
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
