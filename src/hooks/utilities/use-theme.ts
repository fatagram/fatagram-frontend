import { ThemeContext, ThemeContextType } from "@/contexts/common/theme-context";
import { useContext } from "react";

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider.");
  return context;
}
