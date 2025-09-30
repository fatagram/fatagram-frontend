export default interface ChangeNicknameDto {
  nickname: string;
}

// Error codes for the RegisterValidator
export const ErrorCodes: Record<string, string> = {
  NICKNAME_TOO_LONG: "settings:account.personalInfo.errorMessages.changeNickname.nicknameTooLong",
};

export type ErrorKey = keyof typeof ErrorCodes;
