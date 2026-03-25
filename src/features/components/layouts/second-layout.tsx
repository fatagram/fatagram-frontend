import Layout from "@/components/ui/layout";
import { Outlet } from "react-router-dom";

const SecondLayout = () => {
  return (
    <Layout>
      <Layout.Main className="flex-1">
        <Outlet />
      </Layout.Main>
      <Layout.Footer>
        <div className="bg-bg-second text-center py-4">
          <p className="text-sm text-text-secondary">&copy; 2026 Fatagram. All rights reserved.</p>
        </div>
      </Layout.Footer>
    </Layout>
  );
};

export default SecondLayout;
