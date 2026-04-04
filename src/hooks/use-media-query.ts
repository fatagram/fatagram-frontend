import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
  const getInitial = () => {
    if (typeof window === "undefined") return false;
    try {
      return window.matchMedia(query).matches;
    } catch {
      return false;
    }
  };

  const [matches, setMatches] = useState<boolean>(getInitial);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Some environments support addEventListener, others only addListener.
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    // Fallback for older browsers
    // @ts-ignore - some lib types still have addListener
    mediaQuery.addListener(handleChange);
    return () => {
      // @ts-ignore
      mediaQuery.removeListener(handleChange);
    };
  }, [query]);

  return matches;
};
