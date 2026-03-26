import { ComponentProps } from "@/components/common/component-type";
import Card from "@/components/ui/card/card";
import { SidebarLayout } from "@/components/ui/sidebar-layout/sidebar-layout";
import clsx from "clsx";

interface SidebarPageLayoutProps extends ComponentProps {
  title?: string;
  className?: string;
  navbar?: React.ReactNode;
  showSidebar?: boolean;
  setShowSidebar?: (show: boolean) => void;
}

export const SidebarPageLayout: React.FC<SidebarPageLayoutProps> = ({
  title,
  navbar,
  className,
  showSidebar,
  setShowSidebar,
  children,
}) => {
  return (
    <SidebarLayout
      title={title}
      className={clsx("bg-bg-second sm:bg-bg-fourth", className)}
      navbar={navbar}
      showSidebar={showSidebar}
      setShowSidebar={setShowSidebar}
    >
      <div className={clsx("flex items-center justify-center flex-1  mt-1")}>
        <div className="w-full sm:max-w-[750px]">{children}</div>
      </div>
    </SidebarLayout>
  );
};

interface SidebarPageProps extends ComponentProps {}

export const SidebarPage: React.FC<SidebarPageProps> = ({ children }) => {
  return <div className="flex justify-center w-full">{children}</div>;
};

interface SidebarPageCardProps extends ComponentProps {
  title?: string;
}
export const SidebarPageCard: React.FC<SidebarPageCardProps> = ({ title, children, className }) => {
  return (
    <Card
      title={title}
      className={clsx("w-full p-0 sm:p-8 shadow-none sm:shadow-lg", className)}
      titleClassName="mb-5"
      childrenClassName="flex flex-col gap-7"
    >
      {children}
    </Card>
  );
};
