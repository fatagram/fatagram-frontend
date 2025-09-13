import React from "react";
import Button from "../../ui/Button";
import Text from "../../ui/Text";
import { useNavigate } from "react-router-dom";
import { useActiveRoute } from "@/hooks/useActiveRoute";

export type SubNavbarItemProps = {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    path: string;
}

const SubNavbarItem: React.FC<SubNavbarItemProps> = ({
    icon,
    title,
    description,
    path
}) => {
    const navigate = useNavigate();
    const isFocused = useActiveRoute(path, true);

    return (
        <div className="flex items-center w-full">
            <Button variant="third" 
                onClick={() => navigate(path)}
                className={`!w-full text-left !px-3 !py-[5px] bg-transparent 
                   ${ isFocused ? 
                    "!bg-single-main/25" :
                    "hover:!bg-single-main/5"
                   }   
                `}    
            >
                <div className="grid grid-cols-10 items-start">
                    { icon && <Text size="md-2" className="flex justify-center items-center h-full col-span-2">{icon}</Text> }
                    <div className="col-span-8">
                        <Text size="sm-3" className={` ${isFocused ? "!text-single-second !font-bold" : ""}`}>{title}</Text>
                        {description && <Text size="sm-1" weight="light">{description}</Text>}
                    </div>
                </div>
            </Button>
        </div>
    )
}

export default SubNavbarItem;