import { ComponentProps } from "@/components/common/component-type";
import Card from "@/components/ui/card";
import { SidebarLayout } from "@/components/ui/sidebar-layout";
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
      className={className}
      navbar={navbar}
      showSidebar={showSidebar}
      setShowSidebar={setShowSidebar}
    >
      <div className={clsx("flex items-center justify-center flex-1")}>
        <div className="w-full sm:max-w-[800px] px-3 h-full box-border pt-1">{children}</div>
      </div>
    </SidebarLayout>
  );
};

interface SidebarPageProps extends ComponentProps {}

export const SidebarPage: React.FC<SidebarPageProps> = ({ children, className }) => {
  return <div className={clsx("flex justify-center w-full", className)}>{children}</div>;
};

interface SidebarPageCardProps extends ComponentProps {
  title?: string;
  childrenClassName?: string;
}
export const SidebarPageCard: React.FC<SidebarPageCardProps> = ({
  title,
  children,
  className,
  childrenClassName,
}) => {
  return (
    <Card
      title={title}
      className={clsx(
        "w-full !p-0 sm:!p-8 bg-transparent sm:bg-bg-main border-none sm:border-solid sm:!border-2 border-bg-fourth shadow-none",
        className,
      )}
      titleClassName="mb-2"
      childrenClassName={clsx("flex flex-col gap-7", childrenClassName)}
    >
      {children}
    </Card>
  );
};
