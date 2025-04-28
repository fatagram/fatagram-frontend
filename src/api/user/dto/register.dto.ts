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
export const ErrorCodes: Record<string, string> = {
    USERNAME_NOT_CORRECT_FORMAT: "user:register.errorMessages.usernameNotCorrectFormat",
    PASSWORD_NOT_CORRECT_FORMAT: "user:register.errorMessages.passwordNotCorrectFormat",
    EMAIL_NOT_CORRECT_FORMAT: "user:register.errorMessages.emailNotCorrectFormat",
    FIRSTNAME_NOT_CORRECT_FORMAT: "user:register.errorMessages.firstnameNotCorrectFormat",
    LASTNAME_NOT_CORRECT_FORMAT: "user:register.errorMessages.lastnameNotCorrectFormat",
    PHONE_NUMBER_NOT_CORRECT_FORMAT: "user:register.errorMessages.phoneNotCorrectFormat",
    UNKNOWN_ERROR: "user:register.errorMessages.unknownError",
    REGISTER_USERNAME_EXISTED: "user:register.errorMessages.usernameExisted",
    REGISTER_FAILED: "user:register.errorMessages.registerFailed",
    EMAIL_EXISTED: "user:register.errorMessages.emailExisted",
    INTERNAL_SERVER_ERROR: "user:register.errorMessages.internalServerError"
}

export type ErrorKey = keyof typeof ErrorCodes;

