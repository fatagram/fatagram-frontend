import ServerResponse from "@/api/common.dto";
import { apiClient, apiClientFormData } from "@/api/setupInterceptor";
import ChangeUrlNameDto from "./dto/change_url_name.dto";
import ChangeNameDto from "./dto/change_name.dto";

export class UserService {
    async CheckUserExistAsync(key: string): Promise<ServerResponse> {
        try {
            await apiClient.get(`api/user/user-exist?key=${key}`);
            return { success: true };
        }
        catch (error: any)
        {
            if (error.response) {
                return {
                    success: false,
                    statusCode: error.response.status,
                    errorCodes: error.response.data.error?.code || ["UNKNOWN_ERROR"]
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

    async GetProfile(id: string, fields: string): Promise<ServerResponse> {
        try {
            const { data } = await apiClient.get(`api/user/${id}/profile?fields=${fields}`);
            return { success: true, data: data.data };
        }
        catch (error: any)
        {
            if (error.response) {
                return {
                    success: false,
                    statusCode: error.response.status,
                    errorCodes: error.response.data.error?.code || ["UNKNOWN_ERROR"]
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
                    errorCodes: error.response.data.error?.code || ["UNKNOWN_ERROR"]
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
                    errorCodes: error.response.data.error?.code || ["INTERNAL_SERVER_ERROR"]
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

    async UpdateProfile(data: any)
    : Promise<ServerResponse> { 
        try {
            const { data: responseData } = await apiClient.put(`api/user`, data)
            return { success: true, data: responseData.data }
        }
        catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    statusCode: error.response.status,
                    errorCodes: error.response.data.error?.code || ["UNKNOWN_ERROR"]
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

    async UpdateUrlName(changeUrlNameDto : ChangeUrlNameDto) : Promise<ServerResponse>
    {
        try {
            const { data } = await apiClient.patch(`api/user/url-name`, changeUrlNameDto)
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

    async UpdateName(changeNameDto : ChangeNameDto) : Promise<ServerResponse>
    {
        try {
            const { data } = await apiClient.patch(`api/user/name`, changeNameDto)
            return { success: true, data: data.data } 
        }
        catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    statusCode: error.response.status,
                    errorCodes: error.response.data.error?.code || ["UNKNOWN_ERROR"]
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
}
