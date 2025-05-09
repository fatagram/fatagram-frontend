import React from "react";
import Button from "../../ui/Button";
import Text from "../../ui/Text";
import { useNavigate } from "react-router-dom";
import { useSubActiveRoute } from "@/hooks/useSubActiveRoute";

interface PageNavbarItemProps {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    path: string;
}

const PageNavbarItem: React.FC<PageNavbarItemProps> = ({
    icon,
    title,
    description,
    path
}) => {
    const navigate = useNavigate();
    const isFocused = useSubActiveRoute(path);

    return (
        <div className="flex items-center w-full">
            <Button variant={isFocused ? "secondary" : "third"}
                onClick={() => navigate(path)}
                className="!w-full text-left !px-3">
                <div className="grid grid-cols-10 items-start">
                    <Text size="lg" className="flex justify-center items-center h-full col-span-2">{icon}</Text>
                    <div className="col-span-8">
                        <Text size="md-2">{title}</Text>
                        {description && <Text size="sm" weight="light">{description}</Text>}
                    </div>
                </div>
            </Button>
        </div>
    )
}

export default PageNavbarItem;