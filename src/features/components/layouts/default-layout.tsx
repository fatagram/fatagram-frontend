import Layout from "@/components/ui/layout";
import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { Text, Logo } from "@/components/atoms";
import { NotificationBadge } from "@/features/notifications/components/notification-menu";
import clsx from "clsx";
import { Button } from "@/components/atoms";
import { useAuth, useDialog } from "@/contexts";
import { LoginForm } from "@/features/auth/login/components/login-form";
import { RegisterForm } from "@/features/auth/register/components/register-form";
import { Navbar, BadgeCount } from "@/components/ui";
import UserMenu from "../user-menu";
import { ChatLayer } from "@/features/chat/chat-layer";
import { ChatBadge } from "@/features/chat/components/chat-badge";
import { useUnreadCount } from "@/features/notifications/hooks/use-notification-store";
import { useConversationStore } from "@/features/chat/services/conversation-manager";

const MessageIconWithBadge = () => {
  const unreadCount = useConversationStore((state) => state.totalUnreadCount);

  return (
    <div className="relative">
      <i className="fa-solid fa-message" />
      {unreadCount > 0 && (
        <BadgeCount
          count={unreadCount}
          max={99}
          size="xs"
          variant="primary"
          className="absolute -top-1 left-3"
        />
      )}
    </div>
  );
};

const NotificationIconWithBadge = () => {
  const { unreadCount } = useUnreadCount();

  return (
    <div className="relative">
      <i className="fa-solid fa-bell" />
      {unreadCount > 0 && (
        <BadgeCount
          count={unreadCount}
          max={99}
          size="xs"
          variant="primary"
          className="absolute -top-1 left-2"
        />
      )}
    </div>
  );
};

const DefaultLayout = () => {
  const { isAuthenticated } = useAuth();
  const isAuthed = Boolean(isAuthenticated);
  const { openDialog, closeDialog } = useDialog();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isFatalkPage = pathname.startsWith("/fatalk");

  const headerRef = useRef<HTMLDivElement>(null);

  const items = [
    { icon: <i className="fa-solid fa-house" />, path: "/", isIndex: true, showOnDesktop: true },
    {
      icon: <i className="fa-solid fa-user-group" />,
      path: "/friends",
      isIndex: false,
      showOnDesktop: true,
    },
    {
      icon: <MessageIconWithBadge />,
      path: "/fatalk",
      isIndex: false,
      showOnDesktop: false,
    },
    {
      icon: <NotificationIconWithBadge />,
      path: "/notifications",
      isIndex: false,
      showOnDesktop: false,
    },
  ];

  // const pathHasTopBar = ["/", "/friends"].some(
  //   (path) => pathname === path || pathname.startsWith(path + "/"),
  // );

  const { conversationId } = useParams();
  // Initialize to a stable value to avoid SSR/CSR hydration mismatch.
  // The real value will be determined on the client in useEffect.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Determine initial value on client mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        document.documentElement.style.setProperty("--header-height", `${height}px`);
      }
    });
    resizeObserver.observe(headerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const openLoginOverlay = useCallback(() => {
    if (isMobile) {
      navigate("/login");
      return;
    }
    openDialog({
      content: <LoginForm showLogo={false} />,
    });
  }, [isMobile, openDialog]);

  const openRegisterOverlay = useCallback(() => {
    if (isMobile) {
      navigate("/register");
      return;
    }
    openDialog({
      content: <RegisterForm showLogo={false} />,
    });
  }, [isMobile, openDialog]);

  useEffect(() => {
    if (isAuthed) {
      closeDialog();
    } else {
      if (isMobile) return;
      openLoginOverlay();
    }

    return () => closeDialog();
  }, [isMobile, isAuthenticated, closeDialog, openLoginOverlay]);

  const handleGoToHome = useCallback(() => {
    if (isAuthed) {
      navigate("/");
    } else {
      if (!isMobile) {
        navigate("/login");
        return;
      }
      openLoginOverlay();
    }
  }, [isMobile, isAuthenticated, openLoginOverlay]);

  return (
    <Layout>
      <Layout.Header
        className={clsx(
          isMobile && conversationId && "hidden",
          "sticky top-0 z-[100] sm:!shadow-[0_1px_0_0_rgb(var(--bg-fourth))] shadow-none",
        )}
        ref={headerRef}
      >
        <div
          className={clsx(
            "flex items-center justify-center px-4 h-[44px] bg-bg-main border-b border-bg-fourth",
            isMobile && pathname === "/" ? "flex" : "hidden",
          )}
        >
          <div onClick={handleGoToHome} className="cursor-pointer">
            <Logo sz="md" hasSlogan={false} />
          </div>
        </div>
        <Navbar
          isAuthenticated={isAuthed}
          items={items}
          logo={
            !isMobile && (
              <div
                onClick={handleGoToHome}
                className="sm:block hidden cursor-pointer items-center gap-2"
              >
                <Logo hasSlogan={false} sz="md" />
              </div>
            )
          }
          optionClassName="!justify-end"
          options={
            isAuthed ? (
              <div className={clsx("flex items-center gap-2")}>
                <div className="hidden sm:flex gap-2">
                  {!isFatalkPage && <ChatBadge />}
                  <NotificationBadge />
                </div>
                <UserMenu />
              </div>
            ) : (
              !isMobile && (
                <div className={clsx("flex items-center gap-2")}>
                  <Button
                    sz="sm"
                    variant="secondary"
                    className="whitespace-nowrap inline-flex"
                    onClick={openLoginOverlay}
                  >
                    Sign in
                  </Button>
                  <Button
                    sz="sm"
                    variant="primary"
                    className="whitespace-nowrap inline-flex"
                    onClick={openRegisterOverlay}
                  >
                    Sign up
                  </Button>
                </div>
              )
            )
          }
        />
      </Layout.Header>
      <Layout.Main className="flex-1 flex flex-col scrollbar-hide sm:scrollbar-default">
        <Outlet />

        {!isMobile && (
          <div className="fixed inset-0 pointer-events-none z-30">
            <ChatLayer className="absolute bottom-0 right-4 pointer-events-auto" />
          </div>
        )}
      </Layout.Main>
      {isMobile && !isAuthenticated && (
        <div
          className={clsx(
            "flex flex-col fixed bottom-0 left-0 right-0 bg-bg-sixth/80 backdrop-blur-sm py-12 px-6 z-[9999]",
            "gap-6 border-t-2 border-primary-500/50 rounded-t-2xl shadow-lg",
          )}
        >
          <Text sz="sm" className="text-center" wrap="whitespace-normal">
            Join Fawe to connect with your friends and the world around you!
          </Text>
          <div className="flex items-center justify-center h-full">
            <Button
              sz="sm"
              variant="primary"
              className="whitespace-nowrap inline-flex flex-1 justify-center"
              onClick={openLoginOverlay}
            >
              Sign in
            </Button>
            <Button
              sz="sm"
              variant="secondary"
              className="whitespace-nowrap inline-flex ml-4 flex-1 justify-center"
              onClick={openRegisterOverlay}
            >
              Sign up
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default DefaultLayout;
