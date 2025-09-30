import RouteType from "@/routes/interface/route-type";
import SettingPage from "@/pages/settings/setting-page";
import AccountSettingPage from "@/features/settings/privacy/account-setting-page";
import ThemeSettingPage from "@/features/settings/general/theme-setting-page";
import ChangeNameForm from "@/features/settings/privacy/components/change-name-form";
import LanguageSettingPage from "@/features/settings/general/language-setting-page";

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