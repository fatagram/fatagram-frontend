import { apiClient, apiClientFormData } from "@/api/setupInterceptor";
import ChangeNameDto from "./dto/change-name.dto";
import { ApiResponse, handleApiError, Result } from "../common";
import ChangeUrlNameDto from "./dto/change-url-name.dto";
import apiUrl from "@/config";

const API_URL = `${apiUrl}/api/userprofile`;

export class UserProfileService {
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

    async UploadAvatar(file: File): Promise<{
        success: boolean, 
        data?: any, 
        statusCode?: number, 
        errorCode?: string,
        errorCodes?: string[]}> { 
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

    async UploadBackground(file: File): Promise<{
        success: boolean,
        data?: any,
        statusCode?: number, 
        errorCode?: string,
        errorCodes?: string[]}> { 
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

    // async UpdateProfile(data: any): Promise<ServerResponse> { 
    //     try {
    //         const { data: responseData } = await apiClient.put(`api/user`, data)
    //         return { success: true, data: responseData.data }
    //     }
    //     catch (error: any) {
    //         if (error.response) {
    //             return {
    //                 success: false,
    //                 statusCode: error.response.status,
    //                 errorCodes: error.response.data.error?.code || ["UNKNOWN_ERROR"]
    //             }
    //         }
    //         else {
    //             return {
    //                 success: false,
    //                 statusCode: 500,
    //                 errorCodes: ["INTERNAL_SERVER_ERROR"]
    //             }
    //         }
    //     }
    // }

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
