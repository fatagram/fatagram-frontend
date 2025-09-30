import ChangeNicknameDto from "./dto/change-nickname.dto";
import UserInfoOverviewDto from "./dto/user-info-overview.dto";
import { Result } from "../common/result";
import { apiClient } from "../common/axiosInterceptor";
import { ApiResponse } from "../common/apiResponse";
import { handleApiError } from "../common/handleApiError";

const PREFIX = `/api/userinfo`;

export class UserInfoService {
  async UpdateNickname(changeNicknameDto: ChangeNicknameDto): Promise<Result<ChangeNicknameDto>> {
    try {
      const res = await apiClient.patch(`${PREFIX}/nickname`, changeNicknameDto);
      const response = res.data as ApiResponse<ChangeNicknameDto>;
      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async GetUserInfoOverview(userId: string): Promise<Result<UserInfoOverviewDto>> {
    try {
      const res = await apiClient.get(`${PREFIX}/overview/${userId}`);
      const response = res.data as ApiResponse<UserInfoOverviewDto>;
      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }
}

export const userInfoService = new UserInfoService();
