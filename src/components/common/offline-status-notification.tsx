import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "@/contexts";
import { Text, Logo, Button, Footer } from "@/components/atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { WifiOff } from "lucide-react";

export const OfflineStatusNotification = () => {
  const { t } = useTranslation("common");
  const { showSnackbar } = useSnackbar();

  const [isMounted, setIsMounted] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setIsOffline(true);
      wasOfflineRef.current = true;
    }

    const handleOnline = () => {
      setIsOffline(false);
      setIsChecking(false);

      if (wasOfflineRef.current) {
        wasOfflineRef.current = false;
        showSnackbar(t("offline.connected_back"), "success");
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      wasOfflineRef.current = true;
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [showSnackbar, t]);

  // Lock body scroll when offline overlay is shown
  useEffect(() => {
    if (!isMounted) return;

    if (isOffline) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOffline, isMounted]);

  const handleRetry = async () => {
    if (isChecking) return;
    setIsChecking(true);

    try {
      if (!navigator.onLine) {
        throw new Error("Offline");
      }

      await fetch("/favicon.ico", {
        method: "HEAD",
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });

      setIsOffline(false);
      wasOfflineRef.current = false;
      showSnackbar(t("offline.connected_back"), "success");
    } catch {
      showSnackbar(t("offline.still_offline"), "warning");
    } finally {
      setIsChecking(false);
    }
  };

  if (!isMounted || !isOffline) return null;

  return (
    <div
      style={{
        paddingTop: "calc(env(safe-area-inset-top) + 16px)",
        paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-between p-4 sm:p-8 bg-bg-main select-none overflow-y-auto min-h-[100dvh]"
    >
      <div className="w-full flex justify-center pt-2">
        <Logo hasSlogan={false} sz="md" />
      </div>

      <div className="w-full max-w-[360px] sm:max-w-md px-4 flex flex-col items-center text-center gap-4 my-auto">
        <div className="w-20 h-20 rounded-2xl bg-bg-fourth/80 border border-bg-fourth flex items-center justify-center text-text-second shadow-sm">
          <WifiOff className="w-9 h-9 text-text-third opacity-80 stroke-[2]" />
        </div>

        <div className="flex flex-col items-center text-center gap-2 mt-1 w-full">
          <Text sz="xl" weight="bold" wrap="whitespace-normal" className="text-text-main text-center">
            {t("offline.fullTitle")}
          </Text>
          <Text
            sz="sm"
            color="secondary"
            wrap="whitespace-normal"
            className="text-text-third leading-relaxed text-center"
          >
            {t("offline.fullDescription")}
          </Text>
        </div>

        <Button
          variant="primary"
          sz="md"
          onClick={handleRetry}
          disabled={isChecking}
          className="mt-2 min-w-[140px] flex items-center justify-center gap-2"
        >
          {isChecking ? (
            <>
              <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-sm" />
              <span>{t("offline.checking")}</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faRotateRight} className="text-sm" />
              <span>{t("offline.retry")}</span>
            </>
          )}
        </Button>
      </div>

      <Footer className="text-text-third" />
    </div>
  );
};

