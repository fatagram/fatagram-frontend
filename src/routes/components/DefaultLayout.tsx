import Layout from "@/components/layout/Layout";
import Navbar from "@/components/organisms/Navigation/Navbar";
import NavbarFooter from "@/components/organisms/Navigation/Navbar/NavbarFooter";
import { useAuth } from "@/contexts/AuthContext";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {

    const { isAuthenticated } = useAuth();

    return (
        <Layout>
            <Layout.Header>
                <Navbar isAuthenticated={isAuthenticated} />
            </Layout.Header>
            <Layout.Main>
                <Outlet />
            </Layout.Main>
            <Layout.Footer>
                <NavbarFooter isAuthenticated={isAuthenticated}/>
            </Layout.Footer>
        </Layout>
    )
};

export default DefaultLayout;