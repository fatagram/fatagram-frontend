import { LoginDto, RegisterDto } from "@/types/entities";
import { Result } from "../common/result";
import { apiGet, apiPost, buildApiPath } from "../common/api-helpers";

const PREFIX = buildApiPath("/auth");

// AuthService class
// This class is responsible for handling the login request to the server.
export class AuthService {
  // login method
  async login(dto: LoginDto): Promise<Result<void>> {
    return apiPost(`${PREFIX}/login`, {
      usernameOrEmail: dto.usernameOrEmail,
      password: dto.password,
      isRememberMe: dto.isRememberMe,
    });
  }

  async loginWithGoogle(code: string): Promise<Result<void>> {
    return apiPost(`${PREFIX}/oauth/google/callback`, { code });
  }

  // logout method
  async logout(): Promise<Result<void>> {
    return apiPost(`${PREFIX}/logout`);
  }

  async register(dto: RegisterDto): Promise<Result<void>> {
    return apiPost(`${PREFIX}/register`, {
      username: dto.username,
      password: dto.password,
      email: dto.email,
      phone: dto.phoneNumber,
    });
  }

  // Ping method
  // This method is responsible for sending a ping request to the server.
  // The method returns a promise of void.
  async ping(): Promise<Result<void>> {
    return apiGet(`${PREFIX}/ping`);
  }
}

// Create an instance of the AuthService class
export const authService = new AuthService();
