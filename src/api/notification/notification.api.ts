import { CursorResult, Result } from "@/api/common/result";
import { NotificationDto } from "./dto/notification.dto";
import { apiClient } from "../common/axios-interceptor";
import { CursorResponse } from "../common/api-response";
import { handleApiError } from "../common/handle-api-error";
import { apiPost, apiDelete, buildApiPath } from "../common/api-helpers";
import { CursorQuery } from "@/types/query";

const PREFIX = buildApiPath("/notification");

export class NotificationService {
  public async getNotifications(
    query: CursorQuery<string>,
  ): Promise<Result<CursorResult<NotificationDto, string>>> {
    try {
      const res = await apiClient.get(`${PREFIX}`, {
        params: query,
      });
      console.log("API Response for getNotifications:", res.data);
      const resp = res.data as CursorResponse<string, NotificationDto> & {
        unreadCount?: number;
      };

      return {
        success: true,
        data: {
          data: resp.data ?? [],
          nextCursor: resp.nextCursor,
          hasNext: resp.hasNext,
        },
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  public async getUnreadNotifications(
    query: CursorQuery<string>,
  ): Promise<Result<CursorResult<NotificationDto, string>>> {
    try {
      const res = await apiClient.get(`${PREFIX}/unread`, {
        params: query,
      });
      const resp = res.data as CursorResponse<string, NotificationDto>;

      return {
        success: true,
        data: {
          data: resp.data ?? [],
          nextCursor: resp.nextCursor,
          hasNext: resp.hasNext,
        },
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  public async markAsRead(notificationId: string): Promise<Result<any>> {
    return apiPost(`${PREFIX}/read/${notificationId}`);
  }

  public async markAllAsRead(): Promise<Result<any>> {
    return apiPost(`${PREFIX}/read/all`);
  }

  public async getUnreadCount(): Promise<Result<number>> {
    try {
      const res = await apiClient.get(`${PREFIX}/unread`, {
        params: { limit: 1 },
      });
      return {
        success: true,
        data: res.data.unreadCount ?? 0,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // ---------- DELETE ----------

  public async deleteNotification(notificationId: string): Promise<Result<any>> {
    return apiDelete(`${PREFIX}/${notificationId}`);
  }

  public async deleteAllNotifications(): Promise<Result<any>> {
    return apiDelete(`${PREFIX}/all`);
  }
}

export const notificationService = new NotificationService();
