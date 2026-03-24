import Layout from "@/components/ui/layout";
import { useCallback, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Logo } from "@/components/atoms/logo/logo";
import { NotificationBadge } from "@/features/notifications/components/notification-menu";
import clsx from "clsx";
import { Button } from "@/components/atoms";
import { useAuth, useDialog } from "@/contexts";
import { LoginForm } from "@/features/auth/login/components/login-form";
import { RegisterForm } from "@/features/auth/register/components/register-form";
import { Navbar } from "@/components/ui";
import UserMenu from "../user-menu";
import { ChatLayer } from "@/features/chat/chat-layer";
import { ChatBadge } from "@/features/chat/components/chat-badge";

const DefaultLayout = () => {
  const { isAuthenticated } = useAuth();
  const { openDialog, closeDialog } = useDialog();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isFatalkPage = pathname.startsWith("/fatalk");

  const items = [
    { icon: <i className="fa-solid fa-house" />, path: "/", isIndex: true, showOnDesktop: true },
    {
      icon: <i className="fa-solid fa-user-group" />,
      path: "/friends",
      isIndex: false,
      showOnDesktop: true,
    },
    {
      icon: <i className="fa-solid fa-message" />,
      path: "/fatalk",
      isIndex: false,
      showOnDesktop: false,
    },
    {
      icon: <i className="fa-solid fa-bell" />,
      path: "/notifications",
      isIndex: false,
      showOnDesktop: false,
    },
  ];

  const pathHasTopBar = ["/", "/friends"].some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  const openLoginOverlay = useCallback(() => {
    openDialog({
      content: <LoginForm showLogo={false} />,
    });
  }, [openDialog]);

  const openRegisterOverlay = useCallback(() => {
    openDialog({
      content: <RegisterForm showLogo={false} />,
    });
  }, [openDialog]);

  useEffect(() => {
    if (isAuthenticated) {
      closeDialog();
    } else {
      openLoginOverlay();
    }

    return () => closeDialog();
  }, [isAuthenticated, closeDialog, openLoginOverlay]);

  const handleGoToHome = useCallback(() => {
    if (isAuthenticated) {
      navigate("/");
    } else {
      openLoginOverlay();
    }
  }, [isAuthenticated, openLoginOverlay]);

  return (
    <Layout className="">
      <Layout.Header className="sticky top-0">
        {pathHasTopBar && (
          <div className="flex items-center px-4 h-[25px] bg-bg-main sm:hidden block">
            <Logo sz="sm-2" hasSlogan={false} />
          </div>
        )}
        <Navbar
          style={{}}
          isAuthenticated={isAuthenticated}
          items={items}
          logo={
            <div
              onClick={handleGoToHome}
              className="sm:block hidden cursor-pointer items-center gap-2"
            >
              <Logo hasSlogan={false} sz="sm-3" />
            </div>
          }
          options={
            isAuthenticated ? (
              <div className={clsx("flex items-center gap-2 ")}>
                <div className="hidden sm:flex gap-2">
                  {!isFatalkPage && <ChatBadge />}
                  <NotificationBadge />
                </div>
                <UserMenu />
              </div>
            ) : (
              <div className={clsx("flex items-center gap-2")}>
                <Button sz="sm-1" variant="secondary" onClick={openLoginOverlay}>
                  Sign in
                </Button>
                <Button sz="sm-1" variant="primary" onClick={openRegisterOverlay}>
                  Sign up
                </Button>
              </div>
            )
          }
        />
      </Layout.Header>
      <Layout.Main className="flex-1">
        <Outlet />
        <div className="fixed inset-0 pointer-events-none z-50">
          <ChatLayer className="absolute bottom-0 right-4 pointer-events-auto" />
        </div>
      </Layout.Main>
    </Layout>
  );
};

export default DefaultLayout;
