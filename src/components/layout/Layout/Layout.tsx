import React from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
    return (
        <div className="relative w-screen h-screen flex flex-col bg-[var(--bg-color)]">
            <Navbar className="fixed z-50 w-full"/>
            <main className="relative z-0 flex-1">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;