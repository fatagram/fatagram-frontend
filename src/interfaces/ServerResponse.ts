// LoginResponse interface
// This interface is used to define the response of the login request.
export interface ServerResponse {
    success: boolean;
    statusCode?: number;
    errorCodes?: string[];
}