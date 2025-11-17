import { LoginDto, RegisterDto } from "@/types/entities";
import { ApiResponse } from "../common/apiResponse";
import { apiClient } from "../common/axiosInterceptor";
import { handleApiError } from "../common/handleApiError";
import { Result } from "../common/result";

const PREFIX = `/api/auth`;

// AuthService class
// This class is responsible for handling the login request to the server.
export class AuthService {
  // login method
  async login(dto: LoginDto): Promise<Result<void>> {
    try {
      const res = await apiClient.post(`${PREFIX}/login`, {
        username: dto.usernameOrEmail,
        password: dto.password,
        isRememberMe: dto.isRememberMe,
      });
      const response = res.data as ApiResponse<any>;

      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // logout method
  async logout(): Promise<Result<void>> {
    try {
      await apiClient.post(`${PREFIX}/logout`);
      return { success: true };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async register(dto: RegisterDto): Promise<Result<void>> {
    try {
      await apiClient.post(`${PREFIX}/register`, {
        username: dto.username,
        password: dto.password,
        email: dto.email,
        phone: dto.phoneNumber,
      });
      return { success: true };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // Ping method
  // This method is responsible for sending a ping request to the server.
  // The method returns a promise of void.
  async ping(): Promise<Result<void>> {
    try {
      // const accessToken = getAccessToken();
      await apiClient.get(`${PREFIX}/ping`);
      return { success: true };
    } catch (error: any) {
      return handleApiError(error);
    }
  }
}

// Create an instance of the AuthService class
export const authService = new AuthService();
