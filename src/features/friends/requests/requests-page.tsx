import React from "react";
import FriendRequests from "./components/friend-request";

interface RequestsPageProps {}

const RequestsPage: React.FC<RequestsPageProps> = () => {

    return (
        <div className="flex justify-center w-full">
            <FriendRequests className="w-full"/>
        </div>
    )
}

export default React.memo(RequestsPage);