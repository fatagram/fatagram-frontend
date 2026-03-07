import { Result } from "../common/result";
import { apiPut, buildApiPath } from "../common/api-helpers";

const PREFIX = buildApiPath("");

export class UserConfigService {
  async changeLanguage(dto: any): Promise<Result<any>> {
    return apiPut(`${PREFIX}/userconfig/language`, {
      LanguageCode: dto.LanguageCode,
    });
  }
}

export const userConfigService = new UserConfigService();
