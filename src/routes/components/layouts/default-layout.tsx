import Layout from "@/components/layout";
import Navbar from "@/components/organisms/navigation/navbar";
import NavbarFooter from "@/components/organisms/navigation/navbar/navbar-footer";
import { LoginForm, RegisterForm } from "@/features/auth/components";
import { useSize } from "@/hooks/use-size";
import { useAuth } from "@/hooks/utilities/use-auth";
import { useDialog } from "@/hooks/utilities/use-dialog";
import { useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  const { isAuthenticated, isInitialized } = useAuth();
  const { openDialog, closeDialog } = useDialog();

  const [headerRef, headerSize] = useSize<HTMLHeadElement>();

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
    if (!isInitialized) return;

    if (isAuthenticated) {
      closeDialog();
    } else {
      openLoginOverlay();
    }

    return () => closeDialog();
  }, [isAuthenticated, isInitialized, closeDialog, openLoginOverlay]);

  return (
    <Layout>
      <Layout.Header ref={headerRef}>
        <Navbar
          isAuthenticated={isAuthenticated}
          onLogin={openLoginOverlay}
          onSignup={openRegisterOverlay}
        />
      </Layout.Header>
      <Layout.Main style={{ paddingTop: headerSize?.height }}>
        <Outlet />
      </Layout.Main>
      <Layout.Footer>
        <NavbarFooter isAuthenticated={isAuthenticated} />
      </Layout.Footer>
    </Layout>
  );
};

export default DefaultLayout;
