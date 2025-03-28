import { apiClient } from '../../../services/setupInterceptor';
import LoginDto from '../interfaces/LoginDto';
import ServerResponse from '../../../interfaces/ServerResponse';
import { setRefreshToken, setRefreshTokenToSession, removeRefreshToken  } from '../../../utils/token';

// API_URL

// AuthService class
// This class is responsible for handling the login request to the server.
export class AuthService {

    // login method
    // This method is responsible for sending the login request to the server.
    // The method takes two parameters: username and password.
    // The method returns a promise of LoginResponse.
    async login(dto: LoginDto): Promise<ServerResponse> {
        try {
            console.log(`login`)
            const data = await apiClient.post(`/api/auth/login`, {
                username: dto.username,
                password: dto.password
            });
            const { refreshToken } = data.data.data;

            if (localStorage.getItem('isRememberMe') === 'true') {
                setRefreshToken(refreshToken);
            }
            else {
                removeRefreshToken();
                setRefreshTokenToSession(refreshToken);
            }

            // console.log(localStorage.getItem('accessToken'));
            return { success: true };
        }
        catch (error: any) {
            if (error.response) {
                console.log(error.response.data);
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


    // Ping method
    // This method is responsible for sending a ping request to the server.
    // The method returns a promise of void.
    async ping(): Promise<ServerResponse> {
        try {
            // const accessToken = getAccessToken();
            await apiClient.get(`/api/auth/ping`);
            return { success: true };
        }
        catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    statusCode: error.response.status,
                    errorCodes: error.response.data?.error?.code || []
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

// Create an instance of the AuthService class
export default AuthService;