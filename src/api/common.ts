export interface ApiResponse<T> {
    data?: T;
    message?: string;
    error?: ApiError
}

export interface ApiError {
    code?: string;
    message?: string;
    codes?: string[];
}

export interface Result<T> {
    success: boolean;
    data?: T;
    errorCode?: string;
    errorCodes?: string[];
}
