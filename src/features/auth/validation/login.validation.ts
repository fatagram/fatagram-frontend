import * as Yup from "yup";
import { LoginDto } from "@/types/entities";

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

export const errorCodeMap: Record<string, { message: string; type: "password" | "username" }> = {
  PASSWORD_INCORRECT: { message: "auth:login.errors.password.incorrect", type: "password" },
  ACCOUNT_NOT_FOUND: {
    message: "auth:login.errors.usernameOrEmail.notFound",
    type: "username",
  },
};
