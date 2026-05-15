import FriendPage from "@/features/friends/friends-page";
import RouteType from "../types/route-type";
import RequestsPage from "@/features/friends/requests/requests-page";
import AddFriendsPage from "@/features/friends/add-friends-page";

export const friendsRoutes: RouteType = {
  path: "/friends",
  element: <FriendPage />,
  type: "private",
  children: [
    {
      index: true,
      element: <AddFriendsPage />,
      keepAlive: true,
    },
    {
      path: "requests",
      element: <RequestsPage />,
      keepAlive: true,
    },
  ],
};
