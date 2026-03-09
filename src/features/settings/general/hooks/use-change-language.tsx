import { userConfigService } from "@/api/user/user-config.api";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { LocaleKeys } from "@/hooks/use-trans";

export const useChangeLanguage = () => {
  return useResultFetcher((languageCode: LocaleKeys) =>
    userConfigService.changeLanguage(languageCode),
  );
};
