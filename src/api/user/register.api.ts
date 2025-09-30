import axios from "axios";
import RegisterDto from "./dto/register.dto";
import { handleApiError } from "../common/handleApiError";
import { Result } from "../common/result";

const PREFIX = `/api/account`;

export class RegisterService {
  // register method
  // This method is responsible for sending the register request to the server.
  // The method takes a RegisterDto object as a parameter.
  // The method returns a promise of ServerResponse.
  async register(dto: RegisterDto): Promise<Result<void>> {
    try {
      await axios.post(`${PREFIX}/register`, {
        username: dto.username,
        password: dto.password,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      });
      return { success: true };
    } catch (error: any) {
      return handleApiError(error);
    }
  }
}
