import { ApiResponse } from "../common/apiResponse";
import { apiClient, apiClientFormData } from "../common/axiosInterceptor";
import { handleApiError } from "../common/handleApiError";
import { Result } from "../common/result";
import ChangeNameDto from "./dto/change-name.dto";
import ChangeUrlNameDto from "./dto/change-url-name.dto";
import GetMeDto from "./dto/get-me.dto";
import OnboardingDto from "./dto/onboarding.dto";
import { OnboardingDefaultDataDto } from "./dto/onboarding-default-data.dto";
import { User } from "@/types/entities/user.type";

const PREFIX = `/api/UserProfile`;

export class UserProfileService {
  // Check if user exists by id or urlName
  async checkUserExist(key: string): Promise<Result<any>> {
    try {
      await apiClient.get(`${PREFIX}/exist?key=${key}`);
      return { success: true };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // Get user profile by id or urlName
  async getHeaderProfile(id: string): Promise<Result<User>> {
    try {
      const res = await apiClient.get(`${PREFIX}/${id}?fields=avatar,fullName,background,nickname`);
      const response = res.data as ApiResponse<any>;
      return { success: true, data: response.data?.infos };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async getUserAvatar(id: string): Promise<Result<User>> {
    try {
      const res = await apiClient.get(`${PREFIX}/${id}?fields=avatar`);
      const response = res.data as ApiResponse<any>;
      return { success: true, data: response.data?.infos };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async getUserBackground(id: string): Promise<Result<User>> {
    try {
      const res = await apiClient.get(`${PREFIX}/${id}?fields=background`);
      const response = res.data as ApiResponse<any>;
      return { success: true, data: response.data?.infos };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async getUserFullName(id: string): Promise<Result<User>> {
    try {
      const res = await apiClient.get(`${PREFIX}/${id}?fields=fullName`);
      const response = res.data as ApiResponse<any>;
      return { success: true, data: response.data?.infos };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async getUserUrlName(id: string): Promise<Result<User>> {
    try {
      const res = await apiClient.get(`${PREFIX}/${id}?fields=urlName`);
      const response = res.data as ApiResponse<any>;
      return { success: true, data: response.data?.infos };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async getUserId(id: string): Promise<Result<User>> {
    try {
      const res = await apiClient.get(`${PREFIX}/${id}?fields=id`);
      const response = res.data as ApiResponse<any>;
      return { success: true, data: response.data?.infos };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // Get current user profile
  async getMe(): Promise<Result<GetMeDto>> {
    try {
      const res = await apiClient.get(`${PREFIX}/me`);
      const response = res.data.data.infos as GetMeDto;
      // console.log(response);
      return { success: true, data: response };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // Upload avatar
  async UploadAvatar(file: File): Promise<Result<any>> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await apiClientFormData.patch(`${PREFIX}/avatar`, formData);
      return { success: true, data: data.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // Upload background image
  async UploadBackground(file: File): Promise<Result<any>> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await apiClientFormData.patch(`${PREFIX}/background`, formData);
      return { success: true, data: data.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // Update simple profile fields such as bio, description, etc.
  async UpdateProfile(data: any): Promise<Result<any>> {
    try {
      const res = await apiClient.put(`${PREFIX}`, data);
      const response = res.data as ApiResponse<any>;
      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // Update user's URL name
  async UpdateUrlName(changeUrlNameDto: ChangeUrlNameDto): Promise<Result<ChangeUrlNameDto>> {
    try {
      const res = await apiClient.patch(`${PREFIX}/urlName`, changeUrlNameDto);
      const response = res.data as ApiResponse<ChangeUrlNameDto>;
      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // Complete onboarding
  async completeOnboarding(onboardingDto: OnboardingDto): Promise<Result<any>> {
    try {
      const res = await apiClient.post(`${PREFIX}/onboarding`, onboardingDto);
      const response = res.data as ApiResponse<any>;
      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // Update user's name
  async updateName(changeNameDto: ChangeNameDto): Promise<Result<ChangeNameDto>> {
    try {
      const res = await apiClient.patch(`${PREFIX}/name`, changeNameDto);
      const response = res.data as ApiResponse<ChangeNameDto>;
      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // Get onboarding default data
  async getOnboardingDefaults(): Promise<Result<OnboardingDefaultDataDto>> {
    try {
      const res = await apiClient.get(`${PREFIX}/onboarding/defaults`);
      const response = res.data as ApiResponse<OnboardingDefaultDataDto>;
      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }
}

export const userProfileService = new UserProfileService();
