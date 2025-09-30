import Layout from "@/components/layout/layout";
import Navbar from "@/components/organisms/navigation/navbar";
import NavbarFooter from "@/components/organisms/navigation/navbar/navbar-footer";
import { useAuth } from "@/contexts/auth/auth-context";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <Layout.Header>
        <Navbar isAuthenticated={isAuthenticated} />
      </Layout.Header>
      <Layout.Main className="pt-16">
        <Outlet />
      </Layout.Main>
      <Layout.Footer>
        <NavbarFooter isAuthenticated={isAuthenticated} />
      </Layout.Footer>
    </Layout>
  );
};

export default DefaultLayout;
