import React from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
    return (
        <div className="relative w-screen h-screen flex flex-col bg-[var(--bg-color)]">
            <Navbar className="fixed z-40 w-full"/>
            <main className="relative flex-1">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;