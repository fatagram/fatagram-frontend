import React from "react";
import ThemeSettings from "./components/theme-setting";

const ThemeSettingPage: React.FC = () => {
  return (
    <div className="flex justify-center w-full">
      <ThemeSettings className="w-full" />
    </div>
  );
};

export default ThemeSettingPage;
