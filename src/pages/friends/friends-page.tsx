import React, { useLayoutEffect } from "react";
import Text from "@/components/atoms/text";
import { Outlet } from "react-router-dom";
import FriendsNavbar from "@/features/friends/components/friends-navbar";
import { useTranslation } from "react-i18next";

interface FriendsPageProps {}

const FriendPage: React.FC<FriendsPageProps> = () => {
  const { t } = useTranslation() as { t: (key: string) => string };

  useLayoutEffect(() => {
    document.title = t("friends:title");
  }, [t]);

  const [isShowNavbar, setIsShowNavbar] = React.useState<boolean>(true);

  return (
    <div
      className="relative flex flex-col sm:flex-row w-full h-full bg-[var(--second-bg-color)] 
                sm:gap-4"
    >
      <div className="w-full inset-0 z-10 h-[50px] flex sm:hidden px-2">
        <Text sz="lg-3">
          <i
            className="fa-solid fa-list text-gradient-main"
            onClick={() => setIsShowNavbar(!isShowNavbar)}
          />
        </Text>
      </div>
      {isShowNavbar && (
        <div
          className="sm:hidden z-9998 block fixed bg-black/50 w-screen h-screen"
          onClick={() => setIsShowNavbar(false)}
        />
      )}
      <FriendsNavbar
        className={`sm:flex sm:w-[300px] sm:fixed absolute
                h-full
                sm:animate-none animate-left-to-right w-[60%]
                ${isShowNavbar ? "absolute z-30" : "hidden"}  
                shadow-lg rounded-e-2xl h-[80vh]
                bg-[var(--main-bg-color)] p-2`}
        onSelect={() => setIsShowNavbar(false)}
      />
      <div className="sm:col-span-8 flex justify-center flex-1 ml-[300px]">
        <div className="max-w-[1000px] w-full sm:p-0 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FriendPage;
