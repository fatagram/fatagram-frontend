import { timeDistance } from "@/utils/time-distance";
import { useTranslation } from "react-i18next";

export const useFormatTime = () => {
  const formatTime = (rawTime: string | Date) => {
    const _rawTime = new Date(rawTime);
    const time = timeDistance(_rawTime);
    console.log("time", time);
    const { t } = useTranslation();

    if (time.count) {
      return t(`${time.unit}`, { count: time.count }) + " " + t(time.text);
    }
    return t("times:time.just-now");
  };

  return formatTime;
};
