import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import appConfig from "@/config";
import { authEvents } from "@/events/auth-event";

// Instance of axios for fetching data with JSON content type
const apiClient: AxiosInstance = axios.create({
  baseURL: appConfig.apiUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Instance of axios for fetching data with FormData content type
const apiClientFormData: AxiosInstance = axios.create({
  baseURL: appConfig.apiUrl,
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true,
});

// Add Interceptors: apiClient
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config;
});

// Add Interceptors: apiClientFormData
apiClientFormData.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config;
});

const tryRefreshToken = async (): Promise<boolean> => {
  try {
    const result = await axios.post(
      `${appConfig.apiUrl}/api/v1/auth/refresh-token`,
      {},
      { withCredentials: true },
    );
    return result.status === 200;
  } catch {
    return false;
  }
};

// Error Authorization
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return await apiClient.request(error.config);
      }
      authEvents.emit("logout");
    } else if (
      error.response?.status === 403 &&
      error.response?.data?.error?.code === "ONBOARDING_NOT_COMPLETED"
    ) {
      authEvents.emit("redirectToOnboarding");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

// Error Authorization
apiClientFormData.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return await apiClient.request(error.config);
      }
      authEvents.emit("logout");
    } else if (error.response?.status === 413) {
      // Custom error
      const err = new Error("File size is too large. Please upload a smaller file.");
      err.name = "LARGE_FILE_ERROR";
      return Promise.reject(err);
    }
    return Promise.reject(error);
  },
);

// Export the apiClient
export { apiClientFormData, apiClient };
