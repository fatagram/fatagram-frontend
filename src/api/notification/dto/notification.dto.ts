import { TimeUnit } from "@/utils/time_unit";

export interface NotificationDto {
    id: string;
    userId: string;
    type: string;
    data: Record<string, string>;
    actorId: string;
    actorName: string;
    actorImageUrl?: string;
    link: string;
    content?: string;
    isRead: boolean;
    timeDistance: {
        value: number;
        unit: TimeUnit
    }
}

export interface NotificationsDto {
    notifications: NotificationDto[];
    unreadCount: number;
}