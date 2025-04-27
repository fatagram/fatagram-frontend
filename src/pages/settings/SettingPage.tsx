import React from "react";
import SettingsNavbar from "../../features/settings/components/SettingsNavbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Text from "@/components/common/ui/Text";

interface SettingPageProps {
  // Define any props if needed
}

const SettingPage: React.FC<SettingPageProps> = () => {

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isShowNavbar, setIsShowNavbar] = React.useState<boolean>(true);

    React.useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login", { replace: true })
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="relative flex flex-col sm:flex-row w-full h-full bg-[var(--bg-color-secondary)] p-2 sm:gap-4 pt-[70px] ">
            <div className="w-full inset-0 z-10 h-[50px] flex sm:hidden px-2">
                <Text size="lg-3"><i className="fa-solid fa-list text-gradient-main" onClick={() => setIsShowNavbar(!isShowNavbar)}></i></Text>
            </div>
            <SettingsNavbar className={`sm:flex sm:w-[300px] sm:relative 
                sm:animate-none animate-left-to-right
                ${isShowNavbar ? "absolute w-[97%] z-50" : "hidden"}  
                shadow-lg rounded-2xl h-full
                bg-[var(--bg-color)] p-2`}
                onSelect={() => setIsShowNavbar(false)}/>
            <div className="sm:col-span-8 flex justify-center flex-1">
                <div className="w-full max-w-[700px] ">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default SettingPage;