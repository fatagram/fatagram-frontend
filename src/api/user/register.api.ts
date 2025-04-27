import axios from 'axios';
import apiUrl from '@/config';
import RegisterDto from './dto/register.dto';
import { ApiResponse, Result } from '../common';

const API_URL = `${apiUrl}/api/account/`;

export class RegisterService {
    // register method
    // This method is responsible for sending the register request to the server.
    // The method takes a RegisterDto object as a parameter.
    // The method returns a promise of ServerResponse.
    async register(dto: RegisterDto): Promise<Result<void>> {
        try {
            await axios.post(`${API_URL}register`, {
                username: dto.username,
                password: dto.password,
                email: dto.email,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone
            });
            return { success: true };
        }
        catch (error: any) {
            const err = error.response.data as ApiResponse<void>;
            if (error.response) {
                return {
                    success: false,
                    errorCode: err.error?.code || "UNKNOWN_ERROR",
                    errorCodes: err.error?.codes
                }
            }
            else {
                return {
                    success: false,
                    errorCode: "INTERNAL_SERVER_ERROR",
                    errorCodes: ["INTERNAL_SERVER_ERROR"]
                }
            }
        }
    }
}
