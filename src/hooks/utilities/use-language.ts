import { LanguageContext, LanguageContextType } from "@/contexts/common/language-context";
import { useContext } from "react";

// Hook
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider.");
  return context;
};