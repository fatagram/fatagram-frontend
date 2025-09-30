import FriendPage from "@/pages/friends/friends-page";
import RouteType from "../interface/route-type";
import RequestsPage from "@/features/friends/requests/requests-page";

export const friendsRoutes: RouteType = {
  path: "/friends",
  element: <FriendPage />,
  isUserOnly: true,
  children: [
    {
      path: "requests",
      element: <RequestsPage />,
      keepAlive: true,
    },
  ],
};
