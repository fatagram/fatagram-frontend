import * as Yup from "yup";

export interface RegisterDto {
  username: string;
  email: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
  isRememberMe?: boolean;
}

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
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "auth:register.errors.username.notCorrectFormat"
    ),
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
