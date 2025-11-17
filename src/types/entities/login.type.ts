import * as Yup from "yup";

export interface LoginDto {
  usernameOrEmail: string;
  password: string;
  isRememberMe?: boolean;
}

export const loginInitialValues: LoginDto = {
  usernameOrEmail: "",
  password: "",
  isRememberMe: true,
};

export const loginValidationSchema = Yup.object().shape({
  usernameOrEmail: Yup.string()
    .required("auth:login.errors.usernameOrEmail.required")
    .test(
      "IS_VALID_USERNAME_OR_EMAIL",
      "auth:login.errors.usernameOrEmail.invalidFormat",
      function (value) {
        if (!value) return false;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
        return emailRegex.test(value) || usernameRegex.test(value);
      },
    ),
  password: Yup.string()
    .required("auth:login.errors.password.required")
    .min(6, "auth:login.errors.password.tooShort"),
});
