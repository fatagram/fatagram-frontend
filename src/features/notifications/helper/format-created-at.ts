import { timeDistance } from "@/utils/time-distance";
import { TFunction } from "i18next";

/**
 * Formats an ISO `createdAt` string into a human-readable relative time
 * using the existing `timeDistance` helper and i18n translations.
 */
export function formatCreatedAt(createdAt: string, t: TFunction): string {
  const date = new Date(createdAt);
  if (isNaN(date.getTime())) return "";

  const result = timeDistance(date);

  if (!result.unit) {
    // "just now" or raw date string
    return t(result.text);
  }

  return t(result.text, {
    count: result.count,
    unit: t(result.unit),
  });
}
