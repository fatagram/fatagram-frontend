import React, { useLayoutEffect } from "react";
import SettingsNavbar from "../../features/settings/components/SettingsNavbar";
import { Outlet } from "react-router-dom";
import Text from "@/components/atoms/Text";
import { useTranslation } from "react-i18next";

type SettingPageProps = {
  // Define any props if needed
}

const SettingPage: React.FC<SettingPageProps> = () => {

    const { t } = useTranslation() as { t: (key: string) => string };

    useLayoutEffect(() => {
        document.title = t("settings:title")
    }, [t])

    const [isShowNavbar, setIsShowNavbar] = React.useState<boolean>(true);

    return (
        <div className="relative flex flex-col sm:flex-row w-full h-full bg-[var(--second-bg-color)] 
                sm:px-2 px-0
                sm:gap-4 sm:pt-[70px] pt-[60px]">
            <div className="w-full inset-0 z-10 h-[50px] flex sm:hidden px-2">
                <Text size="lg-3"><i className="fa-solid fa-list text-gradient-main" onClick={() => setIsShowNavbar(!isShowNavbar)}></i></Text>
            </div>
            {isShowNavbar && <div className="sm:hidden z-9998 block fixed bg-black/50 w-screen h-screen"
                onClick={() => setIsShowNavbar(false)}
            />}
            <SettingsNavbar className={`sm:flex sm:w-[300px] sm:relative absolute
                sm:animate-none animate-left-to-right w-[60%]
                ${isShowNavbar ? "absolute z-30" : "hidden"}  
                shadow-lg sm:rounded-2xl rounded-e-2xl h-[80vh]
                bg-[var(--main-bg-color)] p-2`}
                onSelect={() => setIsShowNavbar(false)}/>
            <div className="sm:col-span-8 flex justify-center flex-1">
                <div className="w-full max-w-[700px] sm:p-0 p-4">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default SettingPage;