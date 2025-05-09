import FriendRequests from "@/features/friends/components/FriendRequests";
import React from "react";

interface RequestsPageProps {

}

const RequestsPage: React.FC<RequestsPageProps> = () => {

    return (
        <div className="flex justify-center w-full">
            <FriendRequests className="w-full"/>
        </div>
    )
}

export default RequestsPage;