import ServerResponse from "../../../../interfaces/ServerResponse";
import { apiClient } from "../../../../services/setupInterceptor";

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
