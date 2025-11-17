import React from "react";
import { useNavigate } from "react-router-dom";
import { useActiveRoute } from "@/hooks/use-active-route";
import { Text } from "@/components/atoms";
import clsx from "clsx";

export type SubNavbarItemProps = {
  title?: string;
  path: string;
  onClick?: () => void;
};

export const SubNavbarItem: React.FC<SubNavbarItemProps> = ({ title, path, onClick }) => {
  const navigate = useNavigate();
  const isFocused = useActiveRoute(path, true);

  return (
    <button
      onClick={() => {
        navigate(path);
        onClick?.();
      }}
      className={clsx(
        "w-full text-left py-2 px-3 rounded-lg",
        { "bg-primary-500/15": isFocused },
        "hover:bg-primary-500/15 cursor-pointer",
      )}
    >
      <div className={clsx("flex flex-col gap-1")}>
        <Text
          sz="sm-3"
          className={clsx({
            "!text-primary-500 !font-bold": isFocused,
          })}
        >
          {title}
        </Text>
      </div>
    </button>
  );
};
