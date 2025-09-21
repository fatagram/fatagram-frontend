import RouteType from "@/routes/interface/RouteType";
import SettingPage from "@/pages/settings/SettingPage";
import AccountSettingPage from "@/pages/settings/sub_pages/privacy/AccountSettingPage";
import ThemeSettingPage from "@/pages/settings/sub_pages/general/ThemeSettingPage";
import ChangeNameForm from "@/features/settings/components/privacy/ChangeNameForm";
import LanguageSettingPage from "@/pages/settings/sub_pages/general/LanguageSettingPage";

export const settingRoutes : RouteType = {
    path: "/settings",
    element: <SettingPage/>,
    isUserOnly: true,
    children: [
        {   
            path: "", 
            element: <AccountSettingPage />,
            children: [
                { path: "name", element: <ChangeNameForm /> },
            ],
        },
        { path: "theme", element: <ThemeSettingPage/> },
        { path: "language", element: <LanguageSettingPage/>}
    ]
}