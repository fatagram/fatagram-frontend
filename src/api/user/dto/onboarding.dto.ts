export default interface OnboardingDto {
  firstName: string;
  middleName?: string;
  lastName: string;
  birthday: string;
  gender: string;
}

export const ErrorCodes: Record<string, { message: string; type: ErrorType }> = {
  FIRSTNAME_REQUIRED: {
    message: "onboarding:errorMessages.firstNameRequired",
    type: "FirstName",
  },
  FIRSTNAME_TOO_SHORT: {
    message: "onboarding:errorMessages.firstNameTooShort",
    type: "FirstName",
  },
  LASTNAME_REQUIRED: {
    message: "onboarding:errorMessages.lastNameRequired",
    type: "LastName",
  },
  LASTNAME_TOO_SHORT: {
    message: "onboarding:errorMessages.lastNameTooShort",
    type: "LastName",
  },
  BIRTHDAY_REQUIRED: {
    message: "onboarding:errorMessages.birthdayRequired",
    type: "Birthday",
  },
  BIRTHDAY_INVALID: {
    message: "onboarding:errorMessages.birthdayInvalid",
    type: "Birthday",
  },
  GENDER_REQUIRED: {
    message: "onboarding:errorMessages.genderRequired",
    type: "Gender",
  },
  UNKNOWN_ERROR: {
    message: "onboarding:errorMessages.unknownError",
    type: "UnknownError",
  },
};

export type ErrorType = "FirstName" | "LastName" | "Birthday" | "Gender" | "UnknownError";
export type ErrorKey = keyof typeof ErrorCodes;
