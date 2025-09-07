import FriendPage from "@/pages/friends/FriendPage";
import ProtectedRoute from "../components/protected-route";
import RouteType from "../interface/route_type";
import RequestsPage from "@/pages/friends/sub_pages/RequestsPage";

export const friendsRoutes: RouteType = {
    path: "/friends",
    element: (
        <ProtectedRoute>
            <FriendPage/>
        </ProtectedRoute>
    ),
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