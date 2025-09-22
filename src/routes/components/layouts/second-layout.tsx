import Layout from "@/components/layout/layout";
import { Outlet } from "react-router-dom";

const SecondLayout = () => {

    return (
        <Layout>
            <Layout.Main>
                <Outlet />
            </Layout.Main>
        </Layout>
    )
};

export default SecondLayout;