import React from "react";
import Navbar from "../Navbar/Navbar";
import NavbarFooter from "../Navbar/NavbarFooter";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {

    return (
        <div className="relative flex flex-col bg-[var(--second-bg-color)] min-h-screen">
            <Navbar className="fixed z-40 w-full"/>
            <main className="relative">
                <Outlet/>
            </main>
            <NavbarFooter className="sm:hidden flex fixed z-40 bottom-0 w-full"/>
        </div>
    )
}

export default Layout