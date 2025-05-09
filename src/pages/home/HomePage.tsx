import React, { useLayoutEffect } from "react";
import withAuth from "@/hocs/auth/withAuth";
import { useTranslation } from "react-i18next";

const HomePage: React.FC = () => {

    const { t } = useTranslation() as { t: (key: string) => string };

    useLayoutEffect(() => {
        document.title = t("home:title")
    }, [t])

    return (
        <div className="flex justify-center items-center">
            <h1>Home Page</h1>
        </div>
    )
}

export default withAuth(HomePage);