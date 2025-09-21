export type ApiError = {
    code?: string;
    message?: string;
    codes?: string[];
};

export type ApiResponse<T> = {
    data?: T;
    message?: string;
    error?: ApiError
}

