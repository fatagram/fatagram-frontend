import ServerResponse from "../../../../interfaces/ServerResponse";
import { apiClient, apiClientFormData } from "../../../../services/setupInterceptor";

export class ProfileService {
    async GetProfileHeader(id: string): Promise<ServerResponse> {
        try {
            const fields = 'fullName,avatar,background';
            const { data } = await apiClient.get(`api/user/${id}/profile?fields=${fields}`);

            return { success: true, data: data.data };
        }
        catch (error: any)
        {
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

    async UploadAvatar(file: File): Promise<{success: boolean, data?: any, statusCode?: number, errorCodes?: string[]}> { 
        try {
            
            const formData = new FormData();
            formData.append('file', file);
        
            const { data } = await apiClientFormData.put('api/user/upload/avatar', formData)
    
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
        
            const { data } = await apiClientFormData.put('api/user/upload/background', formData)
            
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
}
