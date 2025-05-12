import { apiClient } from '@/api/setupInterceptor';
import LoginDto from './dto/login.dto';
import { ApiResponse, handleApiError, Result } from '../common';

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
            return handleApiError(error);
        }
    }

    // logout method
    async logout(refreshToken?: string): Promise<void> {
        try {
            await apiClient.post(`/api/auth/logout`, { refreshToken: refreshToken });
        }
        catch (error: any) {
            handleApiError(error);
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
            return handleApiError(error);
        }
    }
}

// Create an instance of the AuthService class
export const authService = new AuthService();