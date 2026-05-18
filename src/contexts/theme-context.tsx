import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ThemeList = [
  "system",
  "light",
  "dark",
  "light-old",
  "dark-old",
  "pastel-yellow-pink",
  "pastel-peach-red",
] as const;

export type Theme = (typeof ThemeList)[number];

export interface ThemeContextType {
  availableThemes: { key: Theme; label: string }[];
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  availableThemes: [],
  theme: "system",
  setTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

function getInitialTheme(): Theme {
  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem("theme");
      if (stored && ThemeList.some((t) => t === stored)) {
        return stored as Theme;
      }
    } catch {}

    const domTheme = window.document?.documentElement?.getAttribute("data-theme");
    if (domTheme && ThemeList.some((t) => t === domTheme)) {
      return domTheme as Theme;
    }
  }

  return "system";
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const t = useTranslation().t;

  const availableThemes: { key: Theme; label: string }[] = [
    { key: "system", label: t("common:themes:system") },
    { key: "light", label: t("common:themes:light") },
    { key: "dark", label: t("common:themes:dark") },
    { key: "light-old", label: t("common:themes:lightOld") },
    { key: "dark-old", label: t("common:themes:darkOld") },
    { key: "pastel-yellow-pink", label: t("common:themes:pastelYellowPink") },
    { key: "pastel-peach-red", label: t("common:themes:pastelPeachRed") },
  ];

  useEffect(() => {
    const root = window.document.documentElement;

    const resolveAndApplyTheme = () => {
      let resolvedTheme = theme;
      if (theme === "system") {
        const isDarkSystem = window.matchMedia("(prefers-color-scheme: dark)").matches;
        resolvedTheme = isDarkSystem ? "dark" : "light";
      }

      root.setAttribute("data-theme", resolvedTheme);

      const updateThemeColor = () => {
        let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("name", "theme-color");
          document.head.appendChild(meta);
        }

        const raw = getComputedStyle(root).getPropertyValue("--bg-main").trim();
        const parts = raw.includes(",") ? raw.split(",") : raw.split(/\s+/);
        const nums = parts
          .map((p) => Number.parseInt(p.trim(), 10))
          .filter((n) => Number.isFinite(n));

        if (nums.length < 3) return;
        const [r, g, b] = nums;
        const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
        const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        meta.setAttribute("content", hex);
      };

      requestAnimationFrame(updateThemeColor);
    };

    resolveAndApplyTheme();
    localStorage.setItem("theme", theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => {
        resolveAndApplyTheme();
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", listener);
      } else {
        mediaQuery.addListener(listener);
      }

      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", listener);
        } else {
          mediaQuery.removeListener(listener);
        }
      };
    }
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
