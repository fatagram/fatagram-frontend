import React, { forwardRef } from "react";
import clsx from "clsx";

// === Layout Header === //
interface LayoutHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

const LayoutHeader = forwardRef<HTMLHeadElement, LayoutHeaderProps>(
  ({ children, className }, ref) => {
    return (
      <header ref={ref} className={clsx("z-40 w-full", className)} style={{}}>
        {children}
      </header>
    );
  },
);
LayoutHeader.displayName = "Layout.Header";

// === Layout Main === //
interface LayoutMainProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
}
const LayoutMain: React.FC<LayoutMainProps> = ({ children, className, style }) => {
  return (
    <div className={clsx("relative h-full", className)} style={style}>
      {children}
    </div>
  );
};

// === Layout Footer === //
interface LayoutFooterProps {
  children?: React.ReactNode;
  className?: string;
}
const LayoutFooter: React.FC<LayoutFooterProps> = ({ children, className }) => {
  return (
    <footer className={clsx("sm:hidden flex fixed z-40 bottom-0 w-full", className)}>
      {children}
    </footer>
  );
};

// === Layout Props === //
interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
}

// === Compound Component Type === //
interface LayoutComponent extends React.FC<LayoutProps> {
  Header: typeof LayoutHeader;
  Main: typeof LayoutMain;
  Footer: typeof LayoutFooter;
}

const Layout: LayoutComponent = ({ children, className }) => {
  return (
    <div className={clsx("relative flex flex-col bg-bg-eighth min-h-screen", className)}>
      {children}
    </div>
  );
};

// Assign compound components
Layout.Header = LayoutHeader;
Layout.Main = LayoutMain;
Layout.Footer = LayoutFooter;

export default Layout;
