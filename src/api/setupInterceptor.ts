import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import apiUrl from '../config';
import { getRefreshToken, getRefreshTokenFromSession } from '@/utils/token';
import { authEvents } from '@/events/authEvents';

// Instance of axios for fetching data with JSON content type
const apiClient: AxiosInstance = axios.create(
    {
        baseURL: apiUrl,
        headers: {'Content-Type': 'application/json'},
        withCredentials: true
    }
)

// Instance of axios for fetching data with FormData content type
const apiClientFormData: AxiosInstance = axios.create(
    {
        baseURL: apiUrl,
        headers: {'Content-Type': 'multipart/form-data'},
        withCredentials: true 
    }
)

// Add Interceptors: apiClient
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    return config;
});

// Add Interceptors: apiClientFormData
apiClientFormData.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    return config;
});

// Error Authorization
apiClient.interceptors.response.use((response: AxiosResponse) => response, 
    async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            try {
                // Refresh token
                const refreshToken = getRefreshToken() || getRefreshTokenFromSession();
                const refreshResult = await axios.post(`${apiUrl}/api/auth/refreshToken`, 
                    { refreshToken: refreshToken }, 
                    { withCredentials: true })

                if (refreshResult.status === 200) {
                    return await apiClient.request(error.config);
                }
            }
            catch (error) {
                authEvents.emit("openLoginOverlay");
            }
        }
        return Promise.reject(error);
    });

// Error Authorization
apiClientFormData.interceptors.response.use((response: AxiosResponse) => response, 
    async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            try {
                // Refresh token
                const refreshToken = getRefreshToken() || getRefreshTokenFromSession();
                const refreshResult = await axios.post(`${apiUrl}/api/auth/refresh-token`, 
                    { refreshToken: refreshToken }, 
                    { withCredentials: true })

                if (refreshResult.status === 200) {
                    return await apiClient.request(error.config);
                }
            }
            catch (error) {
                // Handle error if needed
            }
        }
        else if (error.response?.status === 413) {
            // Custom error
            const err = new Error("File size is too large. Please upload a smaller file.");
            err.name = "LARGE_FILE_ERROR";
            return Promise.reject(err);
        }
        console.log(error);
        return Promise.reject(error);
    }
);
    
// Export the apiClient
export { apiClientFormData, apiClient };