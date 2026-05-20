import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "@/contexts";
import { WifiOff, Wifi } from "lucide-react";
import Transition from "@/components/ui/utils/transition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const ToastSlideUpAnimation = {
  in: "animate-toast-slide-up-in",
  out: "animate-toast-slide-up-out",
  duration: 250,
};

export const OfflineStatusNotification = () => {
  const { t } = useTranslation("common");
  const { showSnackbar } = useSnackbar();

  const [isMounted, setIsMounted] = useState(false);
  const [status, setStatus] = useState<"offline" | "reconnecting" | "online">("online");
  const [showOffline, setShowOffline] = useState(false);
  const [showOnline, setShowOnline] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);

    const handleOnline = () => {
      setStatus("online");
      setShowOffline(false);

      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        setShowOnline(true);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setShowOnline(false);
        }, 3000);
      }, 300);
    };

    const handleOffline = () => {
      setStatus("offline");
      setShowOnline(false);

      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        setShowOffline(true);
      }, 300);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setStatus("offline");
      setShowOffline(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const handleRetry = () => {
    if (status === "reconnecting") return;
    setStatus("reconnecting");

    setTimeout(() => {
      if (navigator.onLine) {
        setStatus("online");
        showSnackbar(t("offline.connected_back"), "success");
        setShowOffline(false);

        if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = setTimeout(() => {
          setShowOnline(true);

          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            setShowOnline(false);
          }, 3000);
        }, 300);
      } else {
        setStatus("offline");
        showSnackbar(t("offline.still_offline"), "warning");
      }
    }, 1000);
  };

  if (!isMounted) return null;
  if (!showOffline && !showOnline) return null;

  return (
    <div
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
      className="fixed inset-x-0 z-[9999] flex flex-col items-center pointer-events-none px-4 sm:px-6 gap-2"
    >
      <Transition
        animation={ToastSlideUpAnimation}
        show={showOffline}
        className="w-full max-w-sm sm:max-w-md pointer-events-auto"
      >
        <div className="flex items-center gap-3.5 px-4 py-3.5 bg-bg-second text-text-main rounded-2xl shadow-[0_8px_32px_rgba(245,158,11,0.18)] border border-warning/30 transition-all duration-300 hover:border-warning/50 hover:shadow-[0_8px_32px_rgba(245,158,11,0.28)]">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-warning/15 text-warning flex-shrink-0 relative overflow-hidden">
            <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-warning/30 opacity-40" />
            <WifiOff className="w-5 h-5 text-warning relative z-10" />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[14px] font-bold text-text-main tracking-tight leading-tight">
              {t("offline.message")}
            </span>
            <span className="text-[11px] text-text-second/90 mt-0.5 font-medium leading-none">
              {status === "reconnecting" ? t("offline.connecting") : t("offline.check_connection")}
            </span>
          </div>

          <button
            onClick={handleRetry}
            disabled={status === "reconnecting"}
            className="flex-shrink-0 px-4 py-2 h-9 rounded-xl border border-warning/40 hover:border-warning text-warning hover:bg-warning/10 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none transition-all duration-200 text-xs font-semibold flex items-center justify-center gap-1.5 min-w-[80px] bg-warning/5"
          >
            {status === "reconnecting" ? (
              <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-xs"  />
            ) : (
              t("offline.retry")
            )}
          </button>
        </div>
      </Transition>

      <Transition
        animation={ToastSlideUpAnimation}
        show={showOnline}
        className="w-full max-w-sm sm:max-w-md pointer-events-auto"
      >
        <div className="flex items-center gap-3.5 px-4 py-3.5 bg-bg-second text-text-main rounded-2xl shadow-[0_8px_32px_rgba(34,197,94,0.18)] border border-success/30 transition-all duration-300 hover:border-success/50 hover:shadow-[0_8px_32px_rgba(34,197,94,0.28)]">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-success/15 text-success flex-shrink-0 relative overflow-hidden">
            <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-success/30 opacity-40" />
            <Wifi className="w-5 h-5 text-success relative z-10" />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[14px] font-bold text-text-main tracking-tight leading-tight">
              {t("offline.online_message")}
            </span>
            <span className="text-[11px] text-text-second/90 mt-0.5 font-medium leading-none">
              {t("offline.connected_back")}
            </span>
          </div>
        </div>
      </Transition>
    </div>
  );
};
