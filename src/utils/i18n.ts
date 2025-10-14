import { useTranslation } from "react-i18next";

export default function useLanguage(): (key: string) => string {
  const { t } = useTranslation() as { t: (key: string) => string };
  return t;
}
