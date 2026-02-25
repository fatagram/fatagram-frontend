import { AxiosResponse } from "axios";
import { apiClient, apiClientFormData } from "./axios-interceptor";
import { handleApiError } from "./handle-api-error";
import { ApiResponse } from "./api-response";
import { Result } from "./result";

const API_VERSION = "v1";

export const buildApiPath = (prefix: string): string => {
  const cleanPrefix = prefix.replace(/^\/+|\/+$/g, "");
  const withoutApi = cleanPrefix.replace(/^api\/?/, "");
  return `/api/${API_VERSION}/${withoutApi}`;
};

export const apiGet = async <T = any>(url: string, config?: any): Promise<Result<T>> => {
  try {
    const res: AxiosResponse<ApiResponse<T>> = await apiClient.get(url, config);
    return { success: true, data: res.data.data };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const apiPost = async <T = any>(
  url: string,
  data?: any,
  config?: any,
): Promise<Result<T>> => {
  try {
    const res: AxiosResponse<ApiResponse<T>> = await apiClient.post(url, data, config);
    return { success: true, data: res.data.data };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const apiPut = async <T = any>(
  url: string,
  data?: any,
  config?: any,
): Promise<Result<T>> => {
  try {
    const res: AxiosResponse<ApiResponse<T>> = await apiClient.put(url, data, config);
    return { success: true, data: res.data.data };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const apiPatch = async <T = any>(
  url: string,
  data?: any,
  config?: any,
): Promise<Result<T>> => {
  try {
    const res: AxiosResponse<ApiResponse<T>> = await apiClient.patch(url, data, config);
    return { success: true, data: res.data.data };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const apiDelete = async <T = any>(url: string, config?: any): Promise<Result<T>> => {
  try {
    const res: AxiosResponse<ApiResponse<T>> = await apiClient.delete(url, config);
    return { success: true, data: res.data.data };
  } catch (error: any) {
    return handleApiError(error);
  }
};

/**
 * POST FormData request wrapper with error handling
 */
export const apiPostFormData = async <T = any>(
  url: string,
  formData: FormData,
  config?: any,
): Promise<Result<T>> => {
  try {
    const res: AxiosResponse<ApiResponse<T>> = await apiClientFormData.post(url, formData, config);
    return { success: true, data: res.data.data };
  } catch (error: any) {
    return handleApiError(error);
  }
};

/**
 * PATCH FormData request wrapper with error handling
 */
export const apiPatchFormData = async <T = any>(
  url: string,
  formData: FormData,
  config?: any,
): Promise<Result<T>> => {
  try {
    const res: AxiosResponse<ApiResponse<T>> = await apiClientFormData.patch(url, formData, config);
    return { success: true, data: res.data.data };
  } catch (error: any) {
    return handleApiError(error);
  }
};

/**
 * PUT FormData request wrapper with error handling
 */
export const apiPutFormData = async <T = any>(
  url: string,
  formData: FormData,
  config?: any,
): Promise<Result<T>> => {
  try {
    const res: AxiosResponse<ApiResponse<T>> = await apiClientFormData.put(url, formData, config);
    return { success: true, data: res.data.data };
  } catch (error: any) {
    return handleApiError(error);
  }
};
