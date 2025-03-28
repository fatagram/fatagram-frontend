import LoginDto, { ErrorCodes } from "../interfaces/LoginDto";


export class LoginValidator {
    static validate(dto: LoginDto): string[] {
      const errors: string[] = [];
  
      if (!dto.username || !/^[0-9a-zA-Z]{2,}$/.test(dto.username)) {
        errors.push(ErrorCodes.USERNAME_NOT_CORRECT_FORMAT);
      }
  
      if (!dto.password || !/^\S{9,}$/.test(dto.password)) {
        errors.push(ErrorCodes.PASSWORD_NOT_CORRECT_FORMAT);
      }
  
      return errors;
    }
  }