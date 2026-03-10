import Layout from "@/components/layout";
import { Navbar } from "@/components/organisms";
import { LoginForm, RegisterForm } from "@/features/auth/components";
import { useSize } from "@/hooks/use-size";
import { useAuth } from "@/hooks/contexts/use-auth";
import { useDialog } from "@/hooks/contexts/use-dialog";
import { useCallback, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Logo } from "@/components/atoms/logo/logo";
import { NotificationBadge } from "@/features/notifications/components/notification-menu";
import { UserMenu } from "@/features/user/components";
import clsx from "clsx";
import { Button } from "@/components/atoms";

const DefaultLayout = () => {
  const { isAuthenticated } = useAuth();
  const { openDialog, closeDialog } = useDialog();
  const navigate = useNavigate();

  const [headerRef, headerSize] = useSize<HTMLHeadElement>();

  const items = [
    { icon: <i className="fa-solid fa-house"></i>, path: "/", isIndex: true },
    { icon: <i className="fa-solid fa-user-group"></i>, path: "/friends", isIndex: false },
  ];

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
    <Layout>
      <Layout.Header ref={headerRef}>
        <Navbar
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
              <div className={clsx("flex items-center gap-2")}>
                <NotificationBadge />
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
      <Layout.Main style={{ paddingTop: headerSize?.height }}>
        <Outlet />
      </Layout.Main>
    </Layout>
  );
};

export default DefaultLayout;
