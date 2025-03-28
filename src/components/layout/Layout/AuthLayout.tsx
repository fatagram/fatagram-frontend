import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
    return (
        <div>
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}

export default AuthLayout;