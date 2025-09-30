import RouteType from "../interface/route-type";
import ProfilePage from "@/pages/profile/profile-page";
import PostsPage from "@/features/profile/posts/posts-page";
import ProfileFriendsPage from "@/features/profile/friends/profile-friends-page";
import ProfileAboutPage from "@/features/profile/about/profile-about-page";
import ProfileAboutOverview from "@/features/profile/about/components/profile-about-overview";

export const userRoute: RouteType = {
  path: "/:userParam",
  element: <ProfilePage />,
  children: [
    {
      path: "",
      element: <PostsPage />,
      index: true,
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
          index: true,
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
        },
      ],
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
    },
  ],
};
