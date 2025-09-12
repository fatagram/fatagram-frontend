import React from "react";
import Navbar from "../Navbar/Navbar";
import NavbarFooter from "../Navbar/NavbarFooter";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {

    return (
        <div className="relative h-screen flex flex-col bg-[var(--second-bg-color)]">
            <Navbar className="fixed z-40 w-full"/>
            <main className="relative">
                <Outlet/>
                <div className="sm:hidden flex w-full h-72"></div>
            </main>
            <NavbarFooter className="sm:hidden flex fixed z-40 bottom-0 w-full"/>
        </div>
    )
}

export default Layout