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
  "pastel-yellow-pink",
  "dark-red",
  "emerald",
  "aurora",
  "dark-blue",
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
    { key: "dark-blue", label: t("common:themes:darkBlue") },
    { key: "light-yellow-pink", label: t("common:themes:lightYellowPink") },
    { key: "pastel-yellow-pink", label: t("common:themes:pastelYellowPink") },
    { key: "dark-red", label: t("common:themes:darkRed") },
    { key: "emerald", label: t("common:themes:emerald") },
    { key: "aurora", label: t("common:themes:aurora") },
  ];

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Keep PWA status bar color (meta theme-color) in sync with navbar/theme.
    // Navbar uses `bg-bg-main` => CSS var `--bg-main`.
    const updateThemeColor = () => {
      let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "theme-color");
        document.head.appendChild(meta);
      }

      const raw = getComputedStyle(root).getPropertyValue("--bg-main").trim();
      // Expected formats: "255 255 255" (preferred) or "255, 255, 255"
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

    // Allow CSS variables to apply after data-theme is set.
    requestAnimationFrame(updateThemeColor);
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
