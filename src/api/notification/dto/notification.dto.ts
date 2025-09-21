import { TimeUnit } from "@/utils/TimeUnit";

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

export const NotificationDefault: NotificationDto = {
    id: "",
    userId: "",
    type: "Unknown",
    data: {},
    actorId: "",
    actorName: "Unknown",
    actorImageUrl: "",
    link: "/",
    content: "You have a new notification",
    isRead: true,
    timeDistance: {
        value: 0,
        unit: TimeUnit.Miliseconds
    }
}