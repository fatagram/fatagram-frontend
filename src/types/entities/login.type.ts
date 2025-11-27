import * as Yup from "yup";

export interface LoginDto {
  usernameOrEmail: string;
  password: string;
  isRememberMe?: boolean;
}
