import React, { useLayoutEffect } from "react";
import SettingsNavbar from "../../features/settings/components/settings-navbar";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/atoms";
import clsx from "clsx";

type SettingPageProps = {
  // Define any props if needed
};

const SettingPage: React.FC<SettingPageProps> = () => {
  const { t } = useTranslation() as { t: (key: string) => string };

  useLayoutEffect(() => {
    document.title = t("settings:title");
  }, [t]);

  const [isShowNavbar, setIsShowNavbar] = React.useState<boolean>(true);

  return (
    <div
      className={clsx(
        "relative flex flex-col sm:flex-row w-full h-full bg-[var(--second-bg-color)] sm:gap-4",
      )}
    >
      <div className={clsx("w-full inset-0 z-10 h-[50px] flex sm:hidden px-2")}>
        <Text sz="lg-3">
          <i
            className="fa-solid fa-list text-gradient-main"
            onClick={() => setIsShowNavbar(!isShowNavbar)}
          ></i>
        </Text>
      </div>
      {isShowNavbar && (
        <div
          className={clsx("sm:hidden z-9998 block fixed bg-black/50 w-screen h-screen")}
          onClick={() => setIsShowNavbar(false)}
        />
      )}
      <SettingsNavbar
        className={clsx(
          "sm:flex sm:w-[300px] sm:fixed absolute h-full sm:animate-none animate-left-to-right w-[60%] shadow-lg bg-[var(--main-bg-color)] p-2",
          {
            "absolute z-30": isShowNavbar,
            hidden: !isShowNavbar,
          },
        )}
        onSelect={() => setIsShowNavbar(false)}
      />
      <div className={clsx("sm:col-span-8 flex justify-center flex-1 ml-[300px]")}>
        <div className={clsx("w-full max-w-[700px] p-2")}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
