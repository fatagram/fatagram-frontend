import axios from 'axios';
import apiUrl from '../../../config';
import { getAccessToken, setAccessToken, setRefreshToken } from '../../../utils/token';
import { LoginDto } from '../../../interfaces/auth/LoginDto';
import { ServerResponse } from '../../../interfaces/ServerResponse';

const API_URL = `${apiUrl}/api/auth/`;

// AuthService class
// This class is responsible for handling the login request to the server.
export class AuthService {

    // login method
    // This method is responsible for sending the login request to the server.
    // The method takes two parameters: username and password.
    // The method returns a promise of LoginResponse.
    async login(dto: LoginDto): Promise<ServerResponse> {
        try {
            const { data } = await axios.post(`${API_URL}login`, {
                username: dto.username,
                password: dto.password
            });

            const { accessToken, refreshToken } = data;

            // set token in local storage
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);

            // console.log(localStorage.getItem('accessToken'));

            return { success: true };
        }
        catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    statusCode: error.response.status,
                    errorCodes: error.response.data.code || ["INTERNAL_SERVER_ERROR"]
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

    

    // refreshAccessTokenAsync method
    // This method is responsible for refreshing the access token.
    async refreshAccessToken(): Promise<ServerResponse> {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token found');
            }

            const { data } = await axios.post(`${API_URL}refresh`, {
                refreshToken
            });
            setAccessToken(data.accessToken);
            return { success: true, statusCode: data.status };
        }
        catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    statusCode: error.response.status,
                    errorCodes: error.response.data
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
            const accessToken = getAccessToken();
            if (!accessToken) {
                return { success: false, statusCode: 401, errorCodes: ["UNAUTHORIZED"] };
            }

            await axios.get(`${API_URL}ping-access-token`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            return { success: true };
        }
        catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    statusCode: error.response.status,
                    errorCodes: error.response.data
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