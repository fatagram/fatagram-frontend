import Layout from "@/components/ui/layout";
import { Outlet } from "react-router-dom";
import { FullFooter } from "@/components/ui/full-footer";

const SecondLayout = () => {
  return (
    <Layout>
      <Layout.Main className="min-h-dvh flex flex-col w-full">
        <Outlet />
      </Layout.Main>
      <Layout.Footer className="relative w-full">
        {/* Mobile / Tablet: Simple Footer */}
        <div className="bg-bg-second text-center py-4 lg:hidden w-full border-t border-bg-third/50">
          <p className="text-sm text-text-secondary">&copy; 2026 Fawe. All rights reserved.</p>
        </div>
        {/* Desktop: Full Premium Footer */}
        <div className="hidden lg:block w-full">
          <FullFooter />
        </div>
      </Layout.Footer>
    </Layout>
  );
};

export default SecondLayout;
