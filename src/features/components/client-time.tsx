import React, { useEffect, useState } from "react";
import { Text, TextProps } from "@/components/atoms";
import { useFormatTime } from "@/utils/time";

interface ClientTimeProps extends TextProps {
  time: string | Date;
  type?: "smart" | "distance";
}

export const ClientTime: React.FC<ClientTimeProps> = ({ time, type = "distance", ...props }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { formatTime, formatSmartTimestamp } = useFormatTime();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return <Text {...props} suppressHydrationWarning></Text>;
  }

  const displayTime = type === "smart" ? formatSmartTimestamp(time) : formatTime(time);

  return (
    <Text {...props} suppressHydrationWarning>
      {displayTime}
    </Text>
  );
};
