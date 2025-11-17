import RouteType from "../interface/route-type";
import ProfilePage from "@/pages/profile/profile-page";
import PostsPage from "@/features/profile/posts/posts-page";
import ProfileFriendsPage from "@/features/profile/friends/profile-friends-page";
import ProfileAboutPage from "@/features/profile/about/profile-about-page";
import ProfileAboutOverview from "@/features/profile/about/components/profile-about-overview";

export const userRoute: RouteType = {
  path: "/:userParam",
  element: <ProfilePage />,
  type: "public",
  children: [
    {
      path: "",
      element: <PostsPage />,
      type: "public",
      index: true,
    },
    {
      path: "friends",
      element: <ProfileFriendsPage />,
      type: "public",
    },
    {
      path: "about",
      element: <ProfileAboutPage />,
      type: "public",
      children: [
        {
          path: "overview",
          element: <ProfileAboutOverview />,
          type: "public",
          index: true,
        },
        {
          path: "work-and-education",
          element: <div>Work and Education</div>,
          type: "public",
        },
        {
          path: "contact-info",
          element: <div>Contact Information</div>,
          type: "public",
        },
        {
          path: "places-lived",
          element: <div>Places Lived</div>,
          type: "public",
        },
      ],
    },
    {
      path: "photos",
      element: <div>Photos</div>,
      type: "public",
    },
    {
      path: "videos",
      element: <div>Videos</div>,
      type: "public",
    },
    {
      path: "settings",
      element: <div>Settings</div>,
      type: "public",
    },
  ],
};
