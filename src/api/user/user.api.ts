import { apiClient, apiClientFormData } from "@/api/setupInterceptor";
import ChangeNameDto from "./dto/change_name.dto";
import { ApiResponse, Result } from "../common";
import ChangeUrlNameDto from "./dto/change_url_name.dto";

export class UserService {
    async CheckUserExistAsync(key: string): Promise<Result<any>> {
        try {
            await apiClient.get(`api/user/user-exist?key=${key}`);
            return { success: true };
        }
        catch (error: any)
        {
            if (error.response) {
                const err = error.response.data as ApiResponse<any>;
                return {
                    success: false,
                    errorCode: err.error?.code || "UNKNOWN_ERROR",
                    errorCodes: err.error?.codes
                }
            }
            else {
                return {
                    success: false,
                    errorCode: "INTERNAL_SERVER_ERROR"
                }
            }
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
            if (error.response) {
                const err = error.response.data as ApiResponse<any>;
                return {
                    success: false,
                    errorCode: error.error?.code || "UNKNOWN_ERROR",
                    errorCodes: err.error?.codes
                }
            }
            else {
                return {
                    success: false,
                    errorCodes: ["INTERNAL_SERVER_ERROR"]
                }
            }
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
            if (error.response) {
                const err = error.response.data as ApiResponse<any>;
                return {
                    success: false,
                    errorCode: error.error?.code || "UNKNOWN_ERROR",
                    errorCodes: err.error?.codes
                }
            }
            else {
                return {
                    success: false,
                    errorCodes: ["INTERNAL_SERVER_ERROR"]
                }
            }
        }
    }

    async UploadAvatar(file: File): Promise<{success: boolean, data?: any, statusCode?: number, errorCodes?: string[]}> { 
        try {
            
            const formData = new FormData();
            formData.append('file', file);
        
            const { data } = await apiClientFormData.patch('api/user/avatar', formData)
    
            return { success: true, data: data.data }
        }
        catch (error: any) {
            if (error.response) {

                return {
                    success: false,
                    statusCode: error.response.status,
                    errorCodes: error.response.data.error?.code || []
                }
            }
            else {
                return {
                    success: false,
                    statusCode: 500,
                    errorCodes: ["INTERNAL_SERVER_ERROR"]
                }
            }
        }
    }

    async UploadBackground(file: File): Promise<{success: boolean, data?: any, statusCode?: number, errorCodes?: string[]}> { 
        try {
            const formData = new FormData();
            formData.append('file', file);
        
            const { data } = await apiClientFormData.patch('api/user/background', formData)
            
            return { success: true, data: data.data }
        }
        catch (error: any) {
            console.log(error.response)
            if (error.response) {
                return {
                    success: false,
                    statusCode: error.response.status,
                    errorCodes: error.response.data.error?.code || []
                }
            }
            else {
                return {
                    success: false,
                    statusCode: 500,
                    errorCodes: ["INTERNAL_SERVER_ERROR"]
                }
            }
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
            if (error.response) {
                const err = error.response.data as ApiResponse<any>;
                return {
                    success: false,
                    errorCode: err.error?.code || "UNKNOWN_ERROR",
                    errorCodes: err.error?.codes || []
                }
            }
            else {
                return {
                    success: false,
                    errorCodes: ["INTERNAL_SERVER_ERROR"]
                }
            }
        }
    }

    async UpdateName(changeNameDto : ChangeNameDto) : Promise<Result<ChangeNameDto>>
    {
        try {
            const res = await apiClient.patch(`api/user/name`, changeNameDto);
            const response = res.data as ApiResponse<ChangeNameDto>;
            return { success: true, data: response.data } 
        }
        catch (error: any) {
            if (error.response) {
                const err = error.response.data as ApiResponse<any>;
                return {
                    success: false,
                    errorCode: err.error?.code || "UNKNOWN_ERROR",
                    errorCodes: err.error?.codes || []
                }
            }
            else {
                return {
                    success: false,
                    errorCodes: ["INTERNAL_SERVER_ERROR"]
                }
            }
        }
    }
}
