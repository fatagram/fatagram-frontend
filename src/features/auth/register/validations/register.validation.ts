import * as Yup from "yup";
import { RegisterDto } from "@/types/entities";

export const registerInitialValues: RegisterDto = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  isRememberMe: true,
};

export const registerValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required("auth:register.errors.username.required")
    .min(3, "auth:register.errors.username.tooShort")
    .max(30, "auth:register.errors.username.tooLong")
    .matches(/^[a-zA-Z0-9_]+$/, "auth:register.errors.username.notCorrectFormat"),
  email: Yup.string()
    .required("auth:register.errors.email.required")
    .email("auth:register.errors.email.notCorrectFormat"),
  password: Yup.string()
    .required("auth:register.errors.password.required")
    .min(8, "auth:register.errors.password.tooShort")
    .max(100, "auth:register.errors.password.tooLong"),
  confirmPassword: Yup.string()
    .required("auth:register.errors.confirmPassword.required")
    .oneOf([Yup.ref("password")], "auth:register.errors.passwords.doNotMatch"),
});

export const registerErrorCodeMap: Record<
  string,
  { message: string; type: "username" | "email" | "phoneNumber" | "password" | "confirmPassword" }
> = {
  USERNAME_EXISTED: {
    message: "auth:register.errors.username.alreadyExists",
    type: "username",
  },
  EMAIL_EXISTED: { message: "auth:register.errors.email.alreadyExists", type: "email" },
  PHONE_NUMBER_EXISTED: {
    message: "auth:register.errors.phoneNumber.alreadyExists",
    type: "phoneNumber",
  },
  USERNAME_IS_NOT_VALID: {
    message: "auth:register.errors.username.notCorrectFormat",
    type: "username",
  },
  PASSWORD_TOO_WEAK: { message: "auth:register.errors.password.tooWeak", type: "password" },
  UNKNOWN_ERROR: { message: "auth:register.errors.unknown", type: "username" },
};
