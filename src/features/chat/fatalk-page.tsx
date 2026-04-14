import { Outlet, useLocation } from "react-router-dom";
import { FatalkSidebar } from "./components/fatalk-sidebar";
import { SidebarLayout } from "@/components/ui/sidebar-layout/sidebar-layout";
import clsx from "clsx";
import { NotFound } from "../components/not-found";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const FatalkPage = () => {
  const { pathname } = useLocation();
  const isExactPath = pathname === "/fatalk" || pathname === "/fatalk/";
  const isChatDetailPath = pathname === "/fatalk/temp" || /^\/fatalk\/[^/]+$/.test(pathname);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isChatDetailPath) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverscroll = html.style.overscrollBehaviorY;
    const prevBodyOverscroll = body.style.overscrollBehaviorY;
    html.style.overscrollBehaviorY = "none";
    body.style.overscrollBehaviorY = "none";

    let touchStartY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? 0;
      const isPullingDown = currentY > touchStartY;
      if (!isPullingDown) return;

      const target = event.target as HTMLElement | null;
      const findScrollableAncestor = (el: HTMLElement | null) => {
        let node: HTMLElement | null = el;

        while (node && node !== document.body) {
          const style = window.getComputedStyle(node);
          const canScrollY =
            (style.overflowY === "auto" || style.overflowY === "scroll") &&
            node.scrollHeight > node.clientHeight;

          if (canScrollY) {
            return node;
          }
          node = node.parentElement;
        }

        return null;
      };

      const scrollContainer =
        (target?.closest?.("[data-chat-scrollable='true']") as HTMLElement | null) ||
        findScrollableAncestor(target);

      if (scrollContainer && scrollContainer.scrollTop > 0) {
        return;
      }

      if (window.scrollY <= 0 && (!scrollContainer || scrollContainer.scrollTop <= 0)) {
        event.preventDefault();
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      html.style.overscrollBehaviorY = prevHtmlOverscroll;
      body.style.overscrollBehaviorY = prevBodyOverscroll;
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isChatDetailPath]);

  return (
    <SidebarLayout
      title="Fatalk"
      navbar={<FatalkSidebar className="h-full" />}
      showMenuButton={false}
      sidebarClassName={clsx("lg:w-[400px] w-full", "max-w-full !transition-none")}
      showSidebar={isExactPath}
      showOverlay={false}
    >
      <div className="flex flex-col w-full h-[calc(100dvh-var(--header-height))] ">
        <Outlet />

        {isExactPath && (
          <div
            className={clsx(
              "flex flex-col items-center justify-center flex-1",
              "",
              "gap-4 opacity-50",
            )}
          >
            <NotFound
              title={t("common:conversations.noSelectConversation")}
              icon={"fa-solid fa-message"}
              description={t("common:conversations.noSelectConversationMessage")}
            />
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default FatalkPage;
