import RouteType from "../interface/RouteType";
import ProfilePage from "@/pages/profile/ProfilePage";
import PostsPage from "@/pages/profile/sub_pages/posts/PostsPage";
import ProfileFriendsPage from "@/pages/profile/sub_pages/friends/ProfileFriendsPage";
import ProfileAboutPage from "@/pages/profile/sub_pages/about/ProfileAboutPage";
import ProfileAboutOverview from "@/pages/profile/sub_pages/about/ProfileAboutOverview";

export const userRoute: RouteType = { 
    path: "/:userParam",
    element: (
        <ProfilePage/>
    ),
    children: [
        {
            path: "",
            element: <PostsPage />,
            index: true
        },
        {
            path: "friends",
            element: <ProfileFriendsPage />,
        },
        {
            path: "about",
            element: <ProfileAboutPage />,
            children: [
                {
                    path: "overview",
                    element: <ProfileAboutOverview />,
                    index: true
                },
                {
                    path: "work-and-education",
                    element: <div>Work and Education</div>,
                },
                {
                    path: "contact-info",
                    element: <div>Contact Information</div>,
                },
                {
                    path: "places-lived",
                    element: <div>Places Lived</div>,
                }
            ]
        },
        {
            path: "photos",
            element: <div>Photos</div>,
        },
        {
            path: "videos",
            element: <div>Videos</div>,
        },
        {
            path: "settings",
            element: <div>Settings</div>,
        }
    ]
};