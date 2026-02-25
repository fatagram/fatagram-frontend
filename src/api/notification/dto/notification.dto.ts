// ---- Enums ----

export enum NotificationType {
  NewFriendRequest = "NewFriendRequest",
  FriendRequestAccepted = "FriendRequestAccepted",
  FriendRequestCanceled = "FriendRequestCanceled",
  System = "System",
  CancelNotification = "CancelNotification",
}

export enum ActorType {
  User = "User",
  System = "System",
  Group = "Group",
  Page = "Page",
}

export interface NotificationDto {
  id: string;
  userId: string;
  type: string;
  data: Record<string, string>;
  actorId: string;
  actorType?: ActorType;
  actorName: string;
  actorImageUrl?: string;
  link: string;
  content?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsDto {
  notifications: NotificationDto[];
  unreadCount: number;
}

export interface NotificationResponse {
  data: NotificationDto[];
  nextCursor?: string;
  hasNext: boolean;
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
  createdAt: new Date().toISOString(),
};
