// Purpose: DTO for login requests.
export default interface LoginDto {
    username: string;
    password: string;
}

export interface LoginResponse {
    refreshToken: string;
    userId: string;
    urlName: string;
}

// Error codes for the LoginValidator
export const ErrorCodes : Record<string, string> = {
    USERNAME_NOT_CORRECT_FORMAT : "auth:login.errorMessages.usernameNotCorrectFormat",
    PASSWORD_NOT_CORRECT_FORMAT : "auth:login.errorMessages.passwordNotCorrectFormat",
    UNKNOWN_ERROR : "auth:login.errorMessages.unknownError",
    ACCOUNT_NOT_FOUND : "auth:login.errorMessages.accountNotFound",
    WRONG_PASSWORD : "auth:login.errorMessages.wrongPassword",
    INTERNAL_SERVER_ERROR : "auth:login.errorMessages.internalServerError",
}

export type ErrorKey = keyof typeof ErrorCodes;