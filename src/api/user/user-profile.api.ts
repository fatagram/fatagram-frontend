import { ApiResponse } from "../common/apiResponse";
import { apiClient, apiClientFormData } from "../common/axiosInterceptor";
import { handleApiError } from "../common/handleApiError";
import { Result } from "../common/result";
import ChangeNameDto from "./dto/change-name.dto";
import ChangeUrlNameDto from "./dto/change-url-name.dto";
import GetMeDto from "./dto/get-me.dto";

const PREFIX = `/api/UserProfile`;

export class UserProfileService {
    // Check if user exists by id or urlName
    async CheckUserExistAsync(key: string): Promise<Result<any>> {
        try {
            await apiClient.get(`${PREFIX}/exist?key=${key}`);
            return { success: true };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    // Get user profile by id or urlName
    async GetProfile(id: string, fields: string): Promise<Result<any>> {
        try {
            const res = await apiClient.get(`${PREFIX}/${id}?fields=${fields}`);
            const response = res.data as ApiResponse<any>;
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    // Get current user profile
    async GetMe(): Promise<Result<GetMeDto>> {
        try {
            const res = await apiClient.get(`${PREFIX}/me`);
            const response = res.data.data.infos as GetMeDto;
            // console.log(response);
            return { success: true, data: response };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    // Upload avatar
    async UploadAvatar(file: File): Promise<Result<any>> { 
        try 
        {
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await apiClientFormData.patch(`${PREFIX}/avatar`, formData)
            return { success: true, data: data.data }
        }
        catch (error: any) {
            return handleApiError(error);
        }
    }

    // Upload background image
    async UploadBackground(file: File): Promise<Result<any>> { 
        try {
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await apiClientFormData.patch(`${PREFIX}/background`, formData)
            return { success: true, data: data.data }
        }
        catch (error: any) {
            return handleApiError(error);
        }
    }

    // Update simple profile fields such as bio, description, etc.
    async UpdateProfile(data: any): Promise<Result<any>> { 
        try {
            const res = await apiClient.put(`${PREFIX}`, data);
            const response = res.data as ApiResponse<any>;
            return { success: true, data: response.data }
        }
        catch (error: any) {
            return handleApiError(error);
        }
    }

    // Update user's URL name
    async UpdateUrlName(changeUrlNameDto : ChangeUrlNameDto) : Promise<Result<ChangeUrlNameDto>>
    {
        try {
            const res = await apiClient.patch(`${PREFIX}/urlName`, changeUrlNameDto);
            const response = res.data as ApiResponse<ChangeUrlNameDto>;
            return { success: true, data: response.data }
        }
        catch (error: any) {
            return handleApiError(error);
        }
    }

    // Update user's name
    async UpdateName(changeNameDto : ChangeNameDto) : Promise<Result<ChangeNameDto>>
    {
        try {
            const res = await apiClient.patch(`${PREFIX}/name`, changeNameDto);
            const response = res.data as ApiResponse<ChangeNameDto>;
            return { success: true, data: response.data }
        }
        catch (error: any) {
            return handleApiError(error);
        }
    }
}

export const userProfileService = new UserProfileService();
