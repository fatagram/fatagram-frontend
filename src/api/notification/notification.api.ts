import { CursorResult, Result } from "@/api/common/result";
import { NotificationDto } from "./dto/notification.dto";
import { apiPost, apiDelete, buildApiPath, apiGet } from "../common/api-helpers";
import { CursorQuery } from "@/types/query";

const PREFIX = buildApiPath("/notification");

export class NotificationService {
  public async getNotifications(
    query: CursorQuery<string>,
  ): Promise<Result<CursorResult<NotificationDto, string>>> {
    return await apiGet(`${PREFIX}`, query);
  }

  public async markAsRead(notificationId: string): Promise<Result<any>> {
    return await apiPost(`${PREFIX}/${notificationId}/read`);
  }

  public async markAllAsRead(): Promise<Result<any>> {
    return await apiPost(`${PREFIX}/read-all`);
  }

  public async getUnreadCount(): Promise<Result<number>> {
    return await apiGet(`${PREFIX}/unread-count`);
  }

  public async deleteNotification(notificationId: string): Promise<Result<any>> {
    return await apiDelete(`${PREFIX}/${notificationId}`);
  }

  public async deleteAllNotifications(): Promise<Result<any>> {
    return await apiDelete(`${PREFIX}`);
  }
}

export const notificationService = new NotificationService();
