import React from "react";
import NavbarItem from "./navbar-item";
import { Stack } from "@/components/atoms";
import { Scale } from "lucide-react";

interface NavbarFooterProps {
  className?: string;
  children?: React.ReactNode;
  isAuthenticated: boolean | null;
}

const NavbarFooter: React.FC<NavbarFooterProps> = ({ className, isAuthenticated }) => {
  const navItems: { icon: React.ReactNode; path: string }[] = [
    { icon: <i className="fa-solid fa-house"></i>, path: "/" },
    { icon: <i className="fa-solid fa-user-group"></i>, path: "/friends" },
  ];
  return (
    <Stack
      space={3}
      className={`bg-[var(--third-bg-color)] w-full py-1
                ${className}`}
    >
      {isAuthenticated && (
        <Stack space={3} align="center" className="flex-1">
          <Stack
            justify="center"
            direction="right"
            className="w-full"
            mdProps={{
              className: "w-auto",
            }}
          >
            {navItems.map((item, index) => (
              <NavbarItem path={item.path} key={index}>
                {item.icon}
              </NavbarItem>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default NavbarFooter;
