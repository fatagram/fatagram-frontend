export interface RegisterDto {
  username: string;
  email: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
  isRememberMe?: boolean;
}
