import React, { useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";
import Text from "@/components/common/ui/Text";
import FriendsNavbar from "@/features/friends/components/FriendsNavbar";
import { useTranslation } from "react-i18next";

interface FriendsPageProps{
  // Define any props if needed
}

const FriendPage: React.FC<FriendsPageProps> = () => {
    const { t } = useTranslation() as { t: (key: string) => string };

    useLayoutEffect(() => {
        document.title = t("friends:title")
    }, [t])
    const [isShowNavbar, setIsShowNavbar] = React.useState<boolean>(true);

    return (
        <div className="relative flex flex-col sm:flex-row w-full h-screen bg-[var(--bg-color-secondary)] 
                sm:px-2 px-0
                sm:gap-4 sm:pt-[70px] pt-[60px]">
            <div className="w-full inset-0 z-10 h-[50px] flex sm:hidden px-2">
                <Text size="lg-3"><i className="fa-solid fa-list text-gradient-main" onClick={() => setIsShowNavbar(!isShowNavbar)}></i></Text>
            </div>
            <FriendsNavbar className={`sm:flex sm:w-[300px] relative
                sm:animate-none animate-left-to-right w-full
                ${isShowNavbar ? "absolute z-30" : "hidden"}  
                shadow-lg rounded-2xl h-full
                bg-[var(--bg-color)] p-2`}
                onSelect={() => setIsShowNavbar(false)}/>
            <div className="sm:col-span-8 flex justify-center flex-1 overflow-y-auto h-full">
                <div className="max-w-[1000px] w-full sm:p-0 p-4">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default FriendPage;