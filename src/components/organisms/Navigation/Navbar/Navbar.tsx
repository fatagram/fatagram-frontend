import React, { useCallback } from "react";
import ProfileMenu from "@/features/user/components/profile-menu";
import { useNavigate } from "react-router-dom";
import NavbarItem from "./navbar-item";
import NotificationMenu from "@/features/notifications/components/notification-menu/notification-badge";
import { Button, Logo, Stack } from "@/components/atoms";

interface NavbarProps {
  className?: string;
  isAuthenticated: boolean | null;
  onLogin?: () => void;
  onSignup?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ className, isAuthenticated, onLogin, onSignup }) => {
  const navItems: { icon: React.ReactNode; path: string }[] = [
    { icon: <i className="fa-solid fa-house"></i>, path: "/" },
    { icon: <i className="fa-solid fa-user-group"></i>, path: "/friends" },
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
    <Stack
      as="nav"
      direction="right"
      space={3}
      align="center"
      justify="between"
      className={`bg-[var(--third-bg-color)] py-1 px-1
            shadow-md ${className}`}
      smProps={{
        className: "px-8", 
      }}
    >
      <div onClick={handleGoToHome} className=" cursor-pointer items-center gap-2">
        <Logo hasSlogan={false} sz="md-1" />
      </div>
      {isAuthenticated ? (
        <Stack direction="right" space={3} className="flex-1">
          <Stack
            justify="center"
            direction="right"
            className="hidden w-full"
            smProps={{
              className: "flex flex-1",
            }}
          >
            {navItems.map((item, index) => (
              <NavbarItem path={item.path} key={index} className="!px-10">
                {item.icon}
              </NavbarItem>
            ))}
          </Stack>
          <Stack
            space={2}
            className="flex-1"
            direction="right"
            justify="end"
            smProps={{
              className: "flex-none",
            }}
          >
            <NotificationMenu />
            <ProfileMenu />
          </Stack>
        </Stack>
      ) : (
        <Stack space={2} direction="right">
          <Button sz="sm-1" variant="secondary" onClick={() => onLogin?.()}>
            Sign in
          </Button>
          <Button sz="sm-1" variant="primary" onClick={() => onSignup?.()}>
            Sign up
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default Navbar;
