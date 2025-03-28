import axios from 'axios';
import apiUrl from '../../../../config';
import RegisterDto from '../../interfaces/RegisterDto';
import ServerResponse from '../../../../interfaces/ServerResponse';

const API_URL = `${apiUrl}/api/account/`;

export class RegisterService {
    // register method
    // This method is responsible for sending the register request to the server.
    // The method takes a RegisterDto object as a parameter.
    // The method returns a promise of ServerResponse.
    async register(dto: RegisterDto): Promise<ServerResponse> {
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
            if (error.response) {
                console.log(error.response.data);
                return {
                    success: false,
                    statusCode: error.response.status,
                    errorCodes: error.response.data.error?.code || []
                }
            }
            else {
                return {
                    success: false,
                    statusCode: 500,
                    errorCodes: ["INTERNAL_SERVER_ERROR"]
                }
            }
        }
    }
}
