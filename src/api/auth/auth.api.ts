import { apiClient } from '@/api/setupInterceptor';
import LoginDto, { LoginResponse } from './dto/login.dto';
import { ApiResponse, handleApiError, Result } from '../common';
import apiUrl from '@/config';


const API_URL = `${apiUrl}/api/auth`;

// AuthService class
// This class is responsible for handling the login request to the server.
export class AuthService {

    // login method
    async login(dto: LoginDto): Promise<Result<LoginResponse>> {
        try {
            const res = await apiClient.post(`${API_URL}/login`, {
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
            await apiClient.post(`${API_URL}/logout`, { refreshToken: refreshToken });
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
            await apiClient.get(`${API_URL}/ping`);
            return { success: true };
        }
        catch (error: any) {
            return handleApiError(error);
        }
    }
}

// Create an instance of the AuthService class
export const authService = new AuthService();