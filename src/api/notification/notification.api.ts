import { Result } from "@/api/common/result";
import apiUrl from '@/config';
import { NotificationsDto } from "./dto/notification.dto";
import { apiClient } from "../common/axiosInterceptor";
import { ApiResponse } from "../common/apiResponse";
import { handleApiError } from "../common/handleApiError";

const PREFIX = `/api/notification`;

export class NotificationService {

    public async getNotifications(cursorId: string, pageSize: number) : Promise<Result<NotificationsDto>> {
        try {
            const res = await apiClient.get(`${PREFIX}/getNotifications`, {
                params: {
                    cursorId,
                    pageSize
                }
            });
            const response = res.data as ApiResponse<NotificationsDto>;
            
            return {
                success: true,
                data: response.data
            }
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    public async markAsRead(notificationId: string) : Promise<Result<any>> {
        try {
            await apiClient.post(`${PREFIX}/markNotificationAsRead/${notificationId}`);
            return {
                success: true,
            }
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }
}

export const notificationService = new NotificationService();