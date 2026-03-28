import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ThemeList = [
  "light",
  "dark",
  "universe",
  "neon",
  "dark-sea",
  "dark-yellow",
  "light-yellow-pink",
] as const;

export type Theme = (typeof ThemeList)[number];

export interface ThemeContextType {
  availableThemes: { key: Theme; label: string }[];
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  availableThemes: [],
  theme: "light",
  setTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem("theme");
  if (stored && ThemeList.some((t) => t === stored)) {
    return stored as Theme;
  }

  const domTheme = document.documentElement.getAttribute("data-theme");
  if (domTheme && ThemeList.some((t) => t === domTheme)) {
    return domTheme as Theme;
  }

  return "light";
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const t = useTranslation().t;

  const availableThemes: { key: Theme; label: string }[] = [
    { key: "light", label: t("common:themes:light") },
    { key: "dark", label: t("common:themes:dark") },
    { key: "universe", label: t("common:themes:universe") },
    { key: "neon", label: t("common:themes:neon") },
    { key: "dark-sea", label: t("common:themes:darkSea") },
    { key: "dark-yellow", label: t("common:themes:darkYellow") },
    { key: "light-yellow-pink", label: t("common:themes:lightYellowPink") },
  ];

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ availableThemes, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
