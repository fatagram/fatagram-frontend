export default interface ChangeUrlNameDto {
    urlName: string;
}

// Error codes for the RegisterValidator
export enum ErrorCodes {
    USER_NOT_FOUND = "USER_NOT_FOUND",
    URL_NAME_ALREADY_EXIST = "URL_NAME_ALREADY_EXIST",
    URL_NAME_TOO_SHORT = "URL_NAME_TOO_SHORT",
    URL_NAME_TOO_LONG = "URL_NAME_TOO_LONG",
    URL_NAME_EMPTY = "URL_NAME_EMPTY",
    URL_NAME_CONTAINS_SPACE = "URL_NAME_CONTAINS_SPACE",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

// Error messages for the RegisterValidator
export const ErrorMessages: Record<string, string> = {
    "USER_NOT_FOUND" : "User not found.",
    "URL_NAME_ALREADY_EXIST" : "Url name already exists.",
    "URL_NAME_TOO_SHORT" : "Url name must be at least 3 characters long.",
    "URL_NAME_TOO_LONG" : "Url name must be less than 36 characters long.",
    "URL_NAME_EMPTY" : "Url name cannot be empty.",
    "URL_NAME_CONTAINS_SPACE" : "Url name cannot contain spaces.",
    "UNKNOWN_ERROR" : "An unknown error occurred.",
    "INTERNAL_SERVER_ERROR" : "Internal server error."
}

export type ErrorKey = keyof typeof ErrorMessages;