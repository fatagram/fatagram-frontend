import { Result } from "../common/result";
import ChangeNameDto from "./dto/change-name.dto";
import ChangeUrlNameDto from "./dto/change-url-name.dto";
import GetMeDto from "./dto/get-me.dto";
import OnboardingDto from "./dto/onboarding.dto";
import { OnboardingDefaultDataDto } from "./dto/onboarding-default-data.dto";
import { User } from "@/types/entities/user.type";
import ChangeNicknameDto from "./dto/change-nickname.dto";
import {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiPatchFormData,
  buildApiPath,
} from "../common/api-helpers";
import { apiClient } from "../common/axios-interceptor";
import { handleApiError } from "../common/handle-api-error";
import { ApiResponse } from "../common/api-response";

const PREFIX = buildApiPath("/UserProfile");

export class UserProfileService {
  // Check if user exists by id or urlName
  async checkUserExist(key: string): Promise<Result<boolean>> {
    return apiGet(`${PREFIX}/exist?key=${key}`);
  }

  async getProfile(id: string, fields: string): Promise<Result<User>> {
    try {
      const res = await apiClient.get(`${PREFIX}/${id}?fields=${fields}`);
      const response = res.data as ApiResponse<any>;
      return { success: true, data: response.data?.infos };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // // Get user profile by id or urlName
  // async getHeaderProfile(id: string): Promise<Result<User>> {
  //   try {
  //     const res = await apiClient.get(`${PREFIX}/${id}?fields=avatar,fullName,background,nickname`);
  //     const response = res.data as ApiResponse<any>;
  //     return { success: true, data: response.data?.infos };
  //   } catch (error: any) {
  //     return handleApiError(error);
  //   }
  // }

  // async getUserAvatar(id: string): Promise<Result<string>> {
  //   try {
  //     const res = await apiClient.get(`${PREFIX}/${id}?fields=avatar`);
  //     const response = res.data as ApiResponse<any>;
  //     return { success: true, data: response.data?.infos?.avatar };
  //   } catch (error: any) {
  //     return handleApiError(error);
  //   }
  // }

  // async getUserBackground(id: string): Promise<Result<string>> {
  //   try {
  //     const res = await apiClient.get(`${PREFIX}/${id}?fields=background`);
  //     const response = res.data as ApiResponse<any>;
  //     return { success: true, data: response.data?.infos?.background };
  //   } catch (error: any) {
  //     return handleApiError(error);
  //   }
  // }

  // async getUserFullName(id: string): Promise<Result<string>> {
  //   try {
  //     const res = await apiClient.get(`${PREFIX}/${id}?fields=fullName`);
  //     const response = res.data as ApiResponse<any>;
  //     return { success: true, data: response.data?.infos?.fullName };
  //   } catch (error: any) {
  //     return handleApiError(error);
  //   }
  // }

  // async getUserUrlName(id: string): Promise<Result<string>> {
  //   try {
  //     const res = await apiClient.get(`${PREFIX}/${id}?fields=urlName`);
  //     const response = res.data as ApiResponse<any>;
  //     return { success: true, data: response.data?.infos?.urlName };
  //   } catch (error: any) {
  //     return handleApiError(error);
  //   }
  // }

  // async getUserNickname(id: string): Promise<Result<string>> {
  //   try {
  //     const res = await apiClient.get(`${PREFIX}/${id}?fields=nickname`);
  //     const response = res.data as ApiResponse<any>;
  //     return { success: true, data: response.data?.infos?.nickname };
  //   } catch (error: any) {
  //     return handleApiError(error);
  //   }
  // }

  async getUserId(id: string): Promise<Result<string>> {
    try {
      const res = await apiClient.get(`${PREFIX}/${id}?fields=id`);
      const response = res.data as ApiResponse<any>;
      return { success: true, data: response.data?.infos?.id };
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
  async uploadAvatar(file: File): Promise<Result<any>> {
    const formData = new FormData();
    formData.append("file", file);
    return apiPatchFormData(`${PREFIX}/avatar`, formData);
  }

  // Upload background image
  async uploadBackground(file: File): Promise<Result<any>> {
    const formData = new FormData();
    formData.append("file", file);
    return apiPatchFormData(`${PREFIX}/background`, formData);
  }

  // Update simple profile fields such as bio, description, etc.
  async updateProfile(data: any): Promise<Result<any>> {
    return apiPut(`${PREFIX}`, data);
  }

  // Update user's URL name
  async updateUrlName(changeUrlNameDto: ChangeUrlNameDto): Promise<Result<ChangeUrlNameDto>> {
    return apiPatch(`${PREFIX}/urlName`, changeUrlNameDto);
  }

  // Complete onboarding
  async completeOnboarding(onboardingDto: OnboardingDto): Promise<Result<any>> {
    return apiPost(`${PREFIX}/onboarding`, onboardingDto);
  }

  // Update user's name
  async updateName(changeNameDto: ChangeNameDto): Promise<Result<ChangeNameDto>> {
    return apiPatch(`${PREFIX}/name`, changeNameDto);
  }

  async updateNickname(changeNicknameDto: ChangeNicknameDto): Promise<Result<string>> {
    return apiPatch(`${PREFIX}/nickname`, changeNicknameDto);
  }

  // Get onboarding default data
  async getOnboardingDefaults(): Promise<Result<OnboardingDefaultDataDto>> {
    return apiGet(`${PREFIX}/onboarding/defaults`);
  }
}

export const userProfileService = new UserProfileService();
