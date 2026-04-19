import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const OfflineStatusNotification = () => {
  const { t } = useTranslation("common");
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsVisible(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsVisible(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (!navigator.onLine) {
      setIsOnline(false);
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      setIsOnline(true);
      setIsVisible(false);
    }
  };

  if (!isVisible || isOnline) return null;

  return (
    <div
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
      className="fixed inset-x-0 z-[9999] flex justify-center pointer-events-none px-4"
    >
      <div className="pointer-events-auto inline-flex items-center gap-3 px-5 py-3 bg-bg-fourth text-text-main rounded-full shadow-sm shadow-warning border border-border-main animate-slide-up-in max-w-sm w-full">
        <div className="relative flex h-3 w-3 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning/40 opacity-60" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-warning" />
        </div>

        <span className="text-sm font-medium flex-1 truncate">{t("offline.message")}</span>

        <button
          onClick={handleRetry}
          className="flex-shrink-0 px-3 py-1.5 rounded-full border border-warning text-warning text-xs font-semibold hover:bg-warning/10 active:scale-95 transition-all duration-150"
        >
          {t("offline.retry")}
        </button>
      </div>
    </div>
  );
};
