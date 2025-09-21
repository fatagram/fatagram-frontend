import { apiClient } from "../common/axiosInterceptor";
import { Result } from "../common/result";
import { handleApiError } from "../common/handleApiError";

const PREFIX = `/api`;

export class UserConfigService {
    async changeLanguage(dto: ChangeLanguageDto): Promise<Result<any>> {
        try {
            const res = await apiClient.put(`${PREFIX}/userConfig/language`, {
                LanguageCode: dto.LanguageCode
            });
            return { success: true };  
        }
        catch(error) {
            return handleApiError(error);
        }
    }
} 

export const userConfigService = new UserConfigService();