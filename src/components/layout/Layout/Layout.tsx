import React from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import NavbarFooter from "../Navbar/NavbarFooter";

const Layout: React.FC = () => {
    return (
        <div className="relative w-screen h-screen flex flex-col bg-[var(--bg-color-secondary)]">
            <Navbar className="fixed z-40 w-full"/>
            <main className="relative flex-1 sm:pb-0 pb-16">
                <Outlet />
            </main>
            <NavbarFooter className="sm:hidden flex fixed z-40 bottom-0 w-full"/>
        </div>
    )
}

export default Layout;