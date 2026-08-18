import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import appConfig from "@/config";
import { authEvents } from "@/events/auth-event";

// Instance of axios for fetching data with JSON content type
const apiClient: AxiosInstance = axios.create({
  baseURL: appConfig.apiUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  paramsSerializer: {
    indexes: null,
  },
});

// Instance of axios for fetching data with FormData content type
const apiClientFormData: AxiosInstance = axios.create({
  baseURL: appConfig.apiUrl,
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true,
  paramsSerializer: {
    indexes: null,
  },
});

// Add Interceptors: apiClient
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config;
});

// Add Interceptors: apiClientFormData
apiClientFormData.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config;
});

// Shared in-flight refresh promise so concurrent 401s trigger only one refresh call
let refreshPromise: Promise<boolean> | null = null;

const tryRefreshToken = (): Promise<boolean> => {
  refreshPromise ??= axios
      .post(`${appConfig.apiUrl}/api/v1/auth/refresh-token`, {}, { withCredentials: true })
      .then((result) => result.status === 200)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  return refreshPromise;
};

// Cooldown guard: prevent emitting "logout" multiple times in rapid succession
// (e.g. when several concurrent requests all get 401 after a failed refresh)
let lastLogoutEmittedAt = 0;
const LOGOUT_COOLDOWN_MS = 2000;

const emitLogoutOnce = () => {
  const now = Date.now();
  if (now - lastLogoutEmittedAt > LOGOUT_COOLDOWN_MS) {
    lastLogoutEmittedAt = now;
    authEvents.emit("logout");
  }
};

const handleAuthError = async (error: any, client: AxiosInstance) => {
  if (error.response?.status === 401) {
    // Never retry the refresh-token call itself, and only retry each original request once
    if (error.config?.url?.includes("/auth/refresh-token") || error.config?._retry) {
      emitLogoutOnce();
      return Promise.reject(error);
    }

    const refreshed = await tryRefreshToken();
    if (refreshed) {
      error.config._retry = true;
      return client.request(error.config);
    }
    emitLogoutOnce();
  }
  return Promise.reject(error);
};

// Error Authorization
apiClient.interceptors.response.use((response: AxiosResponse) => response, async (error) => {
  if (
    error.response?.status === 403 &&
    error.response?.data?.error?.code === "ONBOARDING_NOT_COMPLETED"
  ) {
    authEvents.emit("redirectToOnboarding");
    return Promise.reject(error);
  }
  return handleAuthError(error, apiClient);
});

// Error Authorization
apiClientFormData.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response?.status === 413) {
      // Custom error
      const err = new Error("File size is too large. Please upload a smaller file.");
      err.name = "LARGE_FILE_ERROR";
      return Promise.reject(err);
    }
    return handleAuthError(error, apiClientFormData);
  },
);

// Export the apiClient
export { apiClientFormData, apiClient };
