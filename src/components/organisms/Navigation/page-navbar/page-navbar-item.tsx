import React from "react";
import { useNavigate } from "react-router-dom";
import { useActiveRoute } from "@/hooks/use-active-route";
import { Button, Stack, Text } from "@/components/atoms";
import Grid from "@/components/atoms/grid";
import GridItem from "@/components/atoms/grid/grid-item";

export type PageNavbarItemProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  path: string;
  onClick?: () => void;
};

const PageNavbarItem: React.FC<PageNavbarItemProps> = ({
  icon,
  title,
  description,
  path,
  onClick,
}) => {
  const navigate = useNavigate();
  const isFocused = useActiveRoute(path, true);

  return (
    <Stack className="w-full">
      <Button
        variant={isFocused ? "secondary" : "third"}
        onClick={() => {
          navigate(path);
          onClick?.();
        }}
        className="!w-full text-left !px-3"
      >
        <Grid cols={10} flow="col">
          <Grid.Item colSpan={2}>
            <Text sz="lg-1" className="flex justify-center items-center h-full">
              {icon}
            </Text>
          </Grid.Item>
          <Grid.Item colSpan={8}>
            <Text sz="md-2">{title}</Text>
            {description && (
              <Text sz="sm-1" weight="light">
                {description}
              </Text>
            )}
          </Grid.Item>
        </Grid>
      </Button>
    </Stack>
  );
};

export default PageNavbarItem;
