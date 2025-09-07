import { apiClient, apiClientFormData } from "@/api/setupInterceptor";
import ChangeNameDto from "./dto/change-name.dto";
import { ApiResponse, handleApiError, Result } from "../common";
import ChangeUrlNameDto from "./dto/change-url-name.dto";
import apiUrl from "@/config";
import ChangeNickname from "./dto/change-nickname.dto";
import ChangeNicknameDto from "./dto/change-nickname.dto";
import UserInfoOverviewDto from "./dto/user-info-overview.dto";

const API_URL = `${apiUrl}/api/userinfo`;

export class UserInfoService {
    async UpdateNickname(changeNicknameDto: ChangeNicknameDto): Promise<Result<ChangeNicknameDto>> 
    {
        try {
            const res = await apiClient.patch(`${API_URL}/nickname`, changeNicknameDto);
            const response = res.data as ApiResponse<ChangeNicknameDto>;
            return { success: true, data: response.data }
        }
        catch (error: any) {
            return handleApiError(error);
        }
    }

    async GetUserInfoOverview(userId: string): Promise<Result<UserInfoOverviewDto>> {
        try {
            const res = await apiClient.get(`${API_URL}/overview/${userId}`);
            const response = res.data as ApiResponse<UserInfoOverviewDto>;
            return { success: true, data: response.data }
        }
        catch (error: any) {
            return handleApiError(error);
        }
    }

}

export const userInfoService = new UserInfoService();
