import React from "react";
import clsx from "clsx";
import ThemeSettings from "./components/theme-setting";

const ThemeSettingPage: React.FC = () => {
  return (
    <div className={clsx("flex justify-center w-full")}>
      <ThemeSettings className={clsx("w-full")} />
    </div>
  );
};

export default ThemeSettingPage;
