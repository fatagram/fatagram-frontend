import React from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import withAuth from "../../../hocs/auth/withAuth";

const ProtectedLayout: React.FC = () => {
    return (
        <div>
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}

export default withAuth(ProtectedLayout);