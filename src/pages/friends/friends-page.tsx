import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import FriendsNavbar from "@/features/friends/components/friends-navbar";
import { Text } from "@/components/atoms";

interface FriendsPageProps {}

const FriendPage: React.FC<FriendsPageProps> = () => {
  const { t } = useTranslation() as { t: (key: string) => string };
  const [isShowNavbar, setIsShowNavbar] = React.useState<boolean>(true);

  useEffect(() => {
    document.title = t("friends:title");
  }, [t]);

  return (
    <div
      className={clsx(
        "relative flex flex-col sm:flex-row w-full h-full",
        "bg-[var(--second-bg-color)] sm:gap-4",
      )}
    >
      <div className={clsx("w-full inset-0 z-10 h-[50px] flex sm:hidden px-2")}>
        <Text sz="lg-3">
          <i
            className="fa-solid fa-list text-gradient-main"
            onClick={() => setIsShowNavbar(!isShowNavbar)}
          />
        </Text>
      </div>
      {isShowNavbar && (
        <div
          className={clsx("sm:hidden z-9998 block fixed bg-black/50 w-screen h-screen")}
          onClick={() => setIsShowNavbar(false)}
        />
      )}
      <FriendsNavbar
        className={clsx(
          "sm:flex sm:w-[300px] sm:fixed absolute sm:animate-none",
          "animate-left-to-right w-[60%]",
          "shadow-lg h-full bg-[var(--main-bg-color)] p-2",
          {
            "absolute z-30": isShowNavbar,
            hidden: !isShowNavbar,
          },
        )}
        onSelect={() => setIsShowNavbar(false)}
      />
      <div className={clsx("sm:col-span-8 flex justify-center flex-1 ml-[300px]")}>
        <div className={clsx("max-w-[1000px] w-full p-2")}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FriendPage;
