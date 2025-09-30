import React, { createContext, useContext, useEffect, useState } from "react";
import themesJson from "@/themes/themes.json";

// Json
const themes = themesJson as Record<string, any>;

// type of Theme
export type Theme = keyof typeof themes;

// ThemeOption
export interface ThemeOption {
  theme: Theme;
  display: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const getLocalStorageTheme = (): Theme => {
    const theme = localStorage.getItem("theme");
    return theme && theme in themes ? (theme as Theme) : "default";
  };
  const [theme, setTheme] = useState<Theme>(getLocalStorageTheme);
  const [availableThemes, setAvailableThemes] = useState<ThemeOption[]>([]);

  const handleTheme = (theme: Theme) => setTheme(theme);

  // Init availabla themes
  useEffect(() => {
    const themeOption: ThemeOption[] = Object.entries(themes).map(([key, value]) => ({
      theme: key,
      display: value.display || key,
    }));
    setAvailableThemes(themeOption);
  }, []);

  // Reload theme
  useEffect(() => {
    const themeData = themes[theme];
    const themeColors = themeData?.colors || {};
    Object.entries(themeColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value as string);
      document.documentElement.setAttribute("data-theme", theme);
    });
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme: theme, availableThemes: availableThemes, setTheme: handleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider.");
  return context;
};
