import React from "react";
import { useNavigate } from "react-router-dom";
import { useActiveRoute } from "@/hooks/use-active-route";
import { Button, Stack, Text } from "@/components/atoms";
import Grid from "@/components/atoms/grid";

export type SubNavbarItemProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  path: string;
};

const SubNavbarItem: React.FC<SubNavbarItemProps> = ({ icon, title, description, path }) => {
  const navigate = useNavigate();
  const isFocused = useActiveRoute(path, true);

  return (
    <Button
      variant="third"
      onClick={() => navigate(path)}
      className={`!w-full text-left !px-3 !py-[5px] bg-transparent 
                   ${isFocused ? "!bg-single-main/25" : "hover:!bg-single-main/5"}   
                `}
    >
      <Grid cols={10} className="items-start">
        {icon && (
          <Grid.Item colSpan={2}>
            <Text sz="md-2" className="flex justify-center items-center h-full">
              {icon}
            </Text>
          </Grid.Item>
        )}
        <Grid.Item colSpan={8}>
          <Text sz="sm-3" className={` ${isFocused ? "!text-single-second !font-bold" : ""}`}>
            {title}
          </Text>
          {description && (
            <Text sz="sm-1" weight="light">
              {description}
            </Text>
          )}
        </Grid.Item>
      </Grid>
    </Button>
  );
};

export default SubNavbarItem;
