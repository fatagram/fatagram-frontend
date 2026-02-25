import { NotificationType } from "@/api/notification/dto/notification.dto";

/**
 * Map notification type → i18n key under "notifications:notifications.*"
 * The translated value should contain `{actorName}` placeholder.
 */
const typeToI18nKey: Record<string, string> = {
  [NotificationType.NewFriendRequest]: "notifications:notifications.has-a-friend-request",
  [NotificationType.FriendRequestAccepted]: "notifications:notifications.accepted-friend-request",
  [NotificationType.FriendRequestCanceled]: "notifications:notifications.canceled-friend-request",
  [NotificationType.System]: "notifications:notifications.system-notification",
};

/**
 * Returns a content template string for a given notification type.
 * The result contains `{actorName}` which can be interpolated via `renderContent`.
 *
 * Falls back to raw `content` field if provided by the backend,
 * or a generic fallback if type is unknown.
 */
export function getNotificationContent(
  type: string,
  fallbackContent?: string,
  t?: (key: string) => string,
): string {
  const i18nKey = typeToI18nKey[type];

  if (i18nKey && t) {
    return `{actorName} ${t(i18nKey)}`;
  }

  if (fallbackContent) {
    return fallbackContent;
  }

  return t ? `{actorName} ${t("notifications:notifications.default-notification")}` : "{actorName}";
}
