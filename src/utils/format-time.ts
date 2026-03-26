import { timeDistance } from "@/utils/time-distance";
import { useTranslation } from "react-i18next";

type TimeUnit = "second" | "minute" | "hour" | "day";

export const useFormatTime = () => {
  const { t } = useTranslation();

  const formatTime = (rawTime: string | Date) => {
    const _rawTime = new Date(rawTime);
    const time = timeDistance(_rawTime);

    if (time.count) {
      return t(`${time.unit}`, { count: time.count }) + " " + t(time.text);
    }
    return t("times:just_now");
  };

  const formatSmartTimestamp = (date: Date | string) => {
    const _date = new Date(date);
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffInDays = Math.floor(
      (startOfToday.getTime() -
        new Date(_date.getFullYear(), _date.getMonth(), _date.getDate()).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) {
      return _date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    if (diffInDays === 1) {
      const time = _date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return `${t("times:yesterday")} ${time}`;
    }

    if (diffInDays < 7) {
      // const weekday = _date.toLocaleDateString("vi-VN", { weekday: "long" });
      const time = _date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return `${t(`times:weekday:${_date.getDay()}`)} ${time}`;
    }

    return _date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const getDiffBetween = (
    startDate: string | Date,
    endDate: string | Date,
    unit: TimeUnit = "minute",
  ): number => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    // Tính trị tuyệt đối (Absolute) để tránh số âm nếu truyền ngược thứ tự
    const diffMs = Math.abs(end - start);

    const factors = {
      second: 1000,
      minute: 1000 * 60,
      hour: 1000 * 60 * 60,
      day: 1000 * 60 * 60 * 24,
    };

    return Math.floor(diffMs / factors[unit]);
  };

  return { formatTime, formatSmartTimestamp, getDiffBetween };
};
