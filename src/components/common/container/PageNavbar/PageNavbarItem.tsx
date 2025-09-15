import React from "react";
import Button from "../../ui/Button";
import Text from "../../ui/Text";
import { useNavigate } from "react-router-dom";
import { useActiveRoute } from "@/hooks/useActiveRoute";

export type PageNavbarItemProps = {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    path: string;
    onClick?: () => void;
}

const PageNavbarItem: React.FC<PageNavbarItemProps> = ({
    icon,
    title,
    description,
    path,
    onClick
}) => {
    const navigate = useNavigate();
    const isFocused = useActiveRoute(path, true);

    return (
        <div className="flex items-center w-full">
            <Button variant={isFocused ? "secondary" : "third"}
                onClick={() => {
                    navigate(path);
                    onClick?.();
                }}
                className="!w-full text-left !px-3">
                <div className="grid grid-cols-10 items-start">
                    <Text size="lg-1" className="flex justify-center items-center h-full col-span-2">{icon}</Text>
                    <div className="col-span-8">
                        <Text size="md-2">{title}</Text>
                        {description && <Text size="sm-1" weight="light">{description}</Text>}
                    </div>
                </div>
            </Button>
        </div>
    )
}

export default PageNavbarItem;