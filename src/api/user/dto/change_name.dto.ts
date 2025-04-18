export default interface ChangeNameDto {
    firstName: string;
    lastName: string;
}

// Error codes for the RegisterValidator
export enum ErrorCodes {
    FIRSTNAME_NOT_CORRECT_FORMAT = "FIRSTNAME_NOT_CORRECT_FORMAT",
    LASTNAME_NOT_CORRECT_FORMAT = "LASTNAME_NOT_CORRECT_FORMAT",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

// Error messages for the RegisterValidator
export const ErrorMessages: Record<string, {message: string, type: ErrorType}> = {
    "FIRSTNAME_NOT_CORRECT_FORMAT" : { message: "Wrong first name format.", type: "FirstName" },
    "LASTNAME_NOT_CORRECT_FORMAT" : { message: "Wrong last name format.", type: "LastName" },
    "UNKNOWN_ERROR" : { message: "An unknown error occurred.", type: "UnknownError" },
    "INTERNAL_SERVER_ERROR" : { message: "Internal server error.", type: "InternalServerError" },
}

export type ErrorType = "FirstName" | "LastName" | "UnknownError" | "InternalServerError";
export type ErrorKey = keyof typeof ErrorMessages;