// Purpose: DTO for login requests.
export interface LoginDto {
    username: string;
    password: string;
}

// Error codes for the LoginValidator
export enum ErrorCodes {
    USERNAME_NOT_CORRECT_FORMAT = "USERNAME_NOT_CORRECT_FORMAT",
    PASSWORD_NOT_CORRECT_FORMAT = "PASSWORD_NOT_CORRECT_FORMAT",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    ACCOUNT_NOT_FOUND = "ACCOUNT_NOT_FOUND",
    WRONG_PASSWORD = "WRONG_PASSWORD",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
}


// Maaping error codes to error messages
export const ErrorMessages: Record<string, string> = {
    "USERNAME_NOT_CORRECT_FORMAT" : "Invalid username format.",
    "PASSWORD_NOT_CORRECT_FORMAT" : "Password has at least 8 characters.",
    "UNKNOWN_ERROR" : "An unknown error occurred.",
    "ACCOUNT_NOT_FOUND" : "Username does not exist.",
    "WRONG_PASSWORD" : "Password is incorrect.",
    "INTERNAL_SERVER_ERROR" : "Internal server error."
}

export type ErrorKey = keyof typeof ErrorMessages;