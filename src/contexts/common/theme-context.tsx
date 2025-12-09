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

// Get initial theme from DOM (set by SSR script) to prevent flash
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (ThemeList.some((t) => t === currentTheme)) {
    return currentTheme as Theme;
  }

  return "light";
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize from DOM to match SSR
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

  // Only run once on mount to sync with localStorage if needed
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const currentTheme = document.documentElement.getAttribute("data-theme");

    // If stored theme differs from current, update
    if (
      storedTheme &&
      storedTheme !== currentTheme &&
      availableThemes.some((t) => t.key === storedTheme)
    ) {
      setTheme(storedTheme);
    }
  }, []);

  // Update DOM when theme changes
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
