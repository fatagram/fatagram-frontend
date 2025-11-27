import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "universe";

export const availableThemes: { key: Theme; label: string }[] = [
  { key: "light", label: "common:themes:light" },
  { key: "dark", label: "common:themes:dark" },
  { key: "universe", label: "common:themes:universe" },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
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
  if (availableThemes.some((t) => t.key === currentTheme)) {
    return currentTheme as Theme;
  }

  return "light";
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize from DOM to match SSR
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

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

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
