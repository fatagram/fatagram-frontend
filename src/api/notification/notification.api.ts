import { ApiResponse, Result } from '@/api/common';
import { handleApiError } from "../common";
import { NotificationDto, NotificationsDto } from "./dto/notification.dto";
import { apiClient } from '../setupInterceptor';
import apiUrl from '@/config';

const API_URL = `${apiUrl}/api/notification`;

export class NotificationService {

    public async getNotifications(page: number, pageSize: number) : Promise<Result<NotificationsDto>> {
        try {
            const res = await apiClient.get(`${API_URL}/getNotifications`, {
                params: {
                    page,
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
            await apiClient.post(`${API_URL}/markNotificationAsRead/${notificationId}`);
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