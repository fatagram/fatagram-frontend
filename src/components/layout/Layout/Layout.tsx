import React from "react";

// === Layout Header === //
interface LayoutHeaderProps {
    children?: React.ReactNode;
    className?: string;
}
const LayoutHeader: React.FC<LayoutHeaderProps> = ({
    children,
    className
}) => {
    
    return (
        <header className={`fixed z-40 w-full ${className}`}>
            {children}
        </header>
    )
};

// === Layout Main === //
interface LayoutMainProps {
    children?: React.ReactNode;
    className?: string;
}
const LayoutMain: React.FC<LayoutMainProps> = ({
    children,
    className
}) => {
    return (
        <main className={`relative flex-grow pb-16 sm:pb-0 ${className}`}>
            {children}
        </main>
    )
};

// === Layout Footer === //
interface LayoutFooterProps {
    children?: React.ReactNode;
    className?: string;
}
const LayoutFooter: React.FC<LayoutFooterProps> = ({
    children,
    className
}) => {
    return (
        <footer className={`sm:hidden flex fixed z-40 bottom-0 w-full ${className}`}>
            {children}
        </footer>
    )
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

const Layout: LayoutComponent = ({
    children,
    className
}) => {
    return (
        <div className={`relative flex flex-col bg-[var(--second-bg-color)] min-h-screen ${className}`}>
            {children}
        </div>
    )
}

// Assign compound components
Layout.Header = LayoutHeader;
Layout.Main = LayoutMain;
Layout.Footer = LayoutFooter;

export default Layout;