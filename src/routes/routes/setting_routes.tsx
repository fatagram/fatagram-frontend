import RouteType from "@/routes/interface/route_type";
import SettingPage from "@/pages/settings/SettingPage";
import AccountSettingPage from "@/pages/settings/sub_pages/privacy/AccountSettingPage";
import ThemeSettingPage from "@/pages/settings/sub_pages/general/ThemeSettingPage";
import ChangeNameForm from "@/features/settings/components/privacy/ChangeNameForm";

export const settingRoutes : RouteType = {
    path: "/settings",
    element: <SettingPage />,
    children: [
        {   
            path: "account", 
            element: <AccountSettingPage />,
            children: [
                { path: "name", element: <ChangeNameForm /> },
            ]
        },
        { path: "theme", element: <ThemeSettingPage /> },
    ]
}