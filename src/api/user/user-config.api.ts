import { apiClient, apiClientFormData } from "@/api/setupInterceptor";
import { handleApiError, Result } from "../common";
import apiUrl from "@/config";

const API_URL = `${apiUrl}/api`;

export class UserConfigService {
    async changeLanguage(dto: ChangeLanguageDto): Promise<Result<any>> {
        try {
            const res = await apiClient.put(`${API_URL}/userConfig/language`, {
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