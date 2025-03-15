// Purpose: DTO for the Register endpoint.
export default interface RegisterDto {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

// Error codes for the RegisterValidator
export enum ErrorCodes {
    USERNAME_NOT_CORRECT_FORMAT = "USERNAME_NOT_CORRECT_FORMAT",
    PASSWORD_NOT_CORRECT_FORMAT = "PASSWORD_NOT_CORRECT_FORMAT",
    EMAIL_NOT_CORRECT_FORMAT = "EMAIL_NOT_CORRECT_FORMAT",
    FIRSTNAME_NOT_CORRECT_FORMAT = "FIRSTNAME_NOT_CORRECT_FORMAT",
    LASTNAME_NOT_CORRECT_FORMAT = "LASTNAME_NOT_CORRECT_FORMAT",
    PHONE_NOT_CORRECT_FORMAT = "PHONE_NOT_CORRECT_FORMAT",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    REGISTER_USERNAME_EXISTED = "REGISTER_USERNAME_EXISTED",
    REGISTER_FAILED = "REGISTER_FAILED",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
}

// Error messages for the RegisterValidator
export const ErrorMessages: Record<string, string> = {
    "USERNAME_NOT_CORRECT_FORMAT" : "Invalid username format.",
    "PASSWORD_NOT_CORRECT_FORMAT" : "Password must be at least 8 characters long.",
    "EMAIL_NOT_CORRECT_FORMAT" : "Invalid email format. Example: example@mail.com",
    "FIRSTNAME_NOT_CORRECT_FORMAT" : "Invalid first name",
    "LASTNAME_NOT_CORRECT_FORMAT" : "Invalid last name.",
    "PHONE_NOT_CORRECT_FORMAT" : "Invalid phone.",
    "UNKNOWN_ERROR" : "An unknown error occurred.",
    "REGISTER_USERNAME_EXISTED": "Username already exists.",
    "REGISTER_FAILED" : "Registration failed.",
    "INTERNAL_SERVER_ERROR" : "Internal server error."
}

export type ErrorKey = keyof typeof ErrorMessages;

