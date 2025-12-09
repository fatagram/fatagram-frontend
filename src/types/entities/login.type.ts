export interface LoginDto {
  usernameOrEmail: string;
  password: string;
  isRememberMe?: boolean;
}
