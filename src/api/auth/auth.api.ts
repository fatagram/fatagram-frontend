import { apiClient } from '@/api/setupInterceptor';
import LoginDto from './dto/login.dto';
import { ApiResponse, Result } from '../common';

export interface LoginResponse {
    refreshToken: string;
    userId: string;
    urlName: string;
}

// AuthService class
// This class is responsible for handling the login request to the server.
export class AuthService {

    // login method
    async login(dto: LoginDto): Promise<Result<LoginResponse>> {
        try {
            const res = await apiClient.post(`/api/auth/login`, {
                username: dto.username,
                password: dto.password
            });
            const response = res.data as ApiResponse<LoginResponse>;

            return { success: true, data: response.data };
        }
        catch (error: any) {
            if (error.response) {
                const err = error.response.data as ApiResponse<LoginResponse>;
                return {
                    success: false,
                    errorCode: err.error?.code || "UNKNOWN_ERROR",
                    errorCodes: err.error?.codes
                }
            }
            else {
                return {
                    success: false,
                    errorCode: "INTERNAL_SERVER_ERROR",
                }
            }
        }
    }

    // logout method
    async logout(refreshToken?: string): Promise<void> {
        try {
            await apiClient.post(`/api/auth/logout`, { refreshToken: refreshToken });
        }
        catch (error: any) {
            if (error.response) {
                console.log(error.response.data);
            }
            else {
                console.log("INTERNAL_SERVER_ERROR");
            }
        }
    }

    // Ping method
    // This method is responsible for sending a ping request to the server.
    // The method returns a promise of void.
    async ping(): Promise<Result<void>> {
        try {
            // const accessToken = getAccessToken();
            await apiClient.get(`/api/auth/ping`);
            return { success: true };
        }
        catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    errorCodes: error.response.data?.error?.code || []
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

// Create an instance of the AuthService class
export default AuthService;