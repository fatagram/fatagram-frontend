import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import withAuth from "@/hocs/auth/withAuth";

const HomePage: React.FC = () => {

    const { t } = useTranslation() as { t: (key: string) => string };

    useEffect(() => {
        document.title = t("home:title")
    });
        
    return (
        <div className="h-screen flex justify-center items-center bg-[var(--bg-color)]">
            <h1>Home Page</h1>
        </div>
    )
}

export default withAuth(HomePage);