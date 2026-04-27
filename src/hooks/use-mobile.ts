import { useEffect, useState } from "react";
import { useMediaQuery } from "./use-media-query";

export const useMobile = () => {
  const matches = useMediaQuery("(max-width: 640px)");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isMobile = mounted ? matches : false;

  return isMobile;
};
