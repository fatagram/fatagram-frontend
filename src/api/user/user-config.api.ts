import { Result } from "../common/result";
import { apiPut, buildApiPath } from "../common/api-helpers";

const PREFIX = buildApiPath("/userconfig");

export class UserConfigService {
  async changeLanguage(languageCode: string): Promise<Result<any>> {
    return apiPut(`${PREFIX}/language`, { languageCode });
  }
}

export const userConfigService = new UserConfigService();
