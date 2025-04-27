export default interface ChangeNameDto {
    firstName: string;
    lastName: string;
}


// Error messages for the RegisterValidator
export const ErrorCodes: Record<string, {message: string, type: ErrorType}> = {
    FIRSTNAME_NOT_CORRECT_FORMAT : { message: "settings:account.personalInfo.errorMessages.changeName.firstNameNotCorrectFormat", type: "FirstName" },
    LASTNAME_NOT_CORRECT_FORMAT : { message: "settings:account.personalInfo.errorMessages.changeName.lastNameNotCorrectFormat", type: "LastName" },
    UNKNOWN_ERROR : { message: "settings:account.personalInfo.errorMessages.changeName.unknownError", type: "UnknownError" },
    INTERNAL_SERVER_ERROR : { message: "settings:account.personalInfo.errorMessages.changeName.internalServerError", type: "InternalServerError" },
}

export type ErrorType = "FirstName" | "LastName" | "UnknownError" | "InternalServerError";
export type ErrorKey = keyof typeof ErrorCodes;