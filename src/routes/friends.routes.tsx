import FriendPage from "@/features/friends/friends-page";
import RouteType from "../types/route-type";
import RequestsPage from "@/features/friends/requests/requests-page";

export const friendsRoutes: RouteType = {
  path: "/friends",
  element: <FriendPage />,
  type: "private",
  children: [
    {
      path: "requests",
      element: <RequestsPage />,
      keepAlive: true,
    },
  ],
};
