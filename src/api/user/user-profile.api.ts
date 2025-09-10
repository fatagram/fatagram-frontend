import { apiClient, apiClientFormData } from "@/api/setupInterceptor";
import ChangeNameDto from "./dto/change-name.dto";
import { ApiResponse, handleApiError, Result } from "../common";
import ChangeUrlNameDto from "./dto/change-url-name.dto";
import apiUrl from "@/config";

const API_URL = `${apiUrl}/api/UserProfile`;

export class UserProfileService {
    // Check if user exists by id or urlName
    async CheckUserExistAsync(key: string): Promise<Result<any>> {
        try {
            await apiClient.get(`${API_URL}/exist?key=${key}`);
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
            const res = await apiClient.get(`${API_URL}/${id}?fields=${fields}`);
            const response = res.data as ApiResponse<any>;
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    // Get current user profile
    async GetMe(): Promise<Result<{userId: string | undefined, urlName: string | undefined, languageCode: string}>> {
        try {
            const res = await apiClient.get(`${API_URL}/me`);
            const response = res.data.data.infos as {id: string | undefined, urlName: string | undefined, languageCode: string};
            return { success: true, data: {userId: response?.id, urlName: response?.urlName, languageCode: response.languageCode} };
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
            const { data } = await apiClientFormData.patch(`${API_URL}/avatar`, formData)
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
            const { data } = await apiClientFormData.patch(`${API_URL}/background`, formData)
            return { success: true, data: data.data }
        }
        catch (error: any) {
            return handleApiError(error);
        }
    }

    // Update simple profile fields such as bio, description, etc.
    async UpdateProfile(data: any): Promise<Result<any>> { 
        try {
            const res = await apiClient.put(`${API_URL}`, data);
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
            const res = await apiClient.patch(`${API_URL}/urlName`, changeUrlNameDto);
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
            const res = await apiClient.patch(`${API_URL}/name`, changeNameDto);
            const response = res.data as ApiResponse<ChangeNameDto>;
            return { success: true, data: response.data }
        }
        catch (error: any) {
            return handleApiError(error);
        }
    }
}

export const userProfileService = new UserProfileService();
