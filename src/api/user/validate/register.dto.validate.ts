import RegisterDto, { ErrorCodes } from "@/api/user/dto/register.dto";

export class RegisterValidator {
    static validate(dto: RegisterDto): string[] {
      const errors: string[] = [];
      if (!dto.username || !/^[0-9a-zA-Z]{2,}$/.test(dto.username)) {
        errors.push(ErrorCodes.USERNAME_NOT_CORRECT_FORMAT);
      }  
      if (!dto.password || !/^\S{9,}$/.test(dto.password)) {
        errors.push(ErrorCodes.PASSWORD_NOT_CORRECT_FORMAT);
      }  
      if (!dto.email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(dto.email)) {
        errors.push(ErrorCodes.EMAIL_NOT_CORRECT_FORMAT);
      }
      if (!dto.firstName || !/^[\p{L}]+$/u.test(dto.firstName)) {
        errors.push(ErrorCodes.FIRSTNAME_NOT_CORRECT_FORMAT);
      }
      if (!dto.lastName || !/^[\p{L}]+$/u.test(dto.lastName)) {
        errors.push(ErrorCodes.LASTNAME_NOT_CORRECT_FORMAT);
      }  
      if (dto.phone && !/^0[0-9]{10,}$/.test(dto.phone)) {
        errors.push(ErrorCodes.PHONE_NUMBER_NOT_CORRECT_FORMAT);
      }  
      return errors;
    }
  }