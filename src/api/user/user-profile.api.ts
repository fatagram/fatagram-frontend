import { Result } from "../common/result";
import ChangeNameDto from "./dto/change-name.dto";
import ChangeUrlNameDto from "./dto/change-url-name.dto";
import OnboardingDto from "./dto/onboarding.dto";
import { OnboardingDefaultDataDto } from "./dto/onboarding-default-data.dto";
import { GetMeDto } from "./dto/get-me.dto";
import ChangeNicknameDto from "./dto/change-nickname.dto";
import {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiPatchFormData,
  buildApiPath,
} from "../common/api-helpers";
import { ProfileDto } from "./dto/profile.dto";

const PREFIX = buildApiPath("/userprofile");

export class UserProfileService {
  // Check if user exists by id or urlName
  async checkUserExist(key: string): Promise<Result<boolean>> {
    return await apiGet(`${PREFIX}/exist?key=${key}`);
  }

  async getProfile(target: string, fields: string): Promise<Result<ProfileDto<any>>> {
    return await apiGet(`${PREFIX}/${target}`, { fields });
  }

  async getUserId(target: string): Promise<Result<ProfileDto<{ id: string }>>> {
    return await apiGet(`${PREFIX}/${target}`, { fields: "id" });
  }

  // Get current user profile
  async getMe(): Promise<Result<GetMeDto>> {
    const data = await apiGet(`${PREFIX}/me`);
    console.log("getMe response:", data); // Debug log
    return data;
  }

  // Upload avatar
  async uploadAvatar(file: File): Promise<Result<any>> {
    const formData = new FormData();
    formData.append("file", file);
    return await apiPatchFormData(`${PREFIX}/avatar`, formData);
  }

  // Upload background image
  async uploadBackground(file: File): Promise<Result<any>> {
    const formData = new FormData();
    formData.append("file", file);
    return await apiPatchFormData(`${PREFIX}/background`, formData);
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
