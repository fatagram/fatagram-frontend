import React from "react";
import { Outlet } from "react-router-dom";

const NoNavbarLayout: React.FC = () => {
    return (
        <div className="relative w-screen h-screen flex flex-col bg-[var(--bg-color)]">
            <main className="relative z-0 flex-1">
                <Outlet />
            </main>
        </div>
    )
}

export default NoNavbarLayout;