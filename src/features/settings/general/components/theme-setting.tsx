import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts";
import { SidebarPageCard } from "@/features/components/sidebar-page-layout";
import { Text } from "@/components/atoms";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface ThemeSettingsProps {}

const ThemeSettings: React.FC<ThemeSettingsProps> = () => {
  const { availableThemes, theme: currentGlobalTheme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <SidebarPageCard title={t("settings:theme.title")}>
      <div className="flex flex-col gap-4 w-full">
        <Text sz="lg" className="font-semibold text-text-main pl-1">
          {t("settings:theme.selectTheme")}
        </Text>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
          {availableThemes.map((tOpt) => {
            const isActive = currentGlobalTheme === tOpt.key;
            let gradientClass = "";
            let primaryLight = "";
            let primaryMain = "";
            let bgMain = "";
            let bgSecond = "";

            if (tOpt.key === "system") {
              gradientClass = "bg-gradient-to-tr from-[#3ebf6a] to-[#ff6b8b]";
              primaryLight = "#ffbac7";
              primaryMain = "#ff6b8b";
              bgMain = "#fffafb";
              bgSecond = "#141012";
            } else if (tOpt.key === "light") {
              gradientClass = "bg-gradient-to-tr from-[#3ebf6a] to-[#ff6b8b]";
              primaryLight = "#ffbac7";
              primaryMain = "#ff6b8b";
              bgMain = "#fffafb";
              bgSecond = "#fcf4f6";
            } else if (tOpt.key === "dark") {
              gradientClass = "bg-gradient-to-tr from-[#3ebf6a] to-[#ff6b8b]";
              primaryLight = "#ffbac7";
              primaryMain = "#ff6b8b";
              bgMain = "#141012";
              bgSecond = "#1c1619";
            } else if (tOpt.key === "light-old") {
              gradientClass = "bg-gradient-to-tr from-[#8dfeda] via-[#3dba84] to-[#2aacb0]";
              primaryLight = "#99f6e4";
              primaryMain = "#14b8a6";
              bgMain = "#ffffff";
              bgSecond = "#f9fafb";
            } else if (tOpt.key === "dark-old") {
              gradientClass = "bg-gradient-to-tr from-[#8dfeda] via-[#3dba84] to-[#2aacb0]";
              primaryLight = "#99f6e4";
              primaryMain = "#14b8a6";
              bgMain = "#000000";
              bgSecond = "#121212";
            } else if (tOpt.key === "pastel-yellow-pink") {
              gradientClass = "bg-gradient-to-tr from-[#fef08a] to-[#fbcfe8]";
              primaryLight = "#fef08a";
              primaryMain = "#ffb428";
              bgMain = "#fff0f8";
              bgSecond = "#ffebf5";
            } else if (tOpt.key === "pastel-peach-red") {
              gradientClass = "bg-gradient-to-tr from-[#fed7aa] to-[#fca5a5]";
              primaryLight = "#fed7aa";
              primaryMain = "#ff6950";
              bgMain = "#fffaf8";
              bgSecond = "#fff2ee";
            }

            return (
              <button
                key={tOpt.key}
                onClick={() => setTheme(tOpt.key)}
                className={clsx(
                  "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 w-full",
                  "hover:scale-[1.02] active:scale-95 cursor-pointer relative overflow-hidden",
                  isActive
                    ? "border-primary-500 bg-primary-50/10 shadow-md"
                    : "border-border-main hover:border-text-third bg-bg-third/30",
                )}
              >
                <div className="w-14 h-14 rounded-full overflow-hidden flex border border-border-main/50 shadow-inner">
                  {tOpt.key === "system" ? (
                    <svg viewBox="0 0 56 56" className="w-full h-full flex-shrink-0">
                      <defs>
                        <mask id="moon-mask">
                          <circle cx="38" cy="28" r="10" fill="#ffffff" />
                          <circle cx="33" cy="28" r="10" fill="#000000" />
                        </mask>
                      </defs>
                      <path d="M28,0 A28,28 0 0,0 28,56 Z" fill="#fffafb" />
                      <path d="M28,0 A28,28 0 0,1 28,56 Z" fill="#141012" />
                      <circle cx="18" cy="28" r="8" fill="#ff6b8b" />
                      <path
                        d="M18,14 L18,16 M6,28 L8,28 M18,40 L18,42"
                        stroke="#3ebf6a"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.5,19.5 L10.9,20.9 M9.5,36.5 L10.9,35.1"
                        stroke="#3ebf6a"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="38" cy="28" r="10" fill="#ffbac7" mask="url(#moon-mask)" />
                    </svg>
                  ) : (
                    <>
                      <div className={clsx("w-1/2 h-full", gradientClass)} />
                      <div className="w-1/2 h-full flex flex-col">
                        <div className="flex-1 flex">
                          <div className="flex-1" style={{ backgroundColor: primaryLight }} />
                          <div className="flex-1" style={{ backgroundColor: primaryMain }} />
                        </div>
                        <div className="flex-1 flex">
                          <div className="flex-1" style={{ backgroundColor: bgMain }} />
                          <div className="flex-1" style={{ backgroundColor: bgSecond }} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <Text
                  sz="sm"
                  weight={isActive ? "bold" : "medium"}
                  className="text-center text-text-main"
                >
                  {t(tOpt.label)}
                </Text>
                {isActive && (
                  <div className="absolute top-2 right-2 bg-primary-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-fade-in">
                    <FontAwesomeIcon icon={faCheck} className="text-[10px]"  />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </SidebarPageCard>
  );
};

export default ThemeSettings;
