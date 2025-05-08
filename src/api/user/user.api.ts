import { apiClient, apiClientFormData } from "@/api/setupInterceptor";
import ChangeNameDto from "./dto/change_name.dto";
import { ApiResponse, handleApiError, Result } from "../common";
import ChangeUrlNameDto from "./dto/change_url_name.dto";

export class UserService {
    async CheckUserExistAsync(key: string): Promise<Result<any>> {
        try {
            await apiClient.get(`api/user/user-exist?key=${key}`);
            return { success: true };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    async GetProfile(id: string, fields: string): Promise<Result<any>> {
        try {
            const res = await apiClient.get(`api/user/${id}/profile?fields=${fields}`);
            const response = res.data as ApiResponse<any>;
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    async GetMe(): Promise<Result<{userId: string | undefined, urlName: string | undefined}>> {
        try {
            const res = await apiClient.get(`api/user/me`);
            const response = res.data.data.infos as {id: string | undefined, urlName: string | undefined};
            return { success: true, data: {userId: response?.id, urlName: response?.urlName} };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }
    
    async GetFriendshipStatus(targetId: string): Promise<Result<{status: string}>> {
        try {
            const res = await apiClient.get(`api/user/friend/status/${targetId}`);
            const response = res.data as ApiResponse<{status: string}>;
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    } 

    async SendAddFriendRequest(receiverId: string): Promise<Result<any>> {
        try {
            const res = await apiClient.post(`api/user/friend/add/${receiverId}`);
            const response = res.data as ApiResponse<any>;
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    async CancelAddFriendRequest(senderId: string): Promise<Result<any>> {
        try {
            const res = await apiClient.delete(`api/user/friend/cancel/${senderId}`);
            const response = res.data as ApiResponse<any>;
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    async AcceptAddFriendRequest(senderId: string): Promise<Result<any>> {
        try {
            const res = await apiClient.post(`api/user/friend/accept/${senderId}`);
            const response = res.data as ApiResponse<any>;
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    async DeclineAddFriendRequest(requesterId: string): Promise<Result<any>> {
        try {
            const res = await apiClient.delete(`api/user/friend/decline/${requesterId}`);
            const response = res.data as ApiResponse<any>;
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    async Unfriend(friendId: string): Promise<Result<any>> {
        try {
            const res = await apiClient.delete(`api/user/friend/unfriend/${friendId}`);
            const response = res.data as ApiResponse<any>;
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    async GetNumberOfFriends(targetId: string): Promise<Result<{numberOfFriends: number}>> {
        try {
            const res = await apiClient.get(`api/user/friend/count/${targetId}`);
            const response = res.data as ApiResponse<{numberOfFriends: number}>;
            return { success: true, data: response.data };
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
        try {
            
            const formData = new FormData();
            formData.append('file', file);
        
            const { data } = await apiClientFormData.patch('api/user/avatar', formData)
    
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
        
            const { data } = await apiClientFormData.patch('api/user/background', formData)
            
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
            const res = await apiClient.patch(`api/user/url-name`, changeUrlNameDto);
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
            const res = await apiClient.patch(`api/user/name`, changeNameDto);
            const response = res.data as ApiResponse<ChangeNameDto>;
            return { success: true, data: response.data } 
        }
        catch (error: any) {
            return handleApiError(error);
        }
    }
}
