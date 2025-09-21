import FriendPage from "@/pages/friends/FriendPage";
import ProtectedRoute from "../components/UserOnlyRoute";
import RouteType from "../interface/RouteType";
import RequestsPage from "@/pages/friends/sub_pages/RequestsPage";

export const friendsRoutes: RouteType = {
    path: "/friends",
    element: <FriendPage/>,
    isUserOnly: true,
    children: [
        {
            path: "requests",
            element: (
                <RequestsPage/>
            ),
            keepAlive: true
        }
    ]
}