export default interface ChangeUrlNameDto {
    urlName: string;
}

// Error codes for the RegisterValidator
export const ErrorCodes : Record<string, string> = {
    USER_NOT_FOUND : "settings:account.personalInfo.errorMessages.changeUrlName.userNotFound",
    URLNAME_EXIST : "settings:account.personalInfo.errorMessages.changeUrlName.urlNameAlreadyExist",
    URL_NAME_TOO_SHORT : "settings:account.personalInfo.errorMessages.changeUrlName.urlNameTooShort",
    URL_NAME_TOO_LONG : "settings:account.personalInfo.errorMessages.changeUrlName.urlNameTooLong",
    URL_NAME_EMPTY : "settings:account.personalInfo.errorMessages.changeUrlName.urlNameEmpty",
    URL_NAME_CONTAINS_SPACE : "settings:account.personalInfo.errorMessages.changeUrlName.urlNameContainsSpace",
    UNKNOWN_ERROR : "settings:account.personalInfo.errorMessages.changeUrlName.unknownError",
    INTERNAL_SERVER_ERROR : "settings:account.personalInfo.errorMessages.changeUrlName.internalServerError",
}

export type ErrorKey = keyof typeof ErrorCodes;
